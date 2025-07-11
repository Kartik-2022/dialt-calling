// src/pages/private/DashboardPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "../../components/Header";
import FiltersCard from "../../components/FiltersCard";
import CallRecordsTable from "../../components/CallRecordsTable";
import Pagination from "../../config/Pagination";
import AddEntryModal from "../../components/AddEntryModal";
import AddressSearch from "../../components/AddressSearch";

import {
  STATIC_USERS_OPTIONS,
  STATIC_JOB_FUNCTIONS_OPTIONS,
  STATIC_TAGS_OPTIONS,
} from "../../config/index";

import { useAuth } from "../../context/AuthContext";

import { enablePushNotifications, setEmailSubscription, logoutEmailSubscription } from '../../utils/oneSignalHelpers';
import { useCallRecords } from '../../hooks/useCallRecordsQuery';


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
  const [filters, setFilters] = useState(initialFilters);
  const searchRef = useRef(null);
  const { logout } = useAuth();
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState({
    isOpen: false,
    data: null
  });
  const [emailInput, setEmailInput] = useState('');

  const { data: callRecordsData, isLoading, refetch, isFetching, isSuccess, isError, error } = useCallRecords(filters);


  const callRecords = callRecordsData?.data || [];
  const totalCount = callRecordsData?.totalCount || 0;

  const _toggleAddEntryModal = useCallback((isOpen = false, data = null) => {
    setIsAddEntryModalOpen({isOpen, data});
  }, []);

  const handleNewEntrySuccess = useCallback(() => {
    setFilters(initialFilters);
  }, []);

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
    }
    setFilters(updatedFilters);
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(totalCount / filters.limit);
    if (newPage >= 1 && newPage <= totalPages) {
      const newFilters = { ...filters, page: newPage };
      setFilters(newFilters);
    }
  };

  const handleEnablePush = () => {
    enablePushNotifications();
  };

  const handleEmailSubscribe = async () => {
    if (emailInput) {
      await setEmailSubscription(emailInput);
      setEmailInput('');
    } else {
      console.warn("Please enter an email address to subscribe.");
    }
  };

  const handleEmailUnsubscribe = async () => {
    await logoutEmailSubscription();
    setEmailInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex justify-between mb-4">
          <button
            onClick={handleEnablePush}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Enable Push Notifications
          </button>
          <button
            onClick={() => _toggleAddEntryModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + Add New Entry
          </button>
        </div>

     
        <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-white">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Email Notifications</h4>
          <input
            type="email"
            placeholder="Enter your email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleEmailSubscribe}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Subscribe Email
            </button>
            <button
              onClick={handleEmailUnsubscribe}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Unsubscribe Email
            </button>
          </div>
        </div>

        <AddressSearch />
       

        <FiltersCard
          filters={filters}
          onFilterChange={_handleFilterChange}
          uniqueUsers={STATIC_USERS_OPTIONS}
          uniqueJobFunctions={STATIC_JOB_FUNCTIONS_OPTIONS}
          allTags={STATIC_TAGS_OPTIONS}
        />

        <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2">
          Call Records{" "}
          
          {(isLoading || isFetching) && (
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
          )}
        </h3>

        {totalCount > 0 ? (
          <CallRecordsTable data={callRecords} />
        ) : isLoading || isFetching ? (
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
          totalItems={totalCount}
          itemsPerPage={filters.limit}
          onPageChange={handlePageChange}
        />
      </div>

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

      <AddEntryModal
        isOpen={isAddEntryModalOpen.isOpen}
        toggle={_toggleAddEntryModal}
        onSuccess={handleNewEntrySuccess}
      />
    </div>
  );
};

export default DashboardPage;
