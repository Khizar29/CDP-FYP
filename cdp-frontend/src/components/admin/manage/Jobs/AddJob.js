import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const AddJob = () => {
    const location = useLocation();
    const job = location.state?.data;

    const [formData, setFormData] = useState({
        company_name: job?.company_name || '',
        title: job?.title || '',
        job_type: job?.job_type || '',
        no_of_openings: job?.no_of_openings || '',
        qualification_req: job?.qualification_req || '',
        job_description: job?.job_description || '',
        responsibilities: job?.responsibilities || '',
    });

    const [jobAdText, setJobAdText] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleExtractInfo = async () => {
        setIsLoading(true); // Show loading modal
        console.log("Loading started"); // Debugging log

        try {
            const response = await axios.post('http://localhost:5001/api/v1/jobs/extract', {
                job_ad_text: jobAdText,
            });

            const extractedInfo = response.data;
            setFormData((prevFormData) => ({
                ...prevFormData,
                company_name: extractedInfo.company_name || prevFormData.company_name,
                title: extractedInfo.title || prevFormData.title,
                job_type: extractedInfo.job_type || prevFormData.job_type,
                qualification_req: extractedInfo.qualification_req || prevFormData.qualification_req,
                job_description: extractedInfo.job_description || prevFormData.job_description,
                responsibilities: extractedInfo.responsibilities || prevFormData.responsibilities,
            }));
        } catch (error) {
            console.error('Error extracting job info:', error);
        } finally {
            console.log("Loading finished"); // Debugging log
            setIsLoading(false); // Hide loading modal
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");

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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="job_ad_text">
                        Paste Job Ad
                    </label>
                    <textarea
                        id="job_ad_text"
                        name="job_ad_text"
                        value={jobAdText}
                        onChange={(e) => setJobAdText(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                        rows="6"
                    />
                    <button
                        type="button"
                        onClick={handleExtractInfo}
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-200"
                    >
                        Extract Info
                    </button>
                </div>

                {/* Form fields for job details */}
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

                {/* Add other form fields as shown previously */}
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

            {/* Loading Modal */}
            <Modal
                isOpen={isLoading}
                contentLabel="Extracting Information"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        padding: '30px',
                        textAlign: 'center',
                    },
                }}
            >
                <div>
                    <p className="mb-4 text-lg font-semibold">Please wait while we extract the information...</p>
                    <div className="border-t-4 border-blue-900 border-solid rounded-full w-16 h-16 mx-auto animate-spin"></div>
                </div>
            </Modal>
        </div>
    );
};

export default AddJob;
