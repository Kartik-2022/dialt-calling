// src/components/FiltersCard.jsx
import React from 'react';
import { Search } from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import Select from 'react-select';

import DateTimeFilter from './DateTimeFilter';

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
  filters,
  onFilterChange,
  uniqueUsers,
  uniqueJobFunctions,
  allTags
}) => {

  const getSelectValue = (options, currentValues, isMulti) => {
    if (!options || !Array.isArray(options)) return isMulti ? [] : null;

    if (isMulti) {
      return options.filter(option => currentValues?.includes(option.value));
    } else {
      const targetValue = Array.isArray(currentValues) ? currentValues[0] : currentValues;
      return options.find(option => option.value === targetValue) || null;
    }
  };

  const handleReactSelectChange = (key) => (selectedOption) => {
    const value = selectedOption ? selectedOption.map(option => option.value) : [];
    console.log(`[FiltersCard] ReactSelect Change: ${key}, Value:`, value); // DEBUG LOG
    onFilterChange(key, value);
  };

  const handleNativeSelectChange = (key) => (e) => {
    const value = e.target.value;
    console.log(`[FiltersCard] Native Select Change: ${key}, Value:`, value); // DEBUG LOG
    onFilterChange(key, value);
  };

  const handleShadcnSelectChange = (key) => (value) => {
    console.log(`[FiltersCard] Shadcn Select Change: ${key}, Value:`, value); // DEBUG LOG
    onFilterChange(key, value);
  };

  const handleInputChange = (key) => (e) => {
    const value = e.target.value;
    console.log(`[FiltersCard] Input Change: ${key}, Value:`, value); // DEBUG LOG
    onFilterChange(key, value);
  };

  const handleDateChange = (key) => (date) => {
    console.log(`[FiltersCard] Date Picker Change: ${key}, Value:`, date); // DEBUG LOG
    onFilterChange(key, date);
  };


  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Users</label>
          <Select
            options={uniqueUsers}
            placeholder="All Users"
            classNamePrefix="react-select"
            value={getSelectValue(uniqueUsers, filters.users, true)}
            onChange={handleReactSelectChange('users')}
            isClearable={true}
            isMulti
          />
        </div>

        <div>
          <label htmlFor="jobFunctionSelect" className="block text-sm font-medium text-gray-700 mb-1">Job Functions</label>
          <Select
            id="jobFunctionSelect"
            options={uniqueJobFunctions}
            placeholder="All Job Functions"
            classNamePrefix="react-select"
            value={getSelectValue(uniqueJobFunctions, filters.jobFunctions, true)}
            onChange={handleReactSelectChange('jobFunctions')}
            isClearable={true}
            isMulti
          />
        </div>

        <div>
          <label htmlFor="tagsSelect" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <Select
            id="tagsSelect"
            options={allTags}
            placeholder="All Tags"
            classNamePrefix="react-select"
            value={getSelectValue(allTags, filters.tags, true)}
            onChange={handleReactSelectChange('tags')}
            isClearable={true}
            isMulti
          />
        </div>
      </div>

      <DateTimeFilter
        selectedDateRange={filters.dateFilter}
        onDateRangeChange={handleShadcnSelectChange('dateFilter')}
        startTime={filters.startTime}
        onStartTimeChange={handleInputChange('startTime')}
        endTime={filters.endTime}
        onEndTimeChange={handleInputChange('endTime')}
        customStartDate={filters.customStartDate}
        onCustomStartDateChange={handleDateChange('customStartDate')}
        customEndDate={filters.customEndDate}
        onCustomEndDateChange={handleDateChange('customEndDate')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mt-6">
        <div className="space-y-2">
          <label htmlFor="groupBySelect" className="block text-sm font-medium text-gray-700">Group By</label>
          <select
            id="groupBySelect"
            value={filters.groupBy}
            onChange={handleNativeSelectChange('groupBy')}
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
            value={filters.filterBy}
            onChange={handleNativeSelectChange('filterBy')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-10"
          >
            {showTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
          <Input
            type="text"
            placeholder="Search"
            value={filters.search}
            onChange={handleInputChange('search')}
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
