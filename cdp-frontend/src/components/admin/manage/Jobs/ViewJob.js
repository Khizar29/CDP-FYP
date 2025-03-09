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
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";

const JobView = ({ job, handleBackToJobs }) => {
  const [showModal, setShowModal] = useState(false);

  const sanitizeContent = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  // Function to check if job link is an email or a URL
  const isEmail = (link) => link.startsWith("mailto:");

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
              onClick={() => setShowModal(true)}
              className="mt-8 w-[140px] bg-blue-900 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300"
            >
              Apply Now
            </button>
          </div>

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
                  className="bg-white rounded-lg p-6 shadow-lg w-96 relative"
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

                  {/* Application Info */}
                  {job.job_link ? (
                    isEmail(job.job_link) ? (
                      <p className="text-lg text-gray-700">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600" />
                        Apply via email:{" "}
                        <a href={job.job_link} className="text-blue-600 font-semibold hover:underline">
                          {job.job_link.replace("mailto:", "")}
                        </a>
                      </p>
                    ) : (
                      <p className="text-lg text-gray-700">
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2 text-blue-600" />
                        Apply here:{" "}
                        <a href={job.job_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                          Click to Apply
                        </a>
                      </p>
                    )
                  ) : (
                    <p className="text-lg text-gray-700">No application link available.</p>
                  )}
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
