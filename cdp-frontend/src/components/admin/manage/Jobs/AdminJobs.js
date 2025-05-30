import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ViewJob from "./ViewJob";
import Pagination from "../Graduates/Pagination";
import { UserContext } from "../../../../contexts/UserContext";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const jobsPerPage = 10;

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchJobs = async (page = 1) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page, limit: jobsPerPage, searchTerm, filterDate, filterStatus },
        }
      );
      setJobs(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      if (err.response?.status === 401) navigate("/signin");
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchJobs(currentPage);
  }, [currentPage, searchTerm, filterDate, filterStatus, user, navigate]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(jobs.filter((job) => job._id !== id));
      alert("Job Deleted Successfully");
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) navigate("/signin");
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm("Are you sure you want to delete selected jobs?")) {
      try {
        await Promise.all(
          selectedJobs.map((id) =>
            axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );
        setJobs(jobs.filter((job) => !selectedJobs.includes(job._id)));
        setSelectedJobs([]);
        alert("Selected jobs deleted successfully.");
      } catch (err) {
        console.error("Error deleting jobs:", err);
        alert("Something went wrong. Try again.");
      }
    }
  };

  const handleBulkApprove = async () => {
    if (window.confirm("Are you sure you want to approve selected jobs?")) {
      try {
        await Promise.all(
          selectedJobs.map((id) =>
            axios.patch(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/${id}/approve`,
              { status: "approved" },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          )
        );
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            selectedJobs.includes(job._id)
              ? { ...job, status: "approved" }
              : job
          )
        );
        setSelectedJobs([]);
        alert("Selected jobs approved successfully.");
      } catch (err) {
        console.error("Error approving jobs:", err);
        alert("Something went wrong. Try again.");
      }
    }
  };

  const handleJobApproval = async (jobId, status) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/${jobId}/approve`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === jobId ? { ...job, status } : job))
      );
      alert(
        `Job ${status === "approved" ? "Approved" : "Rejected"} Successfully`
      );
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("Failed to update job status. Please try again.");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Jobs List</h2>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
              <input
                type="text"
                placeholder="Search by Company or Title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[160px] py-2 px-4 rounded border border-gray-300"
              />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="py-2 px-4 rounded border border-gray-300"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-2 px-4 rounded border border-gray-300"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              {selectedJobs.length > 0 && (
                <>
                  <button
                    onClick={handleBulkApprove}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete Selected
                  </button>
                </>
              )}
              <Link
                to="/admin/jobs/manage"
                className="bg-blue-900 text-white px-4 py-2 rounded flex items-center"
              >
                <FaPlus className="mr-2" /> New
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white rounded-lg shadow-md mb-6">
              <thead>
                <tr>
                  <th className="py-2 px-2 text-center bg-blue-100 border-b w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedJobs.length === jobs.length && jobs.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedJobs(jobs.map((job) => job._id));
                        } else {
                          setSelectedJobs([]);
                        }
                      }}
                    />
                  </th>
                  <th className="py-2 px-2 text-center bg-blue-100 border-b">
                    #
                  </th>
                  <th className="py-2 px-2 text-left bg-blue-100 border-b">
                    Company
                  </th>
                  <th className="py-2 px-2 text-left bg-blue-100 border-b">
                    Job Title
                  </th>
                  <th className="py-2 px-2 text-left bg-blue-100 border-b">
                    Posted By
                  </th>
                  <th className="py-2 px-2 text-left bg-blue-100 border-b">
                    Posted On
                  </th>
                  <th className="py-2 px-2 text-center bg-blue-100 border-b">
                    Status
                  </th>
                  <th className="py-2 px-2 text-center bg-blue-100 border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="py-2 px-2 text-center w-8 min-w-[2rem]">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedJobs([...selectedJobs, job._id]);
                            } else {
                              setSelectedJobs(
                                selectedJobs.filter((id) => id !== job._id)
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="py-2 px-2 text-center">{index + 1}</td>
                      <td className="py-2 px-2 truncate max-w-[120px]">
                        {job.company_name}
                      </td>
                      <td className="py-2 px-2 truncate max-w-[150px]">
                        {job.title}
                      </td>
                      <td className="py-2 px-2 truncate max-w-[150px]">
                        {job.postedBy?.email || "Unknown"}
                      </td>
                      <td className="py-2 px-2">
                        {new Date(job.posted_on).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2 text-center">{job.status}</td>
                      <td className="py-2 px-2 text-center whitespace-nowrap">
                        <div className="flex gap-1">
                          {job.status === "pending" && (
                            <>
                              <button
                                className="text-white text-sm px-2 rounded hover:bg-green-700 min-w-[36px]"
                                onClick={() =>
                                  handleJobApproval(job._id, "approved")
                                }
                              >
                                ✅
                              </button>
                              <button
                                className="text-white text-sm px-2 rounded hover:bg-red-700 min-w-[36px]"
                                onClick={() =>
                                  handleJobApproval(job._id, "rejected")
                                }
                              >
                                ❌
                              </button>
                            </>
                          )}
                          <button
                            className="bg-blue-500 text-white text-sm px-2 py-1 rounded hover:bg-blue-600 min-w-[72px]"
                            onClick={() => setSelectedJob(job)}
                          >
                            View
                          </button>
                          <Link
                            to="/admin/jobs/manage"
                            state={{ action: "edit", data: job }}
                          >
                            <button className="bg-yellow-500 text-white text-sm px-2 py-1 rounded hover:bg-yellow-600 min-w-[72px]">
                              Edit
                            </button>
                          </Link>
                          <button
                            className="bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600 min-w-[72px]"
                            onClick={() => handleDelete(job._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      No Jobs Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      {selectedJob && (
        <ViewJob job={selectedJob} handleBackToJobs={handleBackToJobs} />
      )}
    </>
  );
};

export default AdminJobs;
