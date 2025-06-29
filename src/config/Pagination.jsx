// src/config/Pagination.jsx
import React from 'react';
// Corrected path for Button from src/config/ to src/components/ui/Button
import { Button } from '../components/ui/Button'; 

/**
 * Pagination Component
 * Renders pagination controls (previous, next, page numbers).
 *
 * @param {object} props - Component props.
 * @param {number} props.currentPage - The current active page number (1-indexed).
 * @param {number} props.totalItems - The total number of items across all pages.
 * @param {number} props.itemsPerPage - The maximum number of items to display per page.
 * @param {function(number): void} props.onPageChange - Callback function when a page changes.
 */
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers to display, keeping a reasonable range around the current page
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Max number of page buttons to show at once

    // Always show first page
    if (totalPages > 0) {
      pageNumbers.push(1);
    }

    let startPage = Math.max(2, currentPage - Math.floor(maxPageButtons / 2) + 1);
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPageButtons / 2) - 1);

    if (currentPage <= Math.floor(maxPageButtons / 2) + 1) {
        endPage = Math.min(totalPages - 1, maxPageButtons);
    }
    if (currentPage >= totalPages - Math.floor(maxPageButtons / 2)) {
        startPage = Math.max(2, totalPages - maxPageButtons + 1);
    }

    // Add ellipsis if needed after page 1
    if (startPage > 2) {
      pageNumbers.push('...');
    }

    // Add middle page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed before last page
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always show last page if more than 1 page
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or no items
  }

  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      {/* Previous Button */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-4 py-2 text-sm font-medium text-gray-700">...</span>
          ) : (
            <Button
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === page
                  ? 'bg-indigo-600 text-white' // Active page style
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50' // Inactive page style
              }`}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
