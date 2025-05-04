import React, { useState } from 'react';
import { motion } from 'framer-motion'; // For animation

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // For mobile-specific behavior

  const handleSearch = () => {
    onSearch({
      searchTerm,
      filterYear,
      filterDiscipline,
    });
    setIsMobileSearchOpen(false); // Close the modal on search (mobile)
  };

  // Toggle mobile search modal
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

  return (
    <>
      {/* Desktop version of the search bar */}
      <div className="hidden md:flex justify-center mt-4 px-2">
        <div className="bg-white rounded-full shadow-lg py-4 px-6 flex items-center w-full md:w-11/12 lg:w-3/4 xl:w-2/3">
          <div className="flex flex-col w-full md:w-1/3 px-4">
            <label className="block text-center text-lg font-semibold text-gray-700">Search Graduate Directory</label>
            <input
              type="text"
              id="search_alumni"
              placeholder="By Name, Skills"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2 block w-full p-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-col w-full md:w-1/4 px-4">
            <label className="block text-center text-lg font-semibold text-gray-700">Class of</label>
            <select
              className="mt-2 block w-full p-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">All Classes</option>
              {/* <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option> */}
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="flex flex-col w-full md:w-1/4 px-4">
            <label className="block text-center text-lg font-semibold text-gray-700">Programs</label>
            <select
              className="mt-2 block w-full p-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={filterDiscipline}
              onChange={(e) => setFilterDiscipline(e.target.value)}
            >
              <option value="">All Programs</option>
              <option value="BS(CS)">Computer Science</option>
              <option value="BS(AI and Data Science)">Artificial Intelligence</option>
              <option value="BS(AI and Data Science)">Data Science</option>
              <option value="BS(SE)">Software Engineering</option>
              <option value="BS(CY)">Cyber Security</option>
              <option value="BS(EE)">Electrical Engineering</option>
              {/* <option value="BS (Business Analytics)">Business Analytics</option>
              <option value="BS(FinTech)">Financial Technology</option> */}
            </select>
          </div>

          <div className="ml-4 flex justify-center items-center">
            <button
              type="button"
              id="search_btn"
              onClick={handleSearch}
              className="p-4 mx-5 mt-2 bg-blue-600 rounded-full text-white focus:outline-none hover:bg-blue-900 transition duration-200 ease-in-out"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile version of the search bar */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button
          onClick={toggleMobileSearch}
          className="p-4 bg-purple-600 rounded-full text-white focus:outline-none hover:bg-purple-700 shadow-lg"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      {/* Mobile search modal */}
      {isMobileSearchOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed inset-0 z-50 bg-white p-6 rounded-t-lg shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Search Filters</h2>
            <button onClick={toggleMobileSearch} className="text-xl">
              &times;
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Search Graduate Directory</label>
              <input
                type="text"
                placeholder="By Name, Skills"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 mt-1 border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Class of</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="p-3 mt-1 border rounded-md"
              >
                <option value="">All Classes</option>
              {/* <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option> */}
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Programs</label>
              <select
                value={filterDiscipline}
                onChange={(e) => setFilterDiscipline(e.target.value)}
                className="p-3 mt-1 border rounded-md"
              >
                <option value="">All Programs</option>
                <option value="BS(CS)">Computer Science</option>
              <option value="BS(AI and Data Science)">Artificial Intelligence</option>
              <option value="BS(AI and Data Science)">Data Science</option>
              <option value="BS(SE)">Software Engineering</option>
              <option value="BS(CY)">Cyber Security</option>
              <option value="BS(EE)">Electrical Engineering</option>
              {/* <option value="Business Analytics">Business Analytics</option>
              <option value="Financial Technology">Financial Technology</option> */}
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg"
            >
              Search
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SearchBar;
