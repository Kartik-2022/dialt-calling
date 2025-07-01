// src/pages/private/DashboardPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
// Corrected import paths for components (relative to src/pages/private/)
import Header from "../../components/Header";
import FiltersCard from "../../components/FiltersCard";
import CallRecordsTable from "../../components/CallRecordsTable";
import Pagination from "../../config/Pagination"; // Pagination is in config folder
import AddEntryModal from "../../components/AddEntryModal"; // Import the new modal wrapper

import { getAllActiviteLogs } from "../../http/http-calls";
import { getToken } from "../../http/token-interceptor";

import {
  STATIC_USERS_OPTIONS,
  STATIC_JOB_FUNCTIONS_OPTIONS,
  STATIC_TAGS_OPTIONS,
} from "../../config/index";

import { useAuth } from "../../context/AuthContext"; // Corrected AuthContext path

/**
 * @typedef {object} CallRecord
 * @property {string} id - Unique identifier for the call record
 * @property {string} createdAt - Timestamp of when the record was created (ISO string)
 * @property {string} candidateName - Name of the candidate
 * @property {string} contactDetails - Contact information for the candidate (email/phone combined)
 * @property {string} jobFunction - Job function associated with the call (maps from _candidate._jobFunction.name or _lead._jobFunction.name)
 * @property {string} user - User who made the call (the person who _created_ the activity)
 * @property {string[]} tags - Array of tags associated with the record (maps from 'note')
 * @property {string} status - Call status (e.g., "Answered", "Busy", "Not Reachable") // Derived
 * @property {string} [details] - Optional additional call records data (activityTitle)
 * @property {string} type - 'Lead' or 'Candidate' (maps from isDailyCallingTracker)
 */

const initialFilters = {
  page: 1,
  limit: 10,
  users: [],
  jobFunctions: [],
  tags: [],
  dateFilter: "Today",
  startTime: "",
  endTime: "",
  customStartDate: "",
  customEndDate: "",
  search: "",
  groupBy: "Date",
  filterBy: "Both",
};

const DashboardPage = () => {
  const [callRecords, setCallRecords] = useState({
    data: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const searchRef = useRef(null);

  const { logout } = useAuth(); // Destructure logout from useAuth

  // State to control the Add Entry Modal visibility
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);

  // Function to toggle the Add Entry Modal
  const toggleAddEntryModal = useCallback(() => {
    setIsAddEntryModalOpen(prev => !prev);
  }, []);

  // Function to refresh data after a successful new entry submission
  const handleNewEntrySuccess = useCallback(() => {
    // Reset filters to initial state and re-fetch data
    setFilters(initialFilters);
    _fetchActivityLogs(initialFilters, 1); // Fetch data for page 1
  }, []); // No dependencies needed if initialFilters is constant

  const _prepareFiltersForPayload = (filtersData) => {
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

  const formatCallRecords = (response) => {
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

  const _fetchActivityLogs = useCallback(async (currentFilters, pageToFetch = 1) => {
    try {
      setIsLoading(true);

      const token = getToken();
      if (!token) {
        logout();
        return;
      }

      const finalBackendPayload = _prepareFiltersForPayload({
        ...currentFilters,
        page: pageToFetch,
        limit: currentFilters.limit,
      });

      const response = await getAllActiviteLogs(finalBackendPayload);

      const formattedCallRecords = formatCallRecords(response);

      if (response?.error === false && response?.activities) {
        setCallRecords({
          data: formattedCallRecords,
          totalCount: response?.totalCount || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      setCallRecords({ data: [], totalCount: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const initialFetch = useCallback(() => {
    _fetchActivityLogs(initialFilters, initialFilters.page);
  }, [_fetchActivityLogs]);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);


  const _handleFilterChange = (key, value) => {
    let updatedFilters = { ...filters, [key]: value };

    if (key === "dateFilter" && value === "Custom Range") {
      updatedFilters.customStartDate = "";
      updatedFilters.customEndDate = "";
      updatedFilters.startTime = "";
      updatedFilters.endTime = "";
    } else if (key === "dateFilter" && value !== "Custom Range") {
      updatedFilters.customStartDate = "";
      updatedFilters.customEndDate = "";
      updatedFilters.startTime = "";
      updatedFilters.endTime = "";
    }

    if (key !== "page" && key !== "limit") {
      updatedFilters.page = 1;
      setCallRecords({
        data: [],
        totalCount: 0,
      });
    }

    setFilters(updatedFilters);

    if (key === "search") {
      if (searchRef.current) clearTimeout(searchRef.current);
      searchRef.current = setTimeout(() => {
        _fetchActivityLogs(updatedFilters, updatedFilters.page);
      }, 1000);
    } else {
      _fetchActivityLogs(updatedFilters, updatedFilters.page);
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(callRecords?.totalCount / filters.limit);
    if (newPage >= 1 && newPage <= totalPages) {
      const newFilters = { ...filters, page: newPage };
      setFilters(newFilters);
      setCallRecords({
        data: [],
        totalCount: 0,
      });
      _fetchActivityLogs(newFilters, newPage);
    }
  };

  return (
    // Restored outer div for layout
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header /> {/* Header restored */}

      <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Add Entry Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleAddEntryModal} // This should open the modal
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + Add New Entry
          </button>
        </div>

        <FiltersCard
          filters={filters}
          onFilterChange={_handleFilterChange}
          uniqueUsers={STATIC_USERS_OPTIONS}
          uniqueJobFunctions={STATIC_JOB_FUNCTIONS_OPTIONS}
          allTags={STATIC_TAGS_OPTIONS}
        />

        <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2">
          Call Records{" "}
          {isLoading ? (
            <svg
              className="text-gray-300 animate-spin"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-900"
              ></path>
            </svg>
          ) : null}
        </h3>

        {callRecords?.totalCount ? (
          <CallRecordsTable data={callRecords?.data} />
        ) : isLoading ? (
          <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
            <svg
              className="text-gray-300 animate-spin"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-900"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No call records to display matching current filters.
          </div>
        )}

        <Pagination
          currentPage={filters.page}
          totalItems={callRecords?.totalCount}
          itemsPerPage={filters.limit}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Footer restored */}
      <footer className="w-full bg-white border-t border-gray-200 py-4 px-6 flex justify-between items-center text-xs text-gray-500 mt-auto">
        <div>
          &copy; 2025 Smoothire.{" "}
          <a href="#" className="underline">
            Terms & Privacy
          </a>
        </div>
        <div>
          Powered By{" "}
          <a href="#" className="underline">
            Logic Source
          </a>
        </div>
      </footer>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isAddEntryModalOpen}
        toggle={toggleAddEntryModal}
        onSuccess={handleNewEntrySuccess}
      />
    </div>
  );
};

export default DashboardPage;
