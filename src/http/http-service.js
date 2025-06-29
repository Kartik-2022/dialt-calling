// src/http/http-service.js
import { errorHandler } from "../helper-methods"; // Assuming this path is correct
import { getToken, removeToken } from "./token-interceptor"; // Import removeToken for 401 handling

const structureQueryParams = (params) => {
  let queryStrings = "?";
  const keys = Object.keys(params);
  keys.forEach((key, index) => {
    queryStrings += key + "=" + params[key];
    if (params[keys[index + 1]]) {
      queryStrings += "&";
    }
  });
  return queryStrings;
};

export const handleErrorIfAvailable = (httpResponse) => {
  switch (httpResponse.status) {
    case 401: {
      // Token expired or invalid - this is the main case to clear token and reload
      console.error("HTTP 401: Unauthorized. Clearing token and reloading.");
      try {
        // If removeDeviceId is a critical backend call on logout, it should be
        // initiated from your main logout handler (e.g., in App.jsx) to avoid circular dependencies.
        // For now, only clear the token.
        // const deviceId = localStorage.getItem("deviceId");
        // if (deviceId && deviceId !== "undefined") {
        //   removeDeviceId({ deviceId }); // This import can cause circular dep.
        // }
      } catch (error) {
        errorHandler(error);
      }
      removeToken(); // Use imported removeToken
      window.location.reload(); // Hard reload to ensure full state reset and redirection
      break;
    }
    case 403: {
      console.warn("HTTP 403: Forbidden. You don't have permission for this action.");
      // showToast("You don't have permission for this action", "warning");
      break;
    }
    // Other error statuses (like 404, 500) will now simply propagate as errors
    // and can be caught by the calling function (e.g., in Dashboard.jsx's catch block).
    default: {
      if (!httpResponse.ok) { // For any non-2xx response that isn't 401/403
        console.error(`HTTP Error: ${httpResponse.status} ${httpResponse.statusText} for ${httpResponse.url}`);
      }
    }
  }
};

// Helper to decide whether to parse JSON or not
const processResponse = async (res) => {
  // Check if there's no content or if it's not meant to be JSON
  const contentType = res.headers.get('Content-Type');
  const contentLength = res.headers.get('Content-Length');

  // If 204 No Content, or no content-type and no content-length (empty body), return null
  if (res.status === 204 || (!contentType && (contentLength === '0' || contentLength === null))) {
    console.log(`Response status ${res.status}: No content. Returning null.`);
    return null;
  }
  // If Content-Type is JSON, attempt to parse.
  if (contentType && contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      const text = await res.text();
      console.error("Raw response that failed JSON parsing:", text);
      throw new SyntaxError("Invalid JSON response from server. Raw: " + text.substring(0, 100) + "...");
    }
  }
  // For other content types (e.g., HTML for 404), return raw text or a simple object indicating non-JSON.
  // This prevents the `JSON.parse` error. The calling function will need to interpret this.
  console.warn(`Response is not JSON (Content-Type: ${contentType || 'none'}). Returning raw text.`);
  return await res.text(); // Return the raw text if it's not JSON
};


export const makeGetRequest = async (
  url,
  attachToken = false,
  params = null,
  header
) => {
  let queryString = "";
  if (params) {
    queryString = structureQueryParams(params);
  }
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json", // Keeping your original Content-Type for GET
  };
  if (header) {
    header.forEach((each) => {
      const key = Object.keys(each)[0];
      headers[key] = each[key];
    });
  }
  if (attachToken) {
    try {
      const authToken = await getToken();
      if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
      }
    } catch (error) {
      console.log("Error fetching auth token for GET: ", { error });
    }
  }
  return new Promise((resolve, reject) => {
    try {
      fetch(url + queryString, {
        method: "GET",
        headers: headers,
      })
        .then(res => { // Don't use async here, let processResponse handle async nature
          // Call handleErrorIfAvailable for status code side effects (like 401 reload)
          // The actual JSON parsing logic is now in processResponse
          return processResponse(res).then(responseBody => ({ res, responseBody }));
        })
        .then(({ res, responseBody }) => {
          // If responseBody is null (from 204), treat as successful empty response.
          // If it's a non-JSON error, `responseBody` might be string (HTML for 404)
          // If `responseBody` is string and `res.ok` is false, it's an error.
          if (res.ok) { // Check if the HTTP status itself is OK (2xx)
            if (responseBody === null) { // For 204 No Content
              resolve({ error: false, message: "No content" }); // Resolve as success with no content
            } else if (typeof responseBody === 'object' && responseBody !== null && responseBody.error === false) { // Assuming your backend returns { error: false, ... } for success
              resolve(responseBody);
            } else { // 200 OK, but unexpected body format (e.g., raw text if not JSON, or malformed JSON)
              console.warn("Unexpected successful response format:", responseBody);
              // Resolve with the raw body, let the calling component handle it
              resolve(responseBody);
            }
          } else { // HTTP Status is NOT OK (e.g., 400, 404, 500)
            console.error(`HTTP request failed (GET ${res.status}):`, responseBody);
            // If responseBody is a string (e.g., HTML for 404), wrap it in a readable error object
            reject(responseBody && typeof responseBody === 'object' ? responseBody : { message: `Request failed with status ${res.status}: ${responseBody || res.statusText}` });
          }
        })
        .catch((e) => {
          console.log("XHR GET Error in fetch chain: ", e);
          reject(e);
        });
    } catch (error) {
      console.log("XHR GET Error in try-catch: ", { error });
      reject(error);
    }
  });
};

export const makePostRequest = async (
  url,
  attachToken = false,
  params = {},
  header
) => {
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (header) {
    header.forEach((each) => {
      const key = Object.keys(each)[0];
      headers[key] = each[key];
    });
  }
  if (attachToken) {
    try {
      const authToken = await getToken();
      if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
      }
    } catch (e) {
      console.log("Error fetching auth token for POST: ", e);
    }
  }
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params),
      })
        .then(res => {
            return processResponse(res).then(responseBody => ({ res, responseBody }));
        })
        .then(({ res, responseBody }) => {
          if (res.ok) {
            if (responseBody === null) {
              resolve({ error: false, message: "No content" });
            } else if (typeof responseBody === 'object' && responseBody !== null && responseBody.error === false) {
              resolve(responseBody);
            } else {
              console.warn("Unexpected successful response format (POST):", responseBody);
              resolve(responseBody);
            }
          } else {
            console.error(`HTTP request failed (POST ${res.status}):`, responseBody);
            reject(responseBody && typeof responseBody === 'object' ? responseBody : { message: `Request failed with status ${res.status}: ${responseBody || res.statusText}` });
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.log({ error });
      reject();
    }
  });
};

export const makePutRequest = async (
  url,
  attachToken = false,
  params = {},
  header
) => {
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (header) {
    header.forEach((each) => {
      const key = Object.keys(each)[0];
      headers[key] = each[key];
    });
  }
  if (attachToken) {
    try {
      const authToken = await getToken();
      if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
      }
    } catch (e) {
      console.log("Error fetching auth token for PUT: ", e);
    }
  }
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(params),
      })
        .then(res => {
            return processResponse(res).then(responseBody => ({ res, responseBody }));
        })
        .then(({ res, responseBody }) => {
          if (res.ok) {
            if (responseBody === null) {
              resolve({ error: false, message: "No content" });
            } else if (typeof responseBody === 'object' && responseBody !== null && responseBody.error === false) {
              resolve(responseBody);
            } else {
              console.warn("Unexpected successful response format (PUT):", responseBody);
              resolve(responseBody);
            }
          } else {
            console.error(`HTTP request failed (PUT ${res.status}):`, responseBody);
            reject(responseBody && typeof responseBody === 'object' ? responseBody : { message: `Request failed with status ${res.status}: ${responseBody || res.statusText}` });
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.log({ error });
      reject();
    }
  });
};

export const makeDeleteRequest = async (
  url,
  attachToken = false,
  params = {}
) => {
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (attachToken) {
    try {
      const authToken = await getToken();
      if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
      }
    } catch (e) {
      console.log("Error fetching auth token for DELETE: ", e);
    }
  }
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify(params),
      })
        .then(res => {
            return processResponse(res).then(responseBody => ({ res, responseBody }));
        })
        .then(({ res, responseBody }) => {
          if (res.ok) {
            if (responseBody === null) {
              resolve({ error: false, message: "No content" });
            } else if (typeof responseBody === 'object' && responseBody !== null && responseBody.error === false) {
              resolve(responseBody);
            } else {
              console.warn("Unexpected successful response format (DELETE):", responseBody);
              resolve(responseBody);
            }
          } else {
            console.error(`HTTP request failed (DELETE ${res.status}):`, responseBody);
            reject(responseBody && typeof responseBody === 'object' ? responseBody : { message: `Request failed with status ${res.status}: ${responseBody || res.statusText}` });
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.log({ error });
      reject();
    }
  });
};

export const uploadFile = async (
  url,
  attachToken = false,
  formData,
  method
) => {
  let headers = {};
  if (attachToken) {
    try {
      const authToken = await getToken();
      if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
      }
    } catch (e) {
      console.log("Error fetching auth token for File Upload: ", e);
    }
  }
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method: method || "POST",
        headers: headers,
        body: formData,
      })
        .then(res => {
            return processResponse(res).then(responseBody => ({ res, responseBody }));
        })
        .then(({ res, responseBody }) => {
          if (res.ok) {
            if (responseBody === null) {
              resolve({ error: false, message: "No content" });
            } else if (typeof responseBody === 'object' && responseBody !== null && responseBody.error === false) {
              resolve(responseBody);
            } else if (responseBody.error) { // Your original logic was `jsonResponse.error` here
              console.log("responseBody :", responseBody);
              reject(responseBody);
            }
            else {
              console.warn("Unexpected successful response format (File Upload):", responseBody);
              resolve(responseBody);
            }
          } else {
            console.error(`HTTP request failed (File Upload ${res.status}):`, responseBody);
            reject(responseBody && typeof responseBody === 'object' ? responseBody : { message: `Request failed with status ${res.status}: ${responseBody || res.statusText}` });
          }
        })
        .catch((error) => {
          console.log({ error });
          reject(error);
        });
    } catch (error) {
      console.log({ error });
      reject();
    }
  });
};
