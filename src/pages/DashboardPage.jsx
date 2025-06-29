// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import FiltersCard from '../components/FiltersCard';
import CallRecordsTable from '../components/CallRecordsTable';
import Header from '../components/Header';
import Pagination from '../config/Pagination';

import { getAllActiviteLogs } from '../http/http-calls';
import { getToken } from '../http/token-interceptor';

import {
  STATIC_USERS_OPTIONS,
  STATIC_JOB_FUNCTIONS_OPTIONS,
  STATIC_TAGS_OPTIONS
} from '../config/index';

import { useAuth } from '../context/AuthContext';

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
  customStartDate: "", // Still keep as string from UI perspective
  customEndDate: "",   // Still keep as string from UI perspective
  search: "",
  groupBy: "Date",
  filterBy: "Both",
};


// START OF DASHBOARD COMPONENT DEFINITION
const DashboardPage = () => {
  // --- STATE DECLARATIONS ---
  const [callRecords, setCallRecords] = useState([]);
  const [totalCallRecordsCount, setTotalCallRecordsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState(initialFilters);
  const searchRef = useRef(null);

  const [dynamicUsersOptions, setDynamicUsersOptions] = useState(STATIC_USERS_OPTIONS);
  const [dynamicJobFunctionsOptions, setDynamicJobFunctionsOptions] = useState(STATIC_JOB_FUNCTIONS_OPTIONS);
  const [dynamicTagsOptions, setDynamicTagsOptions] = useState(STATIC_TAGS_OPTIONS);

  const { logout } = useAuth();


  // --- HELPER FUNCTIONS ---

  const _prepareFiltersForPayload = (payload) => {
    const newPayload = { ...payload };
    console.log("[_prepareFiltersForPayload] --- START ---");
    console.log("[_prepareFiltersForPayload] Input Payload (raw filters state):", JSON.parse(JSON.stringify(payload)));

    let effectiveStartDate = undefined;
    let effectiveEndDate = undefined;

    const now = new Date(); // Get current date/time once

    switch (newPayload.dateFilter) {
      case "Today":
        effectiveStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0); // Start of today
        effectiveEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // End of today
        break;
      case "Custom Range":
        // Parse YYYY-MM-DD strings into Date objects reliably
        if (typeof newPayload.customStartDate === 'string' && newPayload.customStartDate) {
          const parts = newPayload.customStartDate.split('-');
          effectiveStartDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 0, 0, 0, 0);
        }
        if (typeof newPayload.customEndDate === 'string' && newPayload.customEndDate) {
          const parts = newPayload.customEndDate.split('-');
          effectiveEndDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 23, 59, 59, 999);
        }
        break;
      case "All":
        // No date/time filters should be sent for "All"
        break;
      // Other predefined ranges (Last 7 Days, This Month etc.) would go here if needed.
      default:
        // For any other dateFilter not explicitly handled, ensure no date range is sent
        break;
    }

    // Apply specific times if startTime/endTime are provided AND a valid date range was set up
    if ((newPayload.dateFilter === "Today" || newPayload.dateFilter === "Custom Range") && 
        effectiveStartDate instanceof Date && !isNaN(effectiveStartDate.getTime()) &&
        effectiveEndDate instanceof Date && !isNaN(effectiveEndDate.getTime())) {
        
        if (newPayload.startTime) {
            const [sh, sm] = newPayload.startTime.split(':').map(Number);
            effectiveStartDate.setHours(sh, sm, 0, 0);
        }
        if (newPayload.endTime) {
            const [eh, em] = newPayload.endTime.split(':').map(Number);
            effectiveEndDate.setHours(eh, em, 59, 999);
        }
    }

    // --- CRITICAL FIX: Re-create dateRange object and nest start/end dates ---
    if (effectiveStartDate instanceof Date && !isNaN(effectiveStartDate.getTime()) &&
        effectiveEndDate instanceof Date && !isNaN(effectiveEndDate.getTime())) {
      newPayload.dateRange = {
        start: effectiveStartDate.toISOString(),
        end: effectiveEndDate.toISOString(),
      };
    } else {
      // If dates are invalid or dateFilter is "All" or not covered, ensure no dateRange is sent
      delete newPayload.dateRange;
    }
    // --- END CRITICAL FIX ---


    // Clean up UI-specific filter keys from the payload
    delete newPayload.dateFilter; // Delete dateFilter from root
    delete newPayload.startTime;
    delete newPayload.endTime;
    delete newPayload.customStartDate;
    delete newPayload.customEndDate;

    // groupBy and filterBy are kept as they are in the original app's payload

    console.log("[_prepareFiltersForPayload] Final Payload Sent to API:", newPayload);
    console.log("[_prepareFiltersForPayload] --- END ---");
    return newPayload;
  };


  const _fetchActivityLogs = async (currentFilters, pageToFetch = 1) => {
    console.log("[_fetchActivityLogs] Setting isLoading to true.");
    setIsLoading(true);

    try {
      const token = getToken();
      if (!token) {
        console.error("Dashboard: Authentication token missing. Forcing logout.");
        logout();
        setIsLoading(false);
        return;
      }

      const finalBackendPayload = _prepareFiltersForPayload({
          ...currentFilters,
          page: pageToFetch,
          limit: currentFilters.limit,
      });

      console.log("[DashboardPage] Fetching activities with POST payload (pre-API call):", finalBackendPayload);
      const response = await getAllActiviteLogs(finalBackendPayload);

      if (response?.error === false && response?.activities) {
        const formattedCallRecords = response.activities.map(record => {
          let candidateName = 'N/A';
          let contactDetails = 'N/A';
          let jobFunction = 'N/A';
          let recordType = 'N/A';

          if (record.isDailyCallingTracker || record.isLead) {
            recordType = 'Lead';
            const nameMatch = record.title.match(/(?:to|on)\s+([A-Za-z\s]+?)(?:\s+on|\s+at|$)/i);
            if (nameMatch && nameMatch[1]) {
                candidateName = nameMatch[1].trim();
            } else if (record.candidateOrLeadName) {
                candidateName = record.candidateOrLeadName;
            } else if (record._lead?.name?.first) {
                candidateName = `${record._lead.name.first} ${record._lead.name.last || ''}`.trim();
            }
          } else {
            recordType = 'Candidate';
            if (record._candidate?.name?.first && record._candidate?.name?.last) {
              candidateName = `${record._candidate.name.first} ${record._candidate.name.last}`.trim();
            } else if (record.candidateOrLeadName) {
                candidateName = record.candidateOrLeadName;
            } else {
              const nameMatch = record.title.match(/(?:to|on)\s+([A-Za-z\s]+?)(?:\s+on|\s+at|$)/i);
              if (nameMatch && nameMatch[1]) {
                  candidateName = nameMatch[1].trim();
              }
            }
          }

          if (record._lead?.email) {
            contactDetails = record._lead.email;
          } else if (record._lead?.phones && record._lead.phones.length > 0) {
            contactDetails = record._lead.phones[0];
          } else if (record._candidate?.emails && record._candidate.emails.length > 0) {
            contactDetails = record._candidate.emails[0];
          } else if (record._candidate?.phones && record._candidate.phones.length > 0) {
            contactDetails = record._candidate.phones[0];
          } else if (record.candidateOrLeadEmail) {
              contactDetails = record.candidateOrLeadEmail;
          } else {
            contactDetails = 'N/A';
          }

          if (record._lead?._jobFunction?.name) {
            jobFunction = record._lead._jobFunction.name;
          } else if (record._candidate?._jobFunction?.name) {
            jobFunction = record._candidate._jobFunction.name;
          } else if (record._jobFunction) {
            const foundJobFunction = STATIC_JOB_FUNCTIONS_OPTIONS.find(
              (opt) => opt.value === record._jobFunction
            );
            jobFunction = foundJobFunction ? foundJobFunction.label : 'N/A';
          } else {
            jobFunction = 'N/A';
          }

          const user = record._createdBy?.name?.first && record._createdBy?.name?.last
                      ? `${record._createdBy.name.first} ${record._createdBy.name.last}`.trim()
                      : 'N/A';

          const tags = Array.isArray(record.note) ? record.note : [];

          let status = 'Unknown';
          if (record.title && typeof record.title === 'string') {
              if (record.title.toLowerCase().includes('answered')) status = 'Answered';
              else if (record.title.toLowerCase().includes('busy')) status = 'Busy';
              else if (record.title.toLowerCase().includes('not reachable')) status = 'Not Reachable';
              else if (record.title.toLowerCase().includes('added a note')) status = 'Note Added';
          }

          return {
            id: record._id,
            createdAt: record.createdAt || 'N/A',
            candidateName: candidateName,
            contactDetails: contactDetails,
            jobFunction: jobFunction,
            user: user,
            tags: tags,
            status: status,
            details: record.title || '',
            type: recordType,
          };
        });

        if (pageToFetch === 1) {
            setCallRecords(formattedCallRecords);
            console.log("[_fetchActivityLogs] Call records reset for new page 1 fetch. New count:", formattedCallRecords.length);
        } else {
            setCallRecords(prevRecords => [...prevRecords, ...formattedCallRecords]);
            console.log("[_fetchActivityLogs] Call records appended. Total count:", (callRecords.length + formattedCallRecords.length));
        }

        setTotalCallRecordsCount(response.totalCount || 0);
        console.log("[_fetchActivityLogs] Total records count from API:", response.totalCount);

      } else {
        console.error("Failed to fetch call records:", response?.message || "Unknown error.");
        setCallRecords([]);
        setTotalCallRecordsCount(0);
      }

    } catch (err) {
      console.error("Overall error during Dashboard data fetch:", err);
      logout();
      setCallRecords([]);
      setTotalCallRecordsCount(0);
    } finally {
      console.log("[_fetchActivityLogs] Setting isLoading to false.");
      setIsLoading(false);
    }
  };


  // --- EFFECTS ---

  const tokenCheckAndInitialFetch = async () => {
    const token = getToken();
    
    if (token) {
      _fetchActivityLogs(initialFilters, initialFilters.page);
    } else {
      setCallRecords([]);
      setTotalCallRecordsCount(0);
      setIsLoading(false);
      logout();
    }
  };

  useEffect(() => {
    tokenCheckAndInitialFetch();

    return () => {
      if (searchRef.current) {
        clearTimeout(searchRef.current);
      }
    };
  }, [logout]);


  // --- EVENT HANDLERS ---

  const _handleFilterChange = (key, value) => {
    console.log(`[DashboardPage] _handleFilterChange - Key: ${key}, Value:`, value);
    let updatedFilters = { ...filters, [key]: value };

    // When changing dateFilter, ensure custom date/time fields are explicitly cleared to empty strings
    // (not undefined) so they are always included in the payload sent to the backend.
    if (key === "dateFilter" && value === "Custom Range") {
      updatedFilters.customStartDate = ""; // Set to empty string
      updatedFilters.customEndDate = "";   // Set to empty string
      updatedFilters.startTime = "";
      updatedFilters.endTime = "";
      console.log("[DashboardPage] Date filter set to 'Custom Range'. Resetting custom date/time fields to empty strings.");
    } else if (key === "dateFilter" && value !== "Custom Range") {
        updatedFilters.customStartDate = ""; // Set to empty string
        updatedFilters.customEndDate = "";   // Set to empty string
        updatedFilters.startTime = "";
        updatedFilters.endTime = "";
        console.log(`[DashboardPage] Date filter set to '${value}'. Clearing custom date/time fields to empty strings.`);
    }

    if (key !== 'page' && key !== 'limit') {
        updatedFilters.page = 1;
        console.log("[DashboardPage] Clearing call records before new fetch for filter change.");
        setCallRecords([]); // Clear records to show loading state for new filters
        console.log("[DashboardPage] Filter (not page/limit) changed. Resetting page to 1 and triggering fetch.");
    }
    
    setFilters(updatedFilters); 
    console.log("[DashboardPage] _handleFilterChange - Filters state updated to:", updatedFilters);

    if (key === "search") {
      if (searchRef.current) clearTimeout(searchRef.current);
      searchRef.current = setTimeout(() => {
        console.log("[DashboardPage] Triggering _fetchActivityLogs via search debounce.");
        _fetchActivityLogs(updatedFilters, updatedFilters.page);
      }, 1000);
    } else {
      console.log(`[DashboardPage] Triggering _fetchActivityLogs for filter: ${key}.`);
      _fetchActivityLogs(updatedFilters, updatedFilters.page);
    }
  };


  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(totalCallRecordsCount / filters.limit);
    if (newPage >= 1 && newPage <= totalPages) {
        const newFilters = { ...filters, page: newPage };
        setFilters(newFilters);
        console.log("[DashboardPage] Clearing call records before new fetch for page change.");
        setCallRecords([]); // Clear records when changing page to prevent showing old data during fetch
        _fetchActivityLogs(newFilters, newPage);
    }
  };


  // --- COMPONENT RENDER ---

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="p-6 space-y-6 flex-grow">
        <FiltersCard
          filters={filters}
          onFilterChange={_handleFilterChange}
          uniqueUsers={dynamicUsersOptions}
          uniqueJobFunctions={dynamicJobFunctionsOptions}
          allTags={dynamicTagsOptions}
        />

        <h3 className="text-lg font-semibold mt-6 mb-2">Call Records {isLoading && (
          <button type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed" disabled>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
          </button>
        )}</h3>
        {!isLoading && (
          <>
            <CallRecordsTable
              data={callRecords}
            />
            {totalCallRecordsCount > filters.limit && (
              <Pagination
                currentPage={filters.page}
                totalItems={totalCallRecordsCount}
                itemsPerPage={filters.limit}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
        {!isLoading && callRecords.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No call records to display matching current filters.
          </div>
        )}
      </div>

      <footer className="w-full bg-white border-t border-gray-200 py-4 px-6 flex justify-between items-center text-xs text-gray-500 mt-auto">
        <div>
          &copy; 2025 Smoothire. <a href="#" className="underline">Terms & Privacy</a>
        </div>
        <div>
          Powered By <a href="#" className="underline">Logic Source</a>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
