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

/**
 * FiltersCard component displays and manages various filters for the dashboard.
 *
 * @param {object} props - Component props.
 * @param {object} props.filters - The current filters object from Dashboard.
 * @param {function(string, any): void} props.onFilterChange - Callback for when a filter changes (key, value).
 * @param {Array<object>} props.uniqueUsers - Options for the user filter.
 * @param {Array<object>} props.uniqueJobFunctions - Options for the job function filter.
 * @param {Array<object>} props.allTags - Options for the tags filter.
 */
const FiltersCard = ({
  filters, // Now receiving the full filters object
  onFilterChange, // Now receiving the single onFilterChange function
  uniqueUsers,
  uniqueJobFunctions,
  allTags,
}) => {

  // Helper function to find the currently selected value(s) for react-select
  const getSelectValue = (options, currentValues, isMulti) => {
    if (!options || !Array.isArray(options)) return isMulti ? [] : null;

    if (isMulti) {
      const valuesArray = Array.isArray(currentValues) ? currentValues : [];
      return options.filter(option => valuesArray.includes(option.value));
    } else {
      const targetValue = currentValues;
      return options.find(option => option.value === targetValue) || null;
    }
  };

  // Generic handler for react-select components that will call the consolidated onFilterChange
  const handleSelectChange = (key, isMulti) => (selectedOption) => {
    if (isMulti) {
      onFilterChange(key, selectedOption ? selectedOption.map(option => option.value) : []);
    } else {
      onFilterChange(key, selectedOption ? selectedOption.value : "");
    }
  };


  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Users Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Users</label>
          <Select
            options={uniqueUsers}
            placeholder="All Users"
            classNamePrefix="react-select"
            value={getSelectValue(uniqueUsers, filters.users, true)} // Get value from filters
            onChange={handleSelectChange('users', true)} // Use onFilterChange
            isClearable={true}
            isMulti
          />
        </div>

        {/* Job Functions Filter */}
        <div>
          <label htmlFor="jobFunctionSelect" className="block text-sm font-medium text-gray-700 mb-1">Job Functions</label>
          <Select
            id="jobFunctionSelect"
            options={uniqueJobFunctions}
            placeholder="All Job Functions"
            classNamePrefix="react-select"
            value={getSelectValue(uniqueJobFunctions, filters.jobFunctions, true)} // Get value from filters
            onChange={handleSelectChange('jobFunctions', true)} // Use onFilterChange
            isClearable={true}
            isMulti
          />
        </div>

        {/* Tags Filter */}
        <div>
          <label htmlFor="tagsSelect" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <Select
            id="tagsSelect"
            options={allTags}
            placeholder="All Tags"
            classNamePrefix="react-select"
            value={getSelectValue(allTags, filters.tags, true)} // Get value from filters
            onChange={handleSelectChange('tags', true)} // Use onFilterChange
            isClearable={true}
            isMulti
          />
        </div>
      </div>

      {/* DateTimeFilter component - props are now derived from the 'filters' object */}
      <DateTimeFilter
        selectedDateRange={filters.dateFilter}
        onDateRangeChange={(value) => onFilterChange('dateFilter', value)}
        startTime={filters.startTime}
        onStartTimeChange={(value) => onFilterChange('startTime', value)}
        endTime={filters.endTime}
        onEndTimeChange={(value) => onFilterChange('endTime', value)}
        customStartDate={filters.customStartDate}
        onCustomStartDateChange={(value) => onFilterChange('customStartDate', value)}
        customEndDate={filters.customEndDate}
        onCustomEndDateChange={(value) => onFilterChange('customEndDate', value)}
      />

      {/* Group By, Show Candidates/Leads, Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mt-6">
        <div className="space-y-2">
          <label htmlFor="groupBySelect" className="block text-sm font-medium text-gray-700">Group By</label>
          <select
            id="groupBySelect"
            value={filters.groupBy} // Get value from filters
            onChange={(e) => onFilterChange('groupBy', e.target.value)} // Use onFilterChange
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
            value={filters.filterBy} // Get value from filters
            onChange={(e) => onFilterChange('filterBy', e.target.value)} // Use onFilterChange
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-10"
          >
            {showTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
          <Input
            type="text"
            placeholder="Search"
            value={filters.search} // Get value from filters
            onChange={(e) => onFilterChange('search', e.target.value)} // Use onFilterChange
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
