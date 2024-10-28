import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCalendarAlt, faSearch, faTimes, faFilter } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/JobList.css';
import SignIn from './SignIn';
import JobView from './admin/manage/Jobs/ViewJob';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [signInOpen, setSignInOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    niche: '',
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(UserContext);

  const jobTypes = ['Remote', 'Onsite', 'Hybrid', 'Internship'];
  const niches = ['Backend Developer', 'Frontend Developer', 'Data Science', 'FullStack Developer', 'DevOps Engineer'];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Toggle sign-in modal
  const handleOpenSignIn = () => setSignInOpen(true);
  const handleCloseSignIn = () => setSignInOpen(false);

  // Fetch jobs from the server
  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs`, {
        params: {
          page,
          limit: 10,
        },
      });

      setJobs((prevJobs) => (page === 1 ? response.data.data : [...prevJobs, ...response.data.data]));
      setHasMore(response.data.data.length > 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }, [page]);

  // Apply search and filters
  const applyFilters = useCallback(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.qualification_req.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.responsibilities.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter((job) => job.job_type === filters.jobType);
    }

    if (filters.niche) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(filters.niche.toLowerCase()) ||
        job.qualification_req.toLowerCase().includes(filters.niche.toLowerCase()) ||
        job.job_description.toLowerCase().includes(filters.niche.toLowerCase()) ||
        job.responsibilities.toLowerCase().includes(filters.niche.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filters]);

  // Update filters on input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Load more jobs when user scrolls to the bottom
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    if (!user) {
      handleOpenSignIn();
    } else {
      fetchJobs(); // Fetch jobs only when the page or user state changes
    }
  }, [user, page, fetchJobs]);

  useEffect(() => {
    applyFilters(); // Apply filters whenever jobs, searchTerm, or filters change
  }, [jobs, searchTerm, filters, applyFilters]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  return (
    <div className="flex flex-col p-6 h-screen overflow-hidden">
      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 mr-4">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            className="pl-10 w-full p-2 border rounded-lg"
            placeholder="Search for jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <FontAwesomeIcon
              icon={faTimes}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              name="jobType"
              className="pl-10 p-2 border rounded-lg"
              value={filters.jobType}
              onChange={handleFilterChange}
            >
              <option value="">Job Type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              name="niche"
              className="pl-10 p-2 border rounded-lg"
              value={filters.niche}
              onChange={handleFilterChange}
            >
              <option value="">Niche</option>
              {niches.map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
        Find your <span className="text-blue-400">Job</span> here.
      </h1>
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        <div className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300">
          {filteredJobs.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 mx-2 my-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  className="bg-blue-100 p-6 rounded-lg shadow-lg cursor-pointer"
                  onClick={() => handleJobClick(job)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                >
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">{job.title}</h2>
                  <p className="text-xl font-semibold mb-2 text-amber-400">{job.company_name}</p>
                  <p className="text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faBriefcase} /> {job.job_type}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(job.posted_on).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <Link to="#" className="text-blue-600 hover:underline">Click here to apply</Link>
                  <Link to="#" className="block w-[66px] mt-4 bg-blue-900 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300">View</Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-gray-700">No jobs found</p>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <JobView job={selectedJob} handleBackToJobs={handleBackToJobs} />
        )}
      </AnimatePresence>

      {/* Sign In Modal */}
      {signInOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg relative max-w-md w-full">
            <button
              onClick={handleCloseSignIn}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <SignIn onClose={handleCloseSignIn} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
