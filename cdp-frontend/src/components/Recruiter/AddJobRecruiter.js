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
        job_niche: '',
        qualification_req: '',
        job_description: '',
        responsibilities: '',
        application_methods: [],
        // job_link: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleQuillChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Add new method handler
    const handleAddApplicationMethod = (type, value, instructions = '') => {
        setFormData(prev => ({
            ...prev,
            application_methods: [
                ...prev.application_methods,
                { type, value, instructions }
            ]
        }));
    };

    // Remove method handler
    const handleRemoveMethod = (index) => {
        setFormData(prev => ({
            ...prev,
            application_methods: prev.application_methods.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

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

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="job_niche">
                        Job Niche
                    </label>
                    <select
                        id="job_niche"
                        name="job_niche"
                        value={formData.job_niche}
                        onChange={(e) => setFormData({ ...formData, job_niche: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                        required
                    >
                        <option value="Others">Others</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Full Stack">Full Stack</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Software Testing">Software Testing</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Data Science">Data Science</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Project Management">Project Management</option>
                        <option value="Cybersecurity">Cybersecurity</option>
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

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Application Methods
                    </label>

                    {formData.application_methods.map((method, index) => (
                        <div key={index} className="mb-2 p-2 border rounded">
                            <div className="flex justify-between">
                                <span className="font-medium capitalize">{method.type}:</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMethod(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>

                            {method.type === 'email' ? (
                                <a href={`mailto:${method.value}`} className="text-blue-600">
                                    {method.value}
                                </a>
                            ) : (
                                <a
                                    href={method.value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600"
                                >
                                    {method.value}
                                </a>
                            )}

                            {method.instructions && (
                                <div className="text-sm text-gray-600 mt-1">
                                    {method.instructions}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="mt-4 space-y-3">
                        {/* Email Input */}
                        <input
                            type="text"
                            placeholder="Email address"
                            className="w-full border rounded px-3 py-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const value = e.target.value.trim();
                                    if (value.includes('@')) {
                                        const instructions = window.prompt("Any instructions for this email? (optional)");
                                        handleAddApplicationMethod('email', value, instructions || '');
                                        e.target.value = '';
                                    }
                                }
                            }}
                            onBlur={(e) => {
                                const value = e.target.value.trim();
                                if (value.includes('@')) {
                                    const instructions = window.prompt("Any instructions for this email? (optional)");
                                    handleAddApplicationMethod('email', value, instructions || '');
                                    e.target.value = '';
                                }
                            }}
                        />

                        {/* Website URL */}
                        <input
                            type="text"
                            placeholder="Website URL (https://...)"
                            className="w-full border rounded px-3 py-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const value = e.target.value.trim();
                                    if (value.startsWith('http')) {
                                        const instructions = window.prompt("Any instructions for this website? (optional)");
                                        handleAddApplicationMethod('website', value, instructions || '');
                                        e.target.value = '';
                                    }
                                }
                            }}
                            onBlur={(e) => {
                                const value = e.target.value.trim();
                                if (value.startsWith('http')) {
                                    const instructions = window.prompt("Any instructions for this website? (optional)");
                                    handleAddApplicationMethod('website', value, instructions || '');
                                    e.target.value = '';
                                }
                            }}
                        />

                        {/* Form URL */}
                        <input
                            type="text"
                            placeholder="Form URL"
                            className="w-full border rounded px-3 py-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const value = e.target.value.trim();
                                    if (value.startsWith('http')) {
                                        const instructions = window.prompt("Any instructions for this form? (optional)");
                                        handleAddApplicationMethod('form', value, instructions || '');
                                        e.target.value = '';
                                    }
                                }
                            }}
                            onBlur={(e) => {
                                const value = e.target.value.trim();
                                if (value.startsWith('http')) {
                                    const instructions = window.prompt("Any instructions for this form? (optional)");
                                    handleAddApplicationMethod('form', value, instructions || '');
                                    e.target.value = '';
                                }
                            }}
                        />
                    </div>
                </div>

                {/* ✅ Job Link
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Job Link</label>
                    <input
                        type="text"
                        value={formData.job_link}
                        onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900"
                    />
                </div> */}
                <div className="mt-6 p-4 m-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded shadow-sm">
                    <p className="font-semibold">⚠️ Please review your form carefully before submitting.</p>
                    <p className="mt-1">Once submitted, the job posting cannot be edited. For any assistance, contact us at <a href="mailto:cdp.khi@nu.edu.pk" className="underline text-blue-700">cdp.khi@nu.edu.pk</a>.</p>
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
                        onClick={() => navigate('/recruiter')}
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
