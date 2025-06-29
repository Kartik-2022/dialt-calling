// src/components/CallRecordsTable.jsx
import React from 'react';
import { Button } from './ui/Button'; // Assuming you have a Button component
import { formatDate } from '../helper-methods';
/**
 * @typedef {object} CallRecord
 * @property {string} id - Unique identifier for the call record
 * @property {string} createdAt - Timestamp of when the record was created (ISO string)
 * @property {string} candidateName - Name of the candidate
 * @property {string} contactDetails - Contact information for the candidate (email/phone combined)
 * @property {string} jobFunction - Job function associated with the call
 * @property {string} user - User who made the call
 * @property {string[]} tags - Array of tags associated with the record
 * @property {string} status - Call status (e.g., "Answered", "Busy", "Not Reachable")
 * @property {string} [details] - Optional additional call details (activityTitle)
 * @property {string} type - 'Lead' or 'Candidate'
 */

// Removed handleSort, sortField, sortDirection from props
const CallRecordsTable = ({ data, handleSort, sortField, sortDirection }) => {

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">
              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Created At {getSortIcon("createdAt")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("candidateName")}
            >
              Candidate Name {getSortIcon("candidateName")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("contactDetails")}
            >
              Contact Details {getSortIcon("contactDetails")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("jobFunction")}
            >
              Job Function {getSortIcon("jobFunction")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("user")}
            >
              User {getSortIcon("user")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("tags")}
            >
              Tags {getSortIcon("tags")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 whitespace-nowrap text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.length ? 
          data?.map((record) => (
            <tr key={record.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate (record.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {/* Candidate Name as a clickable link */}
                {record.candidateName !== 'N/A' ? (
                  <a href={`#candidate-${record.id}`} className="text-indigo-600 hover:text-indigo-900">
                    {record.candidateName}
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.contactDetails}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.jobFunction}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.user}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {/* Display tags, e.g., comma-separated or as badges */}
                {record.tags && record.tags.length > 0 ? (
                  record.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-1">
                      {tag}
                    </span>
                  ))
                ) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-gray-700">{record.details}</span> {/* This is the activityTitle */}
                  {record.user !== 'N/A' && (
                    <a href={`#user-${record.user}`} className="text-indigo-600 hover:text-indigo-900">
                      {record.user}
                    </a>
                  )}
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                No call records to display.
              </td>
            </tr>
          )}
          
        </tbody>
      </table>
    </div>
  );
};

export default CallRecordsTable;
