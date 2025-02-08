import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ViewJob from './ViewJob';
import Pagination from '../Graduates/Pagination';
import { UserContext } from '../../../../contexts/UserContext';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const jobsPerPage = 10;
    
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const openModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedJob(null);
        setIsModalOpen(false);
    };

    const fetchJobs = async (page = 1) => {
        try {
            // Use withCredentials to send cookies
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs`, {
                withCredentials: true,
                params: {
                    page: page,
                    limit: jobsPerPage,
                    searchTerm: searchTerm,
                    filterDate: filterDate,
                },
            });
            setJobs(response.data.data);
            setFilteredJobs(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            if (err.response?.status === 401) {
                navigate('/signin');
            }
        }
    };

    useEffect(() => {
        // Check if user is authenticated and is admin
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        
        fetchJobs(currentPage);
    }, [currentPage, searchTerm, filterDate, user, navigate]);

    const handleDelete = async (id) => {
        try {
            // Use withCredentials to send cookies
            await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/${id}`,
                { withCredentials: true }
            );
            fetchJobs(currentPage);
            setJobs(jobs.filter(job => job._id !== id));
            alert('Job Deleted Successfully');
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 401) {
                navigate('/signin');
            }
        }
    };


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleBackToJobs = () => {
        setSelectedJob(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="w-full max-w-5xl mx-auto">
                    {/* Flexbox for Search, Date Filter, and Add Job button */}
                    <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-blue-900 mb-4 md:mb-0">Jobs List</h2>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search by Company or Title"
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
                                to="/admin/jobs/manage"
                                id="NewJob"
                                className="w-full md:w-auto inline-flex items-center justify-center bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                            >
                                <FaPlus className="mr-2" /> New
                            </Link>
                        </div>
                    </div>

                    {/* Table for Jobs */}
                    <div className="overflow-x-auto"> {/* Ensure table can scroll on small screens */}
                        <table className="min-w-full table-auto bg-white rounded-lg shadow-md mb-6"> {/* Use table-auto to fit content */}
                            <thead>
                                <tr>
                                    <th className="py-2 px-3 text-center bg-blue-100 border-b">#</th>
                                    <th className="py-2 px-3 text-left bg-blue-100 border-b">Company</th>
                                    <th className="py-2 px-3 text-left bg-blue-100 border-b">Job Title</th>
                                    <th className="py-2 px-3 text-left bg-blue-100 border-b">Posted On</th>
                                    <th className="py-2 px-3 text-center bg-blue-100 border-b">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-100 transition duration-300">
                                            <td className="py-2 px-3 text-center">{index + 1}</td>
                                            <td className="py-2 px-3">{job.company_name}</td>
                                            <td className="py-2 px-3">{job.title}</td>
                                            <td className="py-2 px-3">{new Date(job.posted_on).toLocaleDateString()}</td>
                                            <td className="py-2 px-3 text-center">
                                                <button
                                                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-300 mr-2"
                                                    onClick={() => openModal(job)}
                                                    id="ViewJob"
                                                >
                                                    View
                                                </button>
                                                <Link to="/admin/jobs/manage" state={{ action: 'edit', data: job }}>
                                                    <button className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition duration-300 mr-2"
                                                    id="EditJob"
                                                    >
                                    
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300"
                                                    onClick={() => handleDelete(job._id)}
                                                    id="DeleteJob"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center text-gray-500">No Job Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </div>
            </div>

            {/* Modal to show selected job */}
            {selectedJob && <ViewJob job={selectedJob} handleBackToJobs={handleBackToJobs} />}
        </>
    );
};

export default AdminJobs;
