import React, { useState, useContext, useCallback } from 'react';
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
    application_methods: job?.application_methods || [],
    toEmails: [],
    ccEmails: [],
    bccEmails: [],
  });

  const emailSuggestions = [
    'k213329@nu.edu.pk',
    'k213249@nu.edu.pk',
    'allstudents.khi@nu.edu.pk',
    'batch2021bscs.khi@nu.edu.pk',
    'batch2022bs.khi@nu.edu.pk',
    'batch2022bs.khi@nu.edu.pk',
    'batch2022bsai.khi@nu.edu.pk',
    'batch2022bsba.khi@nu.edu.pk',
    'batch2022bscs.khi@nu.edu.pk',
    'batch2022bscy.khi@nu.edu.pk',
    'batch2022bsee.khi@nu.edu.pk',
    'batch2022bsrobo.khi@nu.edu.pk',
    'batch2022bsse.khi@nu.edu.pk',
    'batch2022ms.khi@nu.edu.pk',
    'batch2022mscns.khi@nu.edu.pk',
    'batch2022mscs.khi@nu.edu.pk',
    'batch2022msds.khi@nu.edu.pk',
    'batch2022msspm.khi@nu.edu.pk',
    'batch2024bs.khi@nu.edu.pk',
    'batch2024bsai.khi@nu.edu.pk',
    'batch2024bsba.khi@nu.edu.pk',
    'batch2024bscs.khi@nu.edu.pk',
    'batch2024bscy.khi@nu.edu.pk',
    'batch2024bsds.khi@nu.edu.pk',
    'batch2024bsee.khi@nu.edu.pk',
    'batch2024bsft.khi@nu.edu.pk',
    'batch2024bsse.khi@nu.edu.pk',
    'batch2024ms.khi@nu.edu.pk',
    'batch2024msai.khi@nu.edu.pk',
    'batch2024msba.khi@nu.edu.pk',
    'batch2024mscns.khi@nu.edu.pk',
    'batch2024mscs.khi@nu.edu.pk',
    'batch2024mscy.khi@nu.edu.pk',
    'batch2024msds.khi@nu.edu.pk',
    'batch2024msse.khi@nu.edu.pk',
    'muhammad.taha@nu.edu.pk',
    'batch2024msspm.khi@nu.edu.pk'
  ];

  const [jobAdText, setJobAdText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];  // Get the first file
    if (selectedFile) {
      setFile(selectedFile);  // Set the selected file to state
    }
  };


  const handleQuillChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = useCallback((field, emails) => {
    setFormData(prev => ({ ...prev, [field]: emails }));
  }, []);

  const sanitizeText = (text) => {
    // Remove any non-breaking spaces and trim extra spaces
    return text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  };

  // Function to handle the extraction of job information
  const handleExtractInfo = async () => {
    setIsLoading(true);

    // If a file is selected, upload the file instead of using job_ad_text
    if (file) {
      const formData = new FormData();
      formData.append("job_ad_file", file);  // Add the selected file to FormData

      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/extract-from-image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',  // Set the content type to multipart/form-data
              Authorization: `Bearer ${token}`,
            }
          }
        );

        const extractedInfo = response.data;
        console.log("Extracted Info:", extractedInfo);
        setFormData((prevFormData) => ({
          ...prevFormData,
          company_name: extractedInfo.company_name || prevFormData.company_name,
          title: extractedInfo.title || prevFormData.title,
          job_type: extractedInfo.job_type || prevFormData.job_type,
          qualification_req: extractedInfo.qualification_req || prevFormData.qualification_req,
          job_description: extractedInfo.job_description || prevFormData.job_description,
          responsibilities: extractedInfo.responsibilities || prevFormData.responsibilities,
          application_methods: extractedInfo.application_methods || prevFormData.application_methods
        }));

      } catch (error) {
        console.error('Error extracting job info:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // If no file, proceed with the text extraction logic
      const sanitizedJobAdText = sanitizeText(jobAdText);
      const encodedJobAdText = encodeURIComponent(sanitizedJobAdText);

      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/extract`,
          { job_ad_text: encodedJobAdText },
          {
            headers: {
              'Content-Type': 'application/json', // Tells the server the request body is JSON
              Authorization: `Bearer ${token}`,
            }
          }
        );

        const extractedInfo = response.data;
        console.log("Extracted Info:", extractedInfo);
        setFormData((prevFormData) => ({
          ...prevFormData,
          company_name: extractedInfo.company_name || prevFormData.company_name,
          title: extractedInfo.title || prevFormData.title,
          job_type: extractedInfo.job_type || prevFormData.job_type,
          qualification_req: extractedInfo.qualification_req || prevFormData.qualification_req,
          job_description: extractedInfo.job_description || prevFormData.job_description,
          responsibilities: extractedInfo.responsibilities || prevFormData.responsibilities,
          application_methods: extractedInfo.application_methods || prevFormData.application_methods
        }));

      } catch (error) {
        console.error('Error extracting job info:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Prevent the default form submission on pressing Enter in email fields
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = { ...formData };

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

  const toolbarOptions = [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="job_ad_file">
            Upload Job Ad (Image/PDF)
          </label>
          <input
            type="file"
            id="job_ad_file"
            name="job_ad_file"
            accept="image/*,application/pdf"  // Accepts images and PDFs
            onChange={handleFileChange}      // Trigger file upload handler
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 transition duration-200"
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Application Methods
          </label>

          {formData.application_methods.map((method, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <div className="flex justify-between">
                <span className="font-medium capitalize">{method.type}:</span>
                <button
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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Email address"
                className="flex-1 border rounded px-3 py-2"
                onBlur={(e) => {
                  if (e.target.value.includes('@')) {
                    handleAddApplicationMethod('email', e.target.value.trim());
                    e.target.value = '';
                  }
                }}
                onKeyDown={handleKeyPress} // Prevent form submission when pressing enter
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Website URL (https://...)"
                className="flex-1 border rounded px-3 py-2"
                onBlur={(e) => {
                  if (e.target.value.startsWith('http')) {
                    handleAddApplicationMethod('website', e.target.value.trim());
                    e.target.value = '';
                  }
                }}
                onKeyDown={handleKeyPress} // Prevent form submission when pressing enter
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Form URL"
                className="flex-1 border rounded px-3 py-2"
                onBlur={(e) => {
                  if (e.target.value.startsWith('http')) {
                    handleAddApplicationMethod('form', e.target.value.trim());
                    e.target.value = '';
                  }
                }}
                onKeyDown={handleKeyPress} // Prevent form submission when pressing enter
              />
            </div>
          </div>
        </div>

        {/* Email input fields */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            To
          </label>
          <EmailInput
            key="toEmails"
            value={formData.toEmails}
            onChange={useCallback((emails) => handleEmailChange('toEmails', emails), [handleEmailChange])}
            placeholder="Enter email addresses"
            suggestions={emailSuggestions}
            onKeyDown={handleKeyPress} // Prevent form submission when pressing enter
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            CC
          </label>
          <EmailInput
            key="ccEmails"
            value={formData.ccEmails}
            onChange={useCallback((emails) => handleEmailChange('ccEmails', emails), [handleEmailChange])}
            placeholder="Enter CC email addresses"
            suggestions={emailSuggestions}
            onKeyDown={handleKeyPress} // Prevent form submission when pressing enter
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            BCC
          </label>
          <EmailInput
            key="bcEmails"
            value={formData.bccEmails}
            onChange={useCallback((emails) => handleEmailChange('bccEmails', emails), [handleEmailChange])}
            placeholder="Enter BCC email addresses"
            suggestions={emailSuggestions}
            onKeyDown={handleKeyPress} // Prevent form submission when pressing enter
          />
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            id="submit_job"
            className="bg-blue-900 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-200"
          >
            Submit
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
