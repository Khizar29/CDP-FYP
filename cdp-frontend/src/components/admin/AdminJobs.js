import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import ViewJob from './manage/Jobs/ViewJob';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedJob(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        axios.get("http://localhost:8000/api/v1/jobs")
            .then((res) => {
                setJobs(res.data.data); // Assuming the API returns an array of jobs under data
            })
            .catch((err) => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
    
            const response = await axios.delete(`http://localhost:8000/api/v1/jobs/${id}`, config);
            console.log('Job deleted:', response.data);
            setJobs(jobs.filter(job => job._id !== id));
            alert("Job Deleted Successfully");
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Error:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const handleBackToJobs = () => {
        setSelectedJob(null);
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="w-full max-w-5xl mx-auto"> {/* Center the content */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Jobs List</h2>
                        <Link to="/admin/jobs/manage" className="inline-flex items-center bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600">
                            <FaPlus className="mr-2" /> New
                        </Link>
                    </div>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
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
                                {jobs.length > 0 ? jobs.map((job, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-100 transition duration-300">
                                        <td className="py-2 px-3 text-center">{index + 1}</td>
                                        <td className="py-2 px-3">{job.company_name}</td>
                                        <td className="py-2 px-3">{job.title}</td>
                                        <td className="py-2 px-3">{new Date(job.posted_on).toLocaleDateString()}</td>
                                        
                <td className="py-2 px-3 text-center">
                <button 
                    className="btn btn-sm bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" 
                    onClick={() => openModal(job)}>
                    View
                </button>
                
                <Link 
                    to="/admin/jobs/manage" 
                    state={{ action: "edit", data: job }}
                    className="inline-block" // Ensure the Link behaves like a block-level element
                >
                    <button 
                        className="btn btn-sm bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                    >
                        Edit
                    </button>
                </Link>
                
                <button 
                    className="btn btn-sm bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600" 
                    onClick={() => handleDelete(job._id)}>
                    Delete
                </button>
            </td>

                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center text-gray-500">No Job Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
            {/* Render the JobView component when a job is selected */}
            {selectedJob && (
                <ViewJob job={selectedJob} handleBackToJobs={handleBackToJobs} />
            )}
        </>
    );
}

export default AdminJobs;
