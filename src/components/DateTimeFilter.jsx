// src/components/DateTimeFilter.jsx
import React from 'react';
import { Input } from './ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/Select';
import { CalendarDays } from 'lucide-react';

// Adjusted grid to be more flexible, especially when custom dates appear
const DateTimeFilter = ({
  selectedDateRange,
  onDateRangeChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
      <div className="space-y-2">
        <label htmlFor="dateRangeSelect" className="text-sm font-medium text-gray-700">Date Approached</label>
        <Select value={selectedDateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger id="dateRangeSelect">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* Only Today and Custom Range as requested */}
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="Custom Range">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show Start Time and End Time only if "Today" is selected */}
      {selectedDateRange === "Today" && (
        <>
          <div className="space-y-2">
            <label htmlFor="startTimeInput" className="text-sm font-medium text-gray-700">Start Time</label>
            <Input type="time" id="startTimeInput" value={startTime} onChange={(e) => onStartTimeChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="endTimeInput" className="text-sm font-medium text-gray-700">End Time</label>
            <Input type="time" id="endTimeInput" value={endTime} onChange={(e) => onEndTimeChange(e.target.value)} />
          </div>
        </>
      )}

      {/* Custom Range fields for date selection, conditionally displayed */}
      {selectedDateRange === "Custom Range" && (
        <>
          <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1"> {/* Adjusted col-span for custom dates */}
            <label htmlFor="customStartDateInput" className="text-sm font-medium text-gray-700">Custom Start Date</label>
            <div className="relative">
              {/* This input acts as a native date picker.
                  For a library like react-datepicker, you would integrate it here.
                  Example conceptual use (requires npm install react-datepicker and styling):
                  <DatePicker
                    selected={customStartDate}
                    onChange={(date) => onCustomStartDateChange(date)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  />
                  day.js would be used to format and parse dates, e.g.,
                  dayjs(date).format('YYYY-MM-DD')
              */}
              <Input
                type="date"
                id="customStartDateInput"
                value={customStartDate ? customStartDate.toISOString().split('T')[0] : ''}
                onChange={(e) => onCustomStartDateChange(e.target.value ? new Date(e.target.value) : undefined)}
                className="pr-10"
              />
              <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1"> {/* Adjusted col-span for custom dates */}
            <label htmlFor="customEndDateInput" className="text-sm font-medium text-gray-700">Custom End Date</label>
            <div className="relative">
              {/* Similar integration for react-datepicker for the end date */}
              <Input
                type="date"
                id="customEndDateInput"
                value={customEndDate ? customEndDate.toISOString().split('T')[0] : ''}
                onChange={(e) => onCustomEndDateChange(e.target.value ? new Date(e.target.value) : undefined)}
                className="pr-10"
              />
              <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateTimeFilter;
