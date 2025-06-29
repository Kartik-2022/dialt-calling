// src/http/http-calls.js
import { BASE_URL } from "../config"; // Assuming BASE_URL is defined here
import {
  makePostRequest,
  makeGetRequest,
  makePutRequest,
  uploadFile,
  makeDeleteRequest,
} from "./http-service";
import { removeToken, setToken } from "./token-interceptor"; // Keep these imports as your login uses setToken


// --- DASHBOARD RELATED API CALLS ---





export const getAllActiviteLogs = (params = {}) => {
  return new Promise((resolve, reject) => {
     makePostRequest(BASE_URL + `/activity/logs`, true, params) // No query string appended here
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error (getAllActiviteLogs): ", e);
        reject(e);
      });
  });
};



// --- AUTHENTICATION API CALLS (from your original code) ---

export const login = (loginData) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/login", false, loginData)
      .then((res) => {
        if (res && res.token) {
            setToken(res.token); // Store the token on successful login
        }
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error (login): ", e);
        reject(e);
      });
  });
};

export const removeDeviceId = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/user/remove/device`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error (removeDeviceId): ", e);
        reject(e);
      });
  });
};

export const forgotPassword = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/forgotpassword", false, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const signup = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/signup", false, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const checkSignupTokenValidity = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/checksignuptoken", false, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const sendDemoRequest = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/demorequest", false, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getAllTaxonomyTerms = (taxonomy) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/taxonomyterms/${taxonomy}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getUserList = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/users", true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addUser = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/user", true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const editUser = (id, data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/user/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getAllEmailTemplates = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/emailTemplates`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const sendEmail = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/user/email`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getUserDetails = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/user/${id}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getCandidateList = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/candidates", true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getCandidateApplicationList = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + "/candidate/applications/" + id, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getJobFunctions = () => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/jobfunctions", true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addJobFunction = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/jobfunction", true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateJobFunction = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/jobfunction/${data.id || data?._id}`,
      true,
      data
    )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addCandidate = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/candidate", true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const editCandidate = (id, data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/candidate/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const sendEmailToCandidate = (data) => {
  return new Promise((resolve, reject) => {
    console.log("data", data);
    makePostRequest(BASE_URL + `/candidate/email`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const sendBulkEmailerToCandidate = (data) => {
  return new Promise((resolve, reject) => {
    console.log("data", data);
    makePostRequest(BASE_URL + `/candidate/survey/email`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getUserEmailList = (data) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/users/emaillist`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const shareCandidates = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/candidates/share`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const uploadCandidatesCSV = (data) => {
  return new Promise((resolve, reject) => {
    uploadFile(BASE_URL + `/candidate/csvupload/validated`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getSharedCandidateList = (id, data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/candidates/shared/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getCandidateDetails = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/candidate/${id}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const uploadResumeOfCandidate = (id, data) => {
  return new Promise((resolve, reject) => {
    uploadFile(BASE_URL + `/candidate/replaceCv/${id}`, true, data, "PUT")
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getClientOrganizations = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/client/organizations`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getAllLocations = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/taxonomyterms/location`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const deleteCandidates = (payload) => {
  console.log("apa >>", payload);
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/bulk/candidate/delete`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getDeleteCandidatesList = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/candidate/delete`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addNewOpening = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/position`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getAllOpenings = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/positions`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getOpeningDetails = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/position/` + id, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addCandidateToOpenings = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/applicant`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getAllApplicants = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/applicants`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getlistOfAllOpenings = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/positions`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addEmailTemplates = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/emailTemplate`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addClientOrganization = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/client/organization`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addClientOrganizationWithTeam = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/add/client/organization`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const editClientOrganization = ({ payload, id }) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/client/organization/${id}`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const editOrganization = (data, id) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/organization/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const uploadFileToCloudinary = (data) => {
  const url = `${BASE_URL}/upload/image`;
  console.log("data :>> ", data);
  return new Promise((resolve, reject) => {
    uploadFile(url, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getClientOrganizationById = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/client/organization/${id}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addNewTeam = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/client/team`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getAllTeams = (data) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/client/teams`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const editTeam = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/client/team/${data?.id || data?._id}`,
      true,
      data
    )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addMember = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/client/member`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const editMember = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/client/member/${data?.id || data?._id}`,
      true,
      data
    )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const deleteTeam = (id) => {
  return new Promise((resolve, reject) => {
    makeDeleteRequest(BASE_URL + `/client/team/${id}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const deleteMember = (id, teamId) => {
  return new Promise((resolve, reject) => {
    makeDeleteRequest(BASE_URL + `/client/member/${id}/${teamId}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getProfileDetails = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/me`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateProfileDetails = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/me`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateOrganization = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/me/organization`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getSystemWorkflowStages = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/workflowStages`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateOpeningDetails = (id, data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/position/` + id, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getAllNamedLists = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/namedLists`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const createNamedList = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/namedList`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addApplicantsToNamedList = (id, data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/namedList/${id}/addapplicants`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getNamedListDetails = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/namedList/${id}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const sendEmailToApplicants = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/applicant/email`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const createWorkflowStage = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/workflowStage`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getWorkflowStageWiseApllicantCountByPosition = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/position/${id}/applicantCount`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const sendContactUs = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/contact-us`, false, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addNewActivityForApplicant = (id, data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/applicant/${id}/activity`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateApplicant = (id, data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/applicant/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateWorkflowStageOfApplicant = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/applicant/moveToStage`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const scheduleStepForApplicant = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/schedule`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addNewNoteForApplicant = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/note`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getAllNotesOfApplicant = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/notes/${id}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const removeNote = (id) => {
  return new Promise((resolve, reject) => {
    makeDeleteRequest(BASE_URL + `/note/${id}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const sendMail = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/send/email`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const shareNamedList = (id, data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/namedList/${id}/share`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getSharedListDetails = (slug, token) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/sharedList/${slug}`, false, null, [
      { Authorization: `Bearer ${token}` },
    ])
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateWorkflowStage = (id, data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/workflowStage/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const deleteWorkflowStage = (id) => {
  return new Promise((resolve, reject) => {
    makeDeleteRequest(BASE_URL + `/workflowStage/${id}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const createWorkflowStageToOpening = (id, data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/position/workflowStage/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const deleteWorkflowStageFromOpening = (id, data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/position/workflowStage/delete/${id}`,
      true,
      data
    )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateWorkflowStageSeqAtOrganisation = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/workflowStage/change/order`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const parseResume = (data) => {
  return new Promise((resolve, reject) => {
    uploadFile(BASE_URL + `/resume/parser`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addGuestComment = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/sharedList/${data.slug}/comment`, false, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const fetchAllDecisionsForAnApplicant = (data, token) => {
  console.log("data => ", data);
  const id = data.applicantId;
  delete data.applicantId;
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/decisions/sharedList/${id}`, false, data, [
      { Authorization: `Bearer ${token}` },
    ])
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const allowGuestToAddComment = (data, token) => {
  console.log("data => ", data);
  const slug = data.slug;
  delete data.slug;
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/sharedList/${slug}/decision`, false, data, [
      { Authorization: `Bearer ${token}` },
    ])
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const allowGuestToAddSummary = ({ slug, data, token }) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/sharedList/${slug}/submit/decision`,
      false,
      data,
      [{ Authorization: `Bearer ${token}` }]
    )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

///decisions/namelist/:id
export const commentsViewInOpeningPage = (data) => {
  const id = data.applicantId;
  delete data.applicantId;
  return new Promise((resolve, reject) => {
    makePutRequest(BASE_URL + `/decisions/namelist/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const editEmailTemplate = (data) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/emailTemplate/${data?.id || data?._id}`,
      true,
      data
    )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getOrganizationNotifications = (id) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + `/notifications`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getIpData = () => {
  return new Promise((resolve, reject) => {
    fetch("https://ipapi.co/json/", {
      method: "GET",
    })
      .then((res) => {
        resolve(res.json());
      })
      .catch((e) => {
        console.log("getIpData call error: ", e);
        reject(e);
      });
  });
};

export const checkEmailsOrPhonesUniqueOrNot = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/check/unique/candidate", true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getUserStats = (data, id) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/stats/user/${id}`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const createTasks = (data) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + `/task`, true, data)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};
