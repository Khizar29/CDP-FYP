// src/components/SearchBar.js
import React from 'react';

const SearchBar = () => {
  return (
    <div className="w-full flex justify-center mt-4">
      <div className="bg-white rounded-full shadow-md p-4 md:p-6 flex items-center w-full md:w-auto">
        <div className="flex flex-col md:flex-row md:items-center w-full md:space-x-4">
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-semibold text-gray-700">Search Graduate Directory</label>
            <input 
              type="text" 
              placeholder="By Name, Skills" 
              className="mt-1 block w-full md:w-64 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-semibold text-gray-700">Class of</label>
            <select className="mt-1 block w-full md:w-40 p-2 border border-gray-300 rounded-md">
              <option>All Classes</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
            </select>
          </div>
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-semibold text-gray-700">Programs</label>
            <select className="mt-1 block w-full md:w-48 p-2 border border-gray-300 rounded-md">
              <option>All Programs</option>
              <option>Computer Science</option>
              <option>Electrical Engineering</option>
              <option>Social Sciences</option>
            </select>
          </div>
        </div>
        <button type="submit" className="ml-4 p-2 bg-purple-600 rounded-full text-white focus:outline-none">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
