// src/components/DateTimeFilter.jsx
import React from 'react';
import { Input } from './ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/Select';
import { CalendarDays } from 'lucide-react';

const DateTimeFilter = ({
  selectedDateRange,
  onDateRangeChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  customStartDate, // This will now be a YYYY-MM-DD string or undefined
  onCustomStartDateChange, // This will receive a YYYY-MM-DD string or undefined
  customEndDate,   // This will now be a YYYY-MM-DD string or undefined
  onCustomEndDateChange,   // This will receive a YYYY-MM-DD string or undefined
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
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="Custom Range">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      {selectedDateRange === "Custom Range" && (
        <>
          <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
            <label htmlFor="customStartDateInput" className="text-sm font-medium text-gray-700">Custom Start Date</label>
            <div className="relative">
              <Input
                type="date"
                id="customStartDateInput"
                value={customStartDate || ''} // Directly use the string value
                onChange={(e) => onCustomStartDateChange(e.target.value || undefined)} // Pass string directly
                className="pr-10"
              />
              <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
            <label htmlFor="customEndDateInput" className="text-sm font-medium text-gray-700">Custom End Date</label>
            <div className="relative">
              <Input
                type="date"
                id="customEndDateInput"
                value={customEndDate || ''} // Directly use the string value
                onChange={(e) => onCustomEndDateChange(e.target.value || undefined)} // Pass string directly
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
