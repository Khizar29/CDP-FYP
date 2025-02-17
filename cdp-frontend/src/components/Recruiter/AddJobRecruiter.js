import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../../contexts/UserContext';

const AddJobRecruiter = () => {
    const { user } = useContext(UserContext); // Get logged-in recruiter
    const navigate = useNavigate();

    // ✅ Define the form state (only allowed fields)
    const [formData, setFormData] = useState({
        company_name: '',
        title: '',
        job_type: '',
        qualification_req: '',
        job_description: '',
        responsibilities: '',
        job_link: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleQuillChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const config = { withCredentials: true };

            // ✅ Send only the necessary fields
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs`, formData, config);

            alert('Job Posted Successfully. Awaiting admin approval.');
            navigate('/recruiter'); // ✅ Redirect to recruiter dashboard
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Error posting job: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Post a New Job</h2>

                {/* ✅ Company Name */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
                    <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900"
                        required
                    />
                </div>

                {/* ✅ Job Title */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900"
                        required
                    />
                </div>

                {/* ✅ Job Type */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Job Type</label>
                    <select
                        value={formData.job_type}
                        onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900"
                        required
                    >
                        <option value="">Select Job Type</option>
                        <option value="Onsite">Onsite</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                {/* ✅ Job Description */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Job Description</label>
                    <ReactQuill
                        value={formData.job_description}
                        onChange={(value) => handleQuillChange('job_description', value)}
                        className="bg-white mb-4"
                        theme="snow"
                    />
                </div>

                {/* ✅ Qualification Requirements */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Qualification Requirements</label>
                    <ReactQuill
                        value={formData.qualification_req}
                        onChange={(value) => handleQuillChange('qualification_req', value)}
                        className="bg-white mb-4"
                        theme="snow"
                    />
                </div>

                {/* ✅ Responsibilities */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Responsibilities</label>
                    <ReactQuill
                        value={formData.responsibilities}
                        onChange={(value) => handleQuillChange('responsibilities', value)}
                        className="bg-white mb-4"
                        theme="snow"
                    />
                </div>

                {/* ✅ Job Link */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Job Link</label>
                    <input
                        type="text"
                        value={formData.job_link}
                        onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900"
                    />
                </div>

                {/* ✅ Submit Button */}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-900 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    >
                        {isLoading ? "Posting..." : "Submit"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/recruiter/jobs')}
                        className="bg-gray-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJobRecruiter;
