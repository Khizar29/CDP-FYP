import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBuilding,
  faBriefcase,
  faClipboardList,
  faClipboardUser,
  faCalendarAlt,
  faTasks,
  faEnvelope,
  faExternalLinkAlt,
  faTimes,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import axios from "axios";


const JobView = ({ job, handleBackToJobs }) => {
  const [showModal, setShowModal] = useState(false);

  const sanitizeContent = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  const isEmail = (link) => {
    return link.startsWith("mailto:") || link.includes("@");
  };

  const handleApplyNow = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/jobapplications/track`,
        { jobId: job._id },
        {
          withCredentials: true, // ✅ Ensures cookies (session) are sent
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 201) {
        setShowModal(true); // Open the modal if the API call is successful
      }
    } catch (error) {
      console.error("Error tracking application:", error);
  
      // Handle specific errors
      if (error.response) {
        if (error.response.status === 400 && error.response.data.message === "Already applied") {
          setShowModal(true); // Open the modal if the user has already applied
        } else {
          alert("Failed to track application. Please try again.");
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          className="fixed inset-0 bg-white p-6 overflow-y-auto z-50 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <defs>
                <pattern
                  id="polka-dots"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <circle fill="#a0aec0" cx="50" cy="50" r="3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#polka-dots)" />
            </svg>
          </div>

          {/* Back Button */}
          <button className="text-blue-900 mb-4 flex items-center" onClick={handleBackToJobs}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Jobs
          </button>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">{job.title}</h2>
            <p className="text-xl font-semibold mb-4 flex items-center text-amber-400">
              <FontAwesomeIcon icon={faBuilding} className="mr-2" /> {job.company_name}
            </p>
            <p className="text-lg text-gray-700 mb-4 flex items-center">
              <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-blue-600" /> {job.job_type}
            </p>
            <p className="text-lg text-gray-700 mb-4 flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-600" /> 
              Posted on {new Date(job.posted_on).toLocaleDateString()}
            </p>

            <h3 className="text-xl font-semibold text-blue-900 mt-6 mb-4 flex items-center">
              <FontAwesomeIcon icon={faClipboardUser} className="mr-2 text-blue-600" /> Description
            </h3>
            <div dangerouslySetInnerHTML={sanitizeContent(job.job_description)} className="mb-4 text-gray-700" />

            <h3 className="text-xl font-semibold text-blue-900 mt-6 mb-4 flex items-center">
              <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-600" /> Requirements
            </h3>
            <div dangerouslySetInnerHTML={sanitizeContent(job.qualification_req)} className="mb-4 text-gray-700" />

            <h3 className="text-xl font-semibold text-blue-900 mt-6 mb-4 flex items-center">
              <FontAwesomeIcon icon={faTasks} className="mr-2 text-blue-600" /> Responsibilities
            </h3>
            <div dangerouslySetInnerHTML={sanitizeContent(job.responsibilities)} className="mb-4 text-gray-700" />

            {/* Apply Now Button */}
            <button
  onClick={handleApplyNow} // Call handleApplyNow function
  className="mt-8 w-[140px] bg-blue-900 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300"
>
  Apply Now
</button>
          </div>

          {/* Apply Now Modal */}
{/* Apply Now Modal */}
<AnimatePresence>
  {showModal && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 shadow-lg w-96 max-h-[80vh] overflow-y-auto relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Apply for {job.title}</h2>

        {/* Application Methods */}
        <div className="space-y-4">
          {/* Show application methods if they exist */}
          {job.application_methods?.length > 0 ? (
            job.application_methods.map((method, index) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                {method.type === 'email' ? (
                  <>
                    <div className="flex items-center mb-1">
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600" />
                      <span className="font-medium">Email Application</span>
                    </div>
                    <div className="ml-6">
                      <a 
                        href={`mailto:${method.value}${method.instructions ? `?subject=${encodeURIComponent(method.instructions)}` : ''}`}
                        className="text-blue-600 hover:underline break-all"
                      >
                        {method.value}
                      </a>
                      {method.instructions && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Note:</span> {method.instructions}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center mb-1">
                      <FontAwesomeIcon 
                        icon={method.type === 'form' ? faFileAlt : faExternalLinkAlt} 
                        className="mr-2 text-blue-600" 
                      />
                      <span className="font-medium">
                        {method.type === 'form' ? 'Application Form' : 'Website'}
                      </span>
                    </div>
                    <div className="ml-6">
                      <a 
                        href={method.value} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {method.value}
                      </a>
                      {method.instructions && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Note:</span> {method.instructions}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : job.job_link ? (
            // Fallback to legacy job_link if no application methods exist
            <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              {isEmail(job.job_link) ? (
                <>
                  <div className="flex items-center mb-1">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600" />
                    <span className="font-medium">Email Application</span>
                  </div>
                  <div className="ml-6">
                    <a 
                      href={job.job_link} 
                      className="text-blue-600 hover:underline break-all"
                    >
                      {job.job_link.replace("mailto:", "")}
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center mb-1">
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2 text-blue-600" />
                    <span className="font-medium">Website</span>
                  </div>
                  <div className="ml-6">
                    <a 
                      href={job.job_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {job.job_link}
                    </a>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-600 p-3">No application methods available.</p>
          )}
        </div>

        {/* Additional Instructions */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-1">Application Tips</h3>
          <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
            <li>Prepare your resume/CV before applying</li>
            <li>Check all application requirements</li>
            <li>Use a professional email address</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobView;
