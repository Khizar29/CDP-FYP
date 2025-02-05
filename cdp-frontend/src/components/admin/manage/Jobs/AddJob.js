import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmailInput from './EmailInput';
import { UserContext } from '../../../../contexts/UserContext';

Modal.setAppElement('#root');

const AddJob = () => {
    const { user, loading } = useContext(UserContext); // Get user and loading from context
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
        job_link: job?.job_link || '',
        toEmails: [],
        ccEmails: [],
        bccEmails: [],
    });

    const emailSuggestions = [
        'k213329@nu.edu.pk',
        'k213249@nu.edu.pk',
        'allstudents.khi@nu.edu.pk',
        'hr@company.com',
        'careers@company.com'
    ];

    const [jobAdText, setJobAdText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleQuillChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailChange = (field, emails) => {
        setFormData(prev => ({ ...prev, [field]: emails }));
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
                job_link: extractedInfo.job_link || prevFormData.job_link,
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
           
            const config = {
                withCredentials: true,
            };
            const payload = { ...formData };
            console.log('Payload being sent:', payload);

            if (job) {
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/${job._id}`, payload, config);
            } else {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs`, payload, config);
            }
            alert('Job Posted Successfully');
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Job Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="job_type">
                        Job Type
                    </label>
                    <select
                        id="job_type"
                        name="job_type"
                        value={formData.job_type}
                        onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                        required
                    >
                        <option value="">Select Job Type</option>
                        <option id="Onsite" value="Onsite">Onsite</option>
                        <option id="Remote" value="Remote">Remote</option>
                        <option id="Hybrid" value="Hybrid">Hybrid</option>
                        <option id="Internship" value="Internship">Internship</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Qualification Requirements</label>
                    <ReactQuill
                        value={formData.qualification_req}
                        onChange={(value) => handleQuillChange('qualification_req', value)}
                        modules={{ toolbar: toolbarOptions }}
                        className="bg-white mb-4"
                        id="qualification_req"
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
                        id="job_description"
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
                        id="responsibilities"
                        theme="snow"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="joblink">
                        Job Link
                    </label>
                    <input
                        type="text"
                        id="link"
                        name="link"
                        value={formData.job_link}
                        onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        To
                    </label>
                    <EmailInput
                        value={formData.toEmails}
                        onChange={(emails) => handleEmailChange('toEmails', emails)}
                        placeholder="Enter email addresses"
                        suggestions={emailSuggestions}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        CC
                    </label>
                    <EmailInput
                        value={formData.ccEmails}
                        onChange={(emails) => handleEmailChange('ccEmails', emails)}
                        placeholder="Enter CC email addresses"
                        suggestions={emailSuggestions}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        BCC
                    </label>
                    <EmailInput
                        value={formData.bccEmails}
                        onChange={(emails) => handleEmailChange('bccEmails', emails)}
                        placeholder="Enter BCC email addresses"
                        suggestions={emailSuggestions}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        id="submit_job"
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