// src/features/dashboard/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import FiltersCard from '../../components/FiltersCard';
import CallRecordsTable from '../../components/CallRecordsTable';
import Header from '../../components/Header';
import Pagination from '../../config/Pagination';

// Import API calls
import { getAllActiviteLogs } from '../../http/http-calls';
import { getToken } from '../../http/token-interceptor';

// Import static options from config/index.js
import {
  STATIC_USERS_OPTIONS,
  STATIC_JOB_FUNCTIONS_OPTIONS,
  STATIC_TAGS_OPTIONS
} from '../../config/index';

/**
 * @typedef {object} CallRecord
 * @property {string} id - Unique identifier for the call record
 * @property {string} createdAt - Timestamp of when the record was created (ISO string)
 * @property {string} candidateName - Name of the candidate
 * @property {string} contactDetails - Contact information for the candidate (email/phone combined)
 * @property {string} jobFunction - Job function associated with the call (maps from _candidate._jobFunction.name or _lead._jobFunction.name)
 * @property {string} user - User who made the call (the person who created the activity)
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
  customStartDate: undefined,
  customEndDate: undefined,
  search: "",
  groupBy: "Date",
  filterBy: "Both",
};


// START OF DASHBOARD COMPONENT DEFINITION
const Dashboard = ({ onLogout }) => {
  // --- STATE DECLARATIONS ---
  const [callRecords, setCallRecords] = useState([]);
  const [totalCallRecordsCount, setTotalCallRecordsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState(initialFilters);
  const searchRef = useRef(null);


  // --- HELPER FUNCTIONS ---

  const _prepareFiltersForPayload = (payload) => {
    const newPayload = { ...payload };

    if (!newPayload?.search) {
      delete newPayload?.search;
    }

    // Removed cleanAndMapMultiSelect function and its calls entirely
    // const cleanAndMapMultiSelect = (key) => { /* ... */ }
    // cleanAndMapMultiSelect("users");
    // cleanAndMapMultiSelect("jobFunctions");
    // cleanAndMapMultiSelect("tags");


    // --- START: REFINED DATE/TIME PAYLOAD LOGIC (Remains as is from previous turn) ---
    let effectiveStartDate;
    let effectiveEndDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today for date calculations

    // Determine base start and end dates based on dateFilter
    switch (newPayload.dateFilter) {
      case "Today":
        effectiveStartDate = new Date(today);
        effectiveEndDate = new Date(today);
        effectiveEndDate.setHours(23, 59, 59, 999); // End of today
        break;
      case "Last 7 Days":
        effectiveStartDate = new Date(today);
        effectiveStartDate.setDate(today.getDate() - 7);
        effectiveEndDate = new Date(today); // End of today
        effectiveEndDate.setHours(23, 59, 59, 999);
        break;
      case "Last 30 Days":
        effectiveStartDate = new Date(today);
        effectiveStartDate.setDate(today.getDate() - 30);
        effectiveEndDate = new Date(today); // End of today
        effectiveEndDate.setHours(23, 59, 59, 999);
        break;
      case "This Month":
        effectiveStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        effectiveEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of this month
        effectiveEndDate.setHours(23, 59, 59, 999);
        break;
      case "Last Month":
        effectiveStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        effectiveEndDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
        effectiveEndDate.setHours(23, 59, 59, 999);
        break;
      case "Custom Range":
        effectiveStartDate = newPayload.customStartDate ? new Date(newPayload.customStartDate) : undefined;
        effectiveEndDate = newPayload.customEndDate ? new Date(newPayload.customEndDate) : undefined;
        if (effectiveEndDate && !newPayload.endTime) {
            effectiveEndDate.setHours(23, 59, 59, 999);
        }
        break;
      case "All":
        // No date/time filters should be sent
        break;
      default:
        // No date range by default if not "All" or a specific range
        break;
    }

    if (newPayload.dateFilter === "Today" && newPayload.startTime && effectiveStartDate) {
        const [sh, sm] = newPayload.startTime.split(':').map(Number);
        effectiveStartDate.setHours(sh, sm, 0, 0);
    }
    if (newPayload.dateFilter === "Today" && newPayload.endTime && effectiveEndDate) {
        const [eh, em] = newPayload.endTime.split(':').map(Number);
        effectiveEndDate.setHours(eh, em, 59, 999);
    }

    if (newPayload.dateFilter === "Custom Range" && effectiveStartDate && newPayload.startTime) {
        const [sh, sm] = newPayload.startTime.split(':').map(Number);
        effectiveStartDate.setHours(sh, sm, 0, 0);
    }
    if (newPayload.dateFilter === "Custom Range" && effectiveEndDate && newPayload.endTime) {
        const [eh, em] = newPayload.endTime.split(':').map(Number);
        effectiveEndDate.setHours(eh, em, 59, 999);
    }

    if (effectiveStartDate) {
      newPayload.startDate = effectiveStartDate.toISOString();
    } else {
      delete newPayload.startDate;
    }

    if (effectiveEndDate) {
      newPayload.endDate = effectiveEndDate.toISOString();
    } else {
      delete newPayload.endDate;
    }

    delete newPayload.dateFilter;
    delete newPayload.startTime;
    delete newPayload.endTime;
    delete newPayload.customStartDate;
    delete newPayload.customEndDate;
    // --- END: REFINED DATE/TIME PAYLOAD LOGIC ---


    // Ensure client-side sorting fields are removed from payload
    delete newPayload.sortField;
    delete newPayload.sortDirection;

    // No explicit cleanup for empty multi-select arrays here,
    // as per your request to not perform data transformation.
    // The backend will receive empty arrays if nothing is selected.


    console.log("Payload after preparing filters:", newPayload);
    return newPayload;
  };


  const _fetchActivityLogs = async (currentFilters, pageToFetch = 1) => {
    setIsLoading(true);
    console.log("Attempting to fetch activity logs with filters:", currentFilters, "page:", pageToFetch);

    try {
      const token = await getToken();
      if (!token) {
        console.error("Dashboard: Authentication token missing. Forcing logout.");
        if (onLogout) onLogout();
        setIsLoading(false);
        return;
      }

      const finalBackendPayload = _prepareFiltersForPayload({
          ...currentFilters,
          page: pageToFetch,
          limit: currentFilters.limit,
      });

      console.log("Sending API request with payload:", finalBackendPayload);
      const response = await getAllActiviteLogs(finalBackendPayload);

      if (response?.error === false && response?.activities) {
        const formattedCallRecords = response.activities.map(record => {
          let candidateName = 'N/A';
          let contactDetails = 'N/A';
          let jobFunction = 'N/A';

          if (record.isDailyCallingTracker || record.isLead) {
            const nameMatch = record.title.match(/added a note to (.+?) on/);
            if (nameMatch && nameMatch[1]) {
                candidateName = nameMatch[1].trim();
            } else if (record.candidateOrLeadName) {
                candidateName = record.candidateOrLeadName;
            } else if (record._lead?.name?.first) {
                candidateName = `${record._lead.name.first} ${record._lead.name.last || ''}`.trim();
            }

            if (record._lead?.email) {
                contactDetails = record._lead.email;
            } else if (record._lead?.phones && record._lead.phones.length > 0) {
                contactDetails = record._lead.phones[0];
            } else if (record.candidateOrLeadEmail) {
                contactDetails = record.candidateOrLeadEmail;
            } else {
                contactDetails = 'N/A';
            }

            if (record._lead?._jobFunction?.name) {
                jobFunction = record._lead._jobFunction.name;
            } else if (record._jobFunction) {
                const foundJobFunction = STATIC_JOB_FUNCTIONS_OPTIONS.find(
                    opt => opt.value === record._jobFunction
                );
                jobFunction = foundJobFunction ? foundJobFunction.label : 'N/A';
            } else {
                jobFunction = 'N/A';
            }

          } else {
            candidateName = record._candidate?.name?.first && record._candidate?.name?.last
                            ? `${record._candidate.name.first} ${record._candidate.name.last}`
                            : 'N/A';

            if (record._candidate?.emails && record._candidate.emails.length > 0) {
                contactDetails = record._candidate.emails[0];
            } else if (record._candidate?.phones && record._candidate.phones.length > 0) {
                contactDetails = record._candidate.phones[0];
            } else {
                contactDetails = 'N/A';
            }

            jobFunction = record._candidate?._jobFunction?.name || 'N/A';
          }

          const user = record._createdBy?.name?.first && record._createdBy?.name?.last
                      ? `${record._createdBy.name.first} ${record._createdBy.name.last}`
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
            type: (record.isDailyCallingTracker || record.isLead) ? 'Lead' : 'Candidate',
          };
        });

        if (pageToFetch === 1) {
            setCallRecords(formattedCallRecords);
        } else {
            setCallRecords(prevRecords => [...prevRecords, ...formattedCallRecords]);
        }

        setTotalCallRecordsCount(response.totalCount || 0);
        console.log("Activity logs fetched successfully.");

      } else {
        console.error("Failed to fetch call records:", response?.message || "Unknown error.");
        setCallRecords([]);
        setTotalCallRecordsCount(0);
      }

    } catch (err) {
      console.error("Overall error during Dashboard data fetch:", err);
      if (onLogout) onLogout();
      setCallRecords([]);
      setTotalCallRecordsCount(0);
    } finally {
      setIsLoading(false);
      console.log("Fetching process finished.");
    }
  };


  // --- EFFECTS ---

  const tokenCheckAndInitialFetch = async () => {
    const token = await getToken();
    
    if (token) {
      _fetchActivityLogs(initialFilters, initialFilters.page);
    } else {
      setCallRecords([]);
      setTotalCallRecordsCount(0);
      setIsLoading(false);
      if (onLogout) onLogout();
    }
  };

  useEffect(() => {
    tokenCheckAndInitialFetch();

    return () => {
      if (searchRef.current) {
        clearTimeout(searchRef.current);
      }
    };
  }, [onLogout]);


  // --- EVENT HANDLERS ---

  const _handleFilterChange = (key, value) => {
    console.log(`_handleFilterChange called for key: ${key}, value:`, value);
    let updatedFilters = { ...filters, [key]: value };

    if (key === "dateFilter" && value === "Custom Range") {
      updatedFilters.customStartDate = undefined;
      updatedFilters.customEndDate = undefined;
      updatedFilters.startTime = "";
      updatedFilters.endTime = "";
      console.log("Date filter set to 'Custom Range'. Resetting custom date/time fields.");
    } else if (key === "dateFilter" && value !== "Custom Range") {
        updatedFilters.customStartDate = undefined;
        updatedFilters.customEndDate = undefined;
        updatedFilters.startTime = "";
        updatedFilters.endTime = "";
        console.log(`Date filter set to '${value}'. Clearing custom date/time fields.`);
    }

    if (key !== 'page' && key !== 'limit') {
        updatedFilters.page = 1;
        setCallRecords([]);
        console.log("Filter (not page/limit) changed. Resetting page to 1 and clearing records for new fetch.");
    }
    
    setFilters(updatedFilters); 
    console.log("Filters state updated to:", updatedFilters);

    if (key === "search") {
      if (searchRef.current) clearTimeout(searchRef.current);
      searchRef.current = setTimeout(() => {
        console.log("Triggering _fetchActivityLogs via search debounce.");
        _fetchActivityLogs(updatedFilters, updatedFilters.page);
      }, 1000);
    } else {
      console.log(`Triggering _fetchActivityLogs for filter: ${key}.`);
      _fetchActivityLogs(updatedFilters, updatedFilters.page);
    }
  };


  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(totalCallRecordsCount / filters.limit);
    if (newPage >= 1 && newPage <= totalPages) {
        const newFilters = { ...filters, page: newPage };
        setFilters(newFilters);
        setCallRecords([]);
        _fetchActivityLogs(newFilters, newPage);
    }
  };


  // --- MEMOIZED DATA ---


  // --- COMPONENT RENDER ---

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onLogout={onLogout} />

      <div className="p-6 space-y-6 flex-grow">
        <FiltersCard
          filters={filters}
          onFilterChange={_handleFilterChange}
          uniqueUsers={STATIC_USERS_OPTIONS}
          uniqueJobFunctions={STATIC_JOB_FUNCTIONS_OPTIONS}
          allTags={STATIC_TAGS_OPTIONS}
        />

        <h3 className="text-lg font-semibold mt-6 mb-2">Call Records {isLoading && (
          <button type="button" className="bg-indigo-500 ..." disabled>
              <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
              </svg>
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

export default Dashboard;
