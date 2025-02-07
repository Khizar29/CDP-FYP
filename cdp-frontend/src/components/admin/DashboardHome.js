import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FaBriefcase, FaUser, FaCalendarAlt, FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const [jobCount, setJobCount] = useState(0);
  const [alumniCount, setAlumniCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [forumCount, setForumCount] = useState(0);
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
        navigate('/');
        return;
    }
}, [user, loading, navigate]);

useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jobs/count`, {
                withCredentials: true
            });
            setJobCount(response.data.data.count);
        } catch (error) {
            console.error("Error fetching job count", error);
            if (error.response?.status === 401) {
                navigate('/');
            }
        }
    };
    fetchDashboardData();
    
    // Placeholder counts for other entities
    setAlumniCount(0);
    setEventsCount(0);
    setForumCount(0);
  }, [user, navigate]);

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

  // If user is not authenticated or not admin, don't render the dashboard
  if (!user || user.role !== 'admin') {
    return null;
  }

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
