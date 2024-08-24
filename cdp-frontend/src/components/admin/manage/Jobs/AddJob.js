import React, { useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';

const AddJob = () => {
    const location = useLocation();
    const job = location.state?.data; // Retrieve the job data from state if editing

    const [formData, setFormData] = useState({
        company_name: job?.company_name || '',
        title: job?.title || '',
        job_type: job?.job_type || '',
        no_of_openings: job?.no_of_openings || '',
        qualification_req: job?.qualification_req || '',
        job_description: job?.job_description || '',
        responsibilities: job?.responsibilities || '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
    
            // Log the token to inspect it
            console.log("Token:", token);

            if (!token) {
                throw new Error('No token found');
            }
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
    
            if (job) {
                await axios.put(`http://localhost:8000/api/v1/jobs/${job._id}`, formData, config);
            } else {
                await axios.post('http://localhost:8000/api/v1/jobs', formData, config);
            }
    
            navigate('/admin/jobs');
        } catch (error) {
            console.error('Error saving job:', error);
            alert('Error saving job: ' + error.message);
        }
    };
    

    return (
        <div className="container mx-auto p-8">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Add / Edit Job</h2>
            
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company_name">
                    Company Name
                </label>
                <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Job Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Job Type
                </label>
                <div className="flex flex-wrap gap-4">
                    {["Onsite", "Remote", "Hybrid", "Internship"].map((type) => (
                        <label key={type} className="inline-flex items-center">
                            <input
                                type="radio"
                                name="job_type"
                                value={type}
                                checked={formData.job_type === type}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-blue-900"
                            />
                            <span className="ml-2 text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="no_of_openings">
                    Number of Openings
                </label>
                <input
                    type="number"
                    id="no_of_openings"
                    name="no_of_openings"
                    value={formData.no_of_openings}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="qualification_req">
                    Qualification Requirements
                </label>
                <textarea
                    id="qualification_req"
                    name="qualification_req"
                    value={formData.qualification_req}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                    rows="4"
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="job_description">
                    Job Description
                </label>
                <textarea
                    id="job_description"
                    name="job_description"
                    value={formData.job_description}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                    rows="5"
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="responsibilities">
                    Responsibilities
                </label>
                <textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                    rows="4"
                />
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-900 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-200"
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/admin/jobs')}
                    className="bg-gray-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
                >
                    Back
                </button>
            </div>
        </form>
    </div>
    );
};

export default AddJob;
