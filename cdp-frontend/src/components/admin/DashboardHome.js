import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBriefcase, FaUser, FaCalendarAlt, FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const [jobCount, setJobCount] = useState(0);
  const [alumniCount, setAlumniCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [forumCount, setForumCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/jobs/count')
      .then(response => {
        setJobCount(response.data.data.count);
      })
      .catch(error => {
        console.error("There was an error fetching the job count!", error);
      });

    // Placeholder counts for other entities
    setAlumniCount(0);
    setEventsCount(0);
    setForumCount(0);
  }, []);

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="flex justify-center items-start w-full pt-5 md:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 w-full max-w-screen-xl px-4 md:px-12 lg:px-20">
        <motion.div
          className="bg-cyan-500 p-10 sm:p-12 rounded-lg shadow-xl flex items-center justify-between"
          whileHover="hover"
          whileTap="tap"
          variants={cardVariants}
        >
          <div className="bg-blue-100 p-5 rounded-full">
            <FaUser className="text-blue-500 text-4xl" />
          </div>
          <div className="ml-6">
            <p className="text-lg text-gray-200">Total Alumni</p>
            <p className="text-3xl  text-gray-200 text-center font-bold">{alumniCount}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-yellow-400 p-10 sm:p-12 rounded-lg shadow-xl flex items-center justify-between"
          whileHover="hover"
          whileTap="tap"
          variants={cardVariants}
        >
          <div className="bg-yellow-100 p-5 rounded-full">
            <FaComments className="text-yellow-500 text-4xl" />
          </div>
          <div className="ml-6">
            <p className="text-lg  text-white">Forum Topics</p>
            <p className="text-3xl  text-white text-center font-bold">{forumCount}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-green-600 p-10 sm:p-12 rounded-lg shadow-xl flex items-center justify-between"
          whileHover="hover"
          whileTap="tap"
          variants={cardVariants}
        >
          <div className="bg-green-100 p-5 rounded-full">
            <FaBriefcase className="text-green-500 text-4xl" />
          </div>
          <div className="ml-6">
            <p className="text-lg text-gray-100">Posted Jobs</p>
            <p className="text-3xl  text-gray-200 text-center font-bold">{jobCount}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-purple-400 p-10 sm:p-12 rounded-lg shadow-xl flex items-center justify-between"
          whileHover="hover"
          whileTap="tap"
          variants={cardVariants}
        >
          <div className="bg-purple-100 p-5 rounded-full">
            <FaCalendarAlt className="text-purple-500 text-4xl" />
          </div>
          <div className="ml-6">
            <p className="text-lg text-white">Total Events</p>
            <p className="text-3xl  text-white text-center font-bold">{eventsCount}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
