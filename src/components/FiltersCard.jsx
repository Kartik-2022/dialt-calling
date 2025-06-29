// src/components/FiltersCard.jsx
import React from 'react';
import { Search } from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import Select from 'react-select'; // Import react-select

import DateTimeFilter from './DateTimeFilter'; // Import the DateTimeFilter component

const dateRangeOptions = [
  { label: "Today", value: "Today" },
  { label: "Last 7 Days", value: "Last 7 Days" },
  { label: "Last 30 Days", value: "Last 30 Days" },
  { label: "This Month", value: "This Month" },
  { label: "Last Month", value: "Last Month" },
  { label: "Custom Range", value: "Custom Range" },
  { label: "All", value: "All" },
];

const groupByOptions = [
  { label: "Date", value: "Date" },
  { label: "User", value: "User" },
  { label: "Job Function", value: "Job Function" },
  { label: "Candidate Type", value: "Candidate Type" },
];

const showTypeOptions = [
  { label: "Both", value: "Both" },
  { label: "Leads", value: "Leads" },
  { label: "Candidates", value: "Candidates" },
];

const FiltersCard = ({
  searchTerm, setSearchTerm,
  selectedUser, setSelectedUser,
  selectedJobFunction, setSelectedJobFunction, uniqueJobFunctions,
  selectedTags, setSelectedTags, allTags,
  selectedDateRange, setSelectedDateRange,
  startTime, setStartTime, endTime, setEndTime,
  customStartDate, setCustomStartDate, customEndDate, setCustomEndDate,
  groupBy, setGroupBy,
  showType, setShowType, // This maps to backend's 'filterBy'
  uniqueUsers // This prop is used for the options in the Users Select
}) => {

  // Helper function to find the currently selected value(s) for react-select
  const getSelectValue = (options, currentValues, isMulti) => {
    if (!options || !Array.isArray(options)) return isMulti ? [] : null;

    if (isMulti) {
      return options.filter(option => currentValues?.includes(option.value));
    } else {
      const targetValue = currentValues?.[0] || "All";
      return options.find(option => option.value === targetValue) || null;
    }
  };

  const handleSelectChange = (setter, isMulti) => (selectedOption) => {
    if (isMulti) {
      setter(selectedOption ? selectedOption.map(option => option.value) : []);
    } else {
      setter(selectedOption ? [selectedOption.value] : []); // Send as an array to match backend payload
    }
  };


  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Users Filter (Re-implemented with react-select following manager's pattern) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Users</label>
          <Select
            options={uniqueUsers}
            placeholder="All Users"
            classNamePrefix="react-select"
            value={getSelectValue(uniqueUsers, selectedUser, true)}
            onChange={handleSelectChange(setSelectedUser, true)}
            isClearable={true}
            isMulti
          />
        </div>

        {/* Job Functions Filter (Changed to react-select) */}
        <div>
          <label htmlFor="jobFunctionSelect" className="block text-sm font-medium text-gray-700 mb-1">Job Functions</label>
          <Select
            id="jobFunctionSelect"
            options={uniqueJobFunctions}
            placeholder="All Job Functions"
            classNamePrefix="react-select"
            value={getSelectValue(uniqueJobFunctions, selectedJobFunction, true)}
            onChange={handleSelectChange(setSelectedJobFunction, true)}
            isClearable={true}
            isMulti
          />
        </div>

        {/* Tags Filter (Changed to react-select) */}
        <div>
          <label htmlFor="tagsSelect" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <Select
            id="tagsSelect"
            options={allTags}
            placeholder="All Tags"
            classNamePrefix="react-select"
            value={getSelectValue(allTags, selectedTags, true)}
            onChange={handleSelectChange(setSelectedTags, true)}
            isClearable={true}
            isMulti
          />
        </div>
      </div>

      {/* DateTimeFilter component */}
      <DateTimeFilter
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        startTime={startTime}
        onStartTimeChange={setStartTime}
        endTime={endTime}
        onEndTimeChange={setEndTime}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
      />

      {/* Group By, Show Candidates/Leads, Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mt-6">
        <div className="space-y-2">
          <label htmlFor="groupBySelect" className="block text-sm font-medium text-gray-700">Group By</label>
          <select
            id="groupBySelect"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-10"
          >
            {groupByOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="showTypeSelect" className="block text-sm font-medium text-gray-700">Show Candidates/Leads</label>
          <select
            id="showTypeSelect"
            value={showType}
            onChange={(e) => setShowType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-10"
          >
            {showTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Search Input takes remaining space, spanning 2 columns on medium screens and 2 on large */}
        <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            id="searchInput"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>
    </Card>
  );
};

export default FiltersCard;
