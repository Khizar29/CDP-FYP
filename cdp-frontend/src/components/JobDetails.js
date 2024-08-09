import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCalendarAlt, faArrowLeft, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: [],
    niche: [],
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const jobTypes = ['Remote', 'Onsite', 'Hybrid', 'Internship'];
  const niches = ['Backend Developer', 'Frontend Developer', 'Data Science', 'FullStack Developer', 'Nextjs Developer'];

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

    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job => filters.jobType.includes(job.job_type));
    }

    if (filters.niche.length > 0) {
      filtered = filtered.filter(job =>
        filters.niche.some(niche =>
          job.title.toLowerCase().includes(niche.toLowerCase()) ||
          job.qualification_req.toLowerCase().includes(niche.toLowerCase()) ||
          job.job_description.toLowerCase().includes(niche.toLowerCase()) ||
          job.responsibilities.toLowerCase().includes(niche.toLowerCase())
        )
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

  const handleCheckboxChange = (filterCategory, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (newFilters[filterCategory].includes(value)) {
        newFilters[filterCategory] = newFilters[filterCategory].filter(item => item !== value);
      } else {
        newFilters[filterCategory].push(value);
      }
      return newFilters;
    });
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  return (
    <div className="flex flex-col md:flex-row p-6 h-screen overflow-hidden">
      <aside className="w-full md:w-1/4 p-4 bg-blue-200 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Filter Jobs</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-900">Job Type</h3>
          {jobTypes.map(type => (
            <div key={type}>
              <label className="inline-flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  value={type}
                  checked={filters.jobType.includes(type)}
                  onChange={() => handleCheckboxChange('jobType', type)}
                />
                <span className="ml-2">{type}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-900">Niche</h3>
          {niches.map(niche => (
            <div key={niche}>
              <label className="inline-flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  value={niche}
                  checked={filters.niche.includes(niche)}
                  onChange={() => handleCheckboxChange('niche', niche)}
                />
                <span className="ml-2">{niche}</span>
              </label>
            </div>
          ))}
        </div>
      </aside>

      <main className="w-full md:w-3/4 h-full flex flex-col overflow-hidden">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Find your Job here.</h1>

        <div className="mb-4 flex items-center justify-center md:justify-start">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              className="pl-10 md:w-64 p-2 border rounded-lg"
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
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          <div className="w-full md:w-1/2 overflow-y-auto pr-4 h-full md:h-auto md:overflow-auto">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-blue-100 p-6 rounded-lg shadow-lg mb-4 cursor-pointer" onClick={() => handleJobClick(job)}>
                <h2 className="text-2xl font-bold mb-2 text-blue-900">{job.title}</h2>
                <p className="text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faBriefcase} /> {job.job_type}
                </p>
                <p className="text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} /> Posted on {new Date(job.posted_on).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-4">{job.qualification_req}</p>
                <Link to="#" className="text-blue-600 hover:underline">Click here to apply</Link>
                <Link to="#" className="block w-[66px] mt-4 bg-blue-900 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300">View</Link>
              </div>
            ))}
          </div>
          {selectedJob && (
            <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg overflow-y-auto h-full md:ml-6">
              <button className="text-blue-900 mb-4" onClick={handleBackToJobs}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Jobs
              </button>
              <h2 className="text-2xl font-bold mb-2 text-blue-900">{selectedJob.title}</h2>
              <p className="text-gray-700 mb-2">{selectedJob.job_type}</p>
              <p className="text-gray-700 mb-2">Posted on {new Date(selectedJob.posted_on).toLocaleDateString()}</p>
              <p className="text-gray-700 mb-2">{selectedJob.qualification_req}</p>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-900">Description</h3>
              <p className="text-gray-700 mb-4">{selectedJob.job_description}</p>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Responsibilities</h3>
              <p className="text-gray-700 mb-4">{selectedJob.responsibilities}</p>
              <button className="w-full bg-blue-900 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300">Apply Now</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobList;
