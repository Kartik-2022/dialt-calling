// src/http/http-service.js
import { errorHandler } from "../helper-methods";
import { getToken, removeToken } from "./token-interceptor";


class HttpError extends Error {
  constructor(message, status, statusText, responseBody = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody; 
  }
}

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


const handleHttpSideEffects = (status) => {
  switch (status) {
    case 401: {
      console.error("HTTP 401: Unauthorized. Clearing token and reloading.");
      removeToken(); 
      break; 
    }
    case 403: {
      console.warn("HTTP 403: Forbidden. You don't have permission for this action.");
      break;
    }
    default:
      break;
  }
};


const processResponse = async (res) => {
  handleHttpSideEffects(res.status);

  const contentType = res.headers.get('Content-Type');
  const contentLength = res.headers.get('Content-Length');

  let responseBody = null;

  if (res.status !== 204 && (contentLength === null || parseInt(contentLength) > 0)) {
    if (contentType && contentType.includes('application/json')) {
      try {
        responseBody = await res.json();
      } catch (jsonError) {
        const text = await res.text(); 
        console.error("Error parsing JSON response:", jsonError);
        console.error("Raw response that failed JSON parsing:", text);

        throw new HttpError(
          "Invalid JSON response from server.",
          res.status,
          res.statusText,
          text.substring(0, 100) + "..."
        );
      }
    } else {
      responseBody = await res.text();
      console.warn(`Response is not JSON (Content-Type: ${contentType || 'none'}). Returning raw text.`);
    }
  }

  if (!res.ok) {
    const errorMessage = (responseBody && typeof responseBody === 'object' && responseBody.message)
      ? responseBody.message
      : (typeof responseBody === 'string' && responseBody.length > 0)
        ? responseBody
        : res.statusText || "An unknown error occurred.";

    throw new HttpError(
      errorMessage,
      res.status,
      res.statusText,
      responseBody 
    );
  }

  return responseBody;
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
    } catch (error) {
      console.log("Error fetching auth token for GET: ", { error });
    }
  }
  return new Promise((resolve, reject) => {
    fetch(url + queryString, {
      method: "GET",
      headers: headers,
    })
      .then(processResponse) 
      .then(data => {
       
        if (data === null || (typeof data === 'object' && data !== null && data.error === false)) {
          resolve(data === null ? { error: false, message: "No content" } : data);
        } else {
          console.warn("Unexpected successful response format (GET):", data);
          resolve(data); 
        }
      })
      .catch((error) => {
        console.error("XHR GET Error in fetch chain:", error);
        reject(error);
      });
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
    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params),
    })
      .then(processResponse) 
      .then(data => {
        if (data === null || (typeof data === 'object' && data !== null && data.error === false)) {
          resolve(data === null ? { error: false, message: "No content" } : data);
        } else {
          console.warn("Unexpected successful response format (POST):", data);
          resolve(data);
        }
      })
      .catch((error) => {
        console.error("XHR POST Error in fetch chain:", error);
        reject(error);
      });
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
    fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(params),
    })
      .then(processResponse) 
      .then(data => {
        if (data === null || (typeof data === 'object' && data !== null && data.error === false)) {
          resolve(data === null ? { error: false, message: "No content" } : data);
        } else {
          console.warn("Unexpected successful response format (PUT):", data);
          resolve(data);
        }
      })
      .catch((error) => {
        console.error("XHR PUT Error in fetch chain:", error);
        reject(error);
      });
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
    fetch(url, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify(params),
    })
      .then(processResponse) 
      .then(data => {
        if (data === null || (typeof data === 'object' && data !== null && data.error === false)) {
          resolve(data === null ? { error: false, message: "No content" } : data);
        } else {
          console.warn("Unexpected successful response format (DELETE):", data);
          resolve(data);
        }
      })
      .catch((error) => {
        console.error("XHR DELETE Error in fetch chain:", error);
        reject(error);
      });
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
    fetch(url, {
      method: method || "POST",
      headers: headers,
      body: formData,
    })
      .then(processResponse) 
      .then(data => {
        if (data === null || (typeof data === 'object' && data !== null && data.error === false)) {
          resolve(data === null ? { error: false, message: "No content" } : data);
        } else if (typeof data === 'object' && data !== null && data.error) {

          console.error("Application-level error in successful file upload response:", data);
          reject(data); 
        }
        else {
          console.warn("Unexpected successful response format (File Upload):", data);
          resolve(data);
        }
      })
      .catch((error) => {
        console.error("XHR File Upload Error in fetch chain:", error);
        reject(error);
      });
  });
};
