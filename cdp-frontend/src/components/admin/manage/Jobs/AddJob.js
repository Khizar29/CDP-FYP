import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleQuillChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleExtractInfo = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
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

    const toolbarOptions = [
        [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'image', 'video'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
    ];

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

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company_name">
                        Company Name
                    </label>
                    <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Qualification Requirements</label>
                    <ReactQuill
                        value={formData.qualification_req}
                        onChange={(value) => handleQuillChange('qualification_req', value)}
                        modules={{ toolbar: toolbarOptions }}
                        className="bg-white mb-4"
                        theme="snow"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Job Description</label>
                    <ReactQuill
                        value={formData.job_description}
                        onChange={(value) => handleQuillChange('job_description', value)}
                        modules={{ toolbar: toolbarOptions }}
                        className="bg-white mb-4"
                        theme="snow"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Responsibilities</label>
                    <ReactQuill
                        value={formData.responsibilities}
                        onChange={(value) => handleQuillChange('responsibilities', value)}
                        modules={{ toolbar: toolbarOptions }}
                        className="bg-white mb-4"
                        theme="snow"
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
