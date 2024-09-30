import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Show the first page, the last page, and a few pages around the current page
  const visiblePages = 2; // Number of pages to show on each side of the current page

  // Generate page numbers to display
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Always show the first page
      i === totalPages || // Always show the last page
      (i >= currentPage - visiblePages && i <= currentPage + visiblePages) // Show pages near the current page
    ) {
      pages.push(i);
    } else if (i === currentPage - visiblePages - 1 || i === currentPage + visiblePages + 1) {
      // Add ellipses ("...") when there's a gap between current and adjacent pages
      pages.push('...');
    }
  }

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 rounded-lg shadow ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        Previous
      </button>

      {/* Page Numbers with Ellipses */}
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)} // Only allow page change for numbers
          disabled={page === '...'}
          className={`px-4 py-2 rounded-lg shadow ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : page === '...'
              ? 'bg-transparent text-gray-500 cursor-default'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 rounded-lg shadow ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
