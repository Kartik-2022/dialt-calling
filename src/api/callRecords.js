// src/api/callRecords.js
import { getAllActiviteLogs as originalGetAllActiviteLogs } from "../http/http-calls";
import { getToken } from "../http/token-interceptor";
import { STATIC_JOB_FUNCTIONS_OPTIONS } from "../config/index"; 


export const prepareFiltersForPayload = (filtersData) => {
  const newPayload = {
    page: filtersData.page,
    limit: filtersData.limit,
    groupBy: filtersData.groupBy,
    filterBy: filtersData.filterBy,
  };

  if (filtersData.users && filtersData.users.length > 0) {
    newPayload.users = filtersData.users;
  }

  if (filtersData.jobFunctions && filtersData.jobFunctions.length > 0) {
    newPayload.jobFunctions = filtersData.jobFunctions;
  }

  if (filtersData.tags && filtersData.tags.length > 0) {
    newPayload.tags = filtersData.tags;
  }

  if (filtersData.search && filtersData.search.trim() !== "") {
    newPayload.search = filtersData.search.trim();
  }

  switch (filtersData.dateFilter) {
    case "Today":
      newPayload.dateFilter = "Today";
      if (filtersData.startTime && filtersData.startTime.trim() !== "") {
        newPayload.startTime = filtersData.startTime;
      }
      if (filtersData.endTime && filtersData.endTime.trim() !== "") {
        newPayload.endTime = filtersData.endTime;
      }
      break;
    case "Custom Range":
      let effectiveStartDate = undefined;
      let effectiveEndDate = undefined;

      if (
        filtersData.customStartDate &&
        typeof filtersData.customStartDate === "string"
      ) {
        const parts = filtersData.customStartDate.split("-");
        effectiveStartDate = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
          0,
          0,
          0,
          0
        );
      }
      if (
        filtersData.customEndDate &&
        typeof filtersData.customEndDate === "string"
      ) {
        const parts = filtersData.customEndDate.split("-");
        effectiveEndDate = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
          23,
          59,
          59,
          999
        );
      }

      if (
        effectiveStartDate instanceof Date &&
        !isNaN(effectiveStartDate.getTime()) &&
        effectiveEndDate instanceof Date &&
        !isNaN(effectiveEndDate.getTime())
      ) {
        if (filtersData.startTime && filtersData.startTime.trim() !== "") {
          const [sh, sm] = filtersData.startTime.split(":").map(Number);
          effectiveStartDate.setHours(sh, sm, 0, 0);
        }
        if (filtersData.endTime && filtersData.endTime.trim() !== "") {
          const [eh, em] = filtersData.endTime.split(":").map(Number);
          effectiveEndDate.setHours(eh, em, 59, 999);
        }
        newPayload.dateRange = {
          start: effectiveStartDate.toISOString(),
          end: effectiveEndDate.toISOString(),
        };
      }
      break;
    case "All":
      break;
    default:
      break;
  }

  return newPayload;
};


export const formatCallRecords = (response) => {
  return response.activities.map((record) => {
    let candidateName = "N/A";
    let contactDetails = "N/A";
    let jobFunction = "N/A";
    let recordType = "N/A";

    if (record.isDailyCallingTracker || record.isLead) {
      recordType = "Lead";
      const nameMatch = record.title.match(
        /(?:to|on)\s+([A-Za-z\s]+?)(?:\s+on|\s+at|$)/i
      );
      if (nameMatch && nameMatch[1]) {
        candidateName = nameMatch[1].trim();
      } else if (record.candidateOrLeadName) {
        candidateName = record.candidateOrLeadName;
      } else if (record._lead?.name?.first) {
        candidateName = `${record._lead.name.first} ${
          record._lead.name.last || ""
        }`.trim();
      }
    } else {
      recordType = "Candidate";
      if (record._candidate?.name?.first && record._candidate?.name?.last) {
        candidateName =
          `${record._candidate.name.first} ${record._candidate.name.last}`.trim();
      } else if (record.candidateOrLeadName) {
        candidateName = record.candidateOrLeadName;
      } else {
        const nameMatch = record.title.match(
          /(?:to|on)\s+([A-Za-z\s]+?)(?:\s+on|\s+at|$)/i
        );
        if (nameMatch && nameMatch[1]) {
          candidateName = nameMatch[1].trim();
        }
      }
    }

    if (record._lead?.email) {
      contactDetails = record._lead.email;
    } else if (record._lead?.phones && record._lead.phones.length > 0) {
      contactDetails = record._lead.phones[0];
    } else if (
      record._candidate?.emails &&
      record._candidate.emails.length > 0
    ) {
      contactDetails = record._candidate.emails[0];
    } else if (
      record._candidate?.phones &&
      record._candidate.phones.length > 0
    ) {
      contactDetails = record._candidate.phones[0];
    } else if (record.candidateOrLeadEmail) {
      contactDetails = record.candidateOrLeadEmail;
    } else {
      contactDetails = "N/A";
    }

    if (record._lead?._jobFunction?.name) {
      jobFunction = record._lead._jobFunction.name;
    } else if (record._candidate?._jobFunction?.name) {
      jobFunction = record._candidate._jobFunction.name;
    } else if (record._jobFunction) {
      const foundJobFunction = STATIC_JOB_FUNCTIONS_OPTIONS.find(
        (opt) => opt.value === record._jobFunction
      );
      jobFunction = foundJobFunction ? foundJobFunction.label : "N/A";
    } else {
      jobFunction = "N/A";
    }

    const user =
      record._createdBy?.name?.first && record._createdBy?.name?.last
        ? `${record._createdBy.name.first} ${record._createdBy.name.last}`.trim()
        : "N/A";

    const tags = Array.isArray(record.note) ? record.note : [];

    let status = "Unknown";
    if (record.title && typeof record.title === "string") {
      if (record.title.toLowerCase().includes("answered"))
        status = "Answered";
      else if (record.title.toLowerCase().includes("busy")) status = "Busy";
      else if (record.title.toLowerCase().includes("not reachable"))
        status = "Not Reached";
      else if (record.title.toLowerCase().includes("added a note"))
        status = "Note Added";
    }

    return {
      id: record._id,
      createdAt: record.createdAt || "N/A",
      candidateName: candidateName,
      contactDetails: contactDetails,
      jobFunction: jobFunction,
      user: user,
      tags: tags,
      status: status,
      details: record.title || "",
      type: recordType,
    };
  });
};


export const fetchActivityLogs = async (filtersData) => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }
  const finalBackendPayload = prepareFiltersForPayload(filtersData);
  try {
    const response = await originalGetAllActiviteLogs(finalBackendPayload); 
    if (response?.error === false && Array.isArray(response?.activities)) {
      const formattedData = formatCallRecords(response);
      return { 
        data: formattedData,
        totalCount: response?.totalCount || 0,
      };
    } else {
      throw new Error(response?.message || "API response format unexpected or indicated an error.");
    }
  } catch (error) {
    console.error("Error in fetchActivityLogs (API layer):", error);
    throw error;
  }
};
