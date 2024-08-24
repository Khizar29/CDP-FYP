import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCalendarAlt, faArrowLeft, faSearch, faTimes, faFilter } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/JobList.css'

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    niche: '',
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const jobTypes = ['Remote', 'Onsite', 'Hybrid', 'Internship'];
  const niches = ['Backend Developer', 'Frontend Developer', 'Data Science', 'FullStack Developer', 'DevOps Engineer'];

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    } else {
      fetchJobs();
    }
  }, [user, navigate]);

  const applyFilters = useCallback(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.qualification_req.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.responsibilities.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.job_type === filters.jobType);
    }

    if (filters.niche) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.niche.toLowerCase()) ||
        job.qualification_req.toLowerCase().includes(filters.niche.toLowerCase()) ||
        job.job_description.toLowerCase().includes(filters.niche.toLowerCase()) ||
        job.responsibilities.toLowerCase().includes(filters.niche.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filters]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, jobs, applyFilters]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/jobs');
      setJobs(response.data.data);
      setFilteredJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

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

  return (
    <div className="flex flex-col p-6 h-screen overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 mr-4">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            className="pl-10 w-full p-2 border rounded-lg"
            placeholder="Search for jobs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
              {niches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Find your <span className='text-blue-400'>Job</span> here.</h1>
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
                  className="bg-blue-100 p-6  rounded-lg shadow-lg cursor-pointer"
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

      <AnimatePresence>
        {selectedJob && (
          <motion.div
            className="fixed inset-0 bg-white p-6 overflow-y-auto z-50 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <button className="text-blue-900 mb-4" onClick={handleBackToJobs}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Jobs
            </button>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{selectedJob.title}</h2>
            <p className="text-xl font-semibold mb-2 text-amber-400">{selectedJob.company_name}</p>
            <p className="text-gray-700 mb-2">{selectedJob.job_type}</p>
            <p className="text-gray-700 mb-2">Posted on {new Date(selectedJob.posted_on).toLocaleDateString()}</p>
            <h3 className="text-xl font-semibold text-blue-900 mt-4 mb-2">Requirements</h3>
            <p className="text-gray-700 mb-2">{selectedJob.qualification_req}</p>
            <h3 className="text-xl font-semibold text-blue-900 mt-4 mb-2">Description</h3>
            <p className="text-gray-700 mb-4">{selectedJob.job_description}</p>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Responsibilities</h3>
            <p className="text-gray-700 mb-4">{selectedJob.responsibilities}</p>
            <button className="w-[100px] bg-blue-900 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300">Apply Now</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobList;