import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Graduates/Pagination";
import { UserContext } from "../../contexts/UserContext";
import JobView from "../admin/manage/Jobs/ViewJob";

const FacultyManageJobs = () => {
  const { user } = useContext(UserContext); // Get logged-in recruiter
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const jobsPerPage = 10;

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  const fetchJobs = async (page = 1) => {
    if (!user || user.role !== "faculty") return; // Ensure only recruiters can access

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/faculty`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page,
            limit: jobsPerPage,
            searchTerm: searchTerm,
            filterDate: filterDate,
          },
        }
      );
      setJobs(response.data.data);
      setFilteredJobs(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, searchTerm, filterDate, user]); // Refetch when filters change

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 md:mb-0">
              My Jobs
            </h2>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by Title"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full md:w-auto py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <input
                type="date"
                value={filterDate}
                onChange={handleDateChange}
                className="w-full md:w-auto py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <Link
                to="addjob"
                id="NewJob"
                className="w-full md:w-auto inline-flex items-center justify-center bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                <FaPlus className="mr-2" /> New Job
              </Link>
            </div>
          </div>

          {/* ✅ Table for Larger Screens */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full bg-white rounded-lg shadow-md mb-6">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-3 text-center border-b">#</th>
                  <th className="py-2 px-3 text-left border-b">Job Title</th>
                  <th className="py-2 px-3 text-left border-b">Posted On</th>
                  <th className="py-2 px-3 text-left border-b">Status</th>
                  <th className="py-2 px-3 text-center border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <tr
                      key={job._id}
                      className="border-b hover:bg-gray-100 transition duration-300"
                    >
                      <td className="py-2 px-3 text-center">{index + 1}</td>
                      <td className="py-2 px-3">{job.title}</td>
                      <td className="py-2 px-3">
                        {new Date(job.posted_on).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3">{job.status}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-300 mr-2"
                          onClick={() => openModal(job)}
                          id="ViewJob"
                        >
                          View
                        </button>
                        {/* <Link
                          to="/recruiter/jobs/manage"
                          state={{ action: "edit", data: job }}
                        >
                          <button
                            className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition duration-300 mr-2"
                            id="EditJob"
                          >
                            Edit
                          </button>
                        </Link> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-gray-500"
                    >
                      No Jobs Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Card Layout (Only on Small Screens) */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <div
                  key={job._id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <p className="text-blue-900 font-bold">{job.title}</p>
                  <p className="text-gray-700">
                    Posted On: {new Date(job.posted_on).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">Status: {job.status}</p>
                  <div className="mt-2 flex space-x-2">
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded"
                      onClick={() => openModal(job)}
                    >
                      View
                    </button>
                    {/* <Link
                      to="/recruiter/jobs/manage"
                      state={{ action: "edit", data: job }}
                      className="bg-yellow-500 text-white py-1 px-2 rounded"
                    >
                      Edit
                    </Link> */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No Jobs Available</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Modal to show selected job */}
      {selectedJob && <JobView job={selectedJob} handleBackToJobs={handleBackToJobs} />}
    </>
  );
};

export default FacultyManageJobs;
