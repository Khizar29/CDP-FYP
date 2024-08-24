import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBriefcase, FaUser, FaCalendarAlt, FaComments } from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
    return (
        <aside className={`bg-blue-900 text-white w-64 min-h-screen p-6 pt-8 fixed top-16 left-0 z-10 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
            <nav className="mt-10">
                <Link to="/admin" className="flex items-center mt-4 py-2 px-6 text-gray-100 hover:bg-blue-700 rounded">
                    <FaHome className="mr-3" />
                    Home
                </Link>
                <Link to="/admin/jobs" className="flex items-center mt-4 py-2 px-6 text-gray-100 hover:bg-blue-700 rounded">
                    <FaBriefcase className="mr-3" />
                    Jobs
                </Link>
                <Link to="/admin/users" className="flex items-center mt-4 py-2 px-6 text-gray-100 hover:bg-blue-700 rounded">
                    <FaUser className="mr-3" />
                    Users
                </Link>
                <Link to="/admin/events" className="flex items-center mt-4 py-2 px-6 text-gray-100 hover:bg-blue-700 rounded">
                    <FaCalendarAlt className="mr-3" />
                    Events
                </Link>
                <Link to="/admin/forum" className="flex items-center mt-4 py-2 px-6 text-gray-100 hover:bg-blue-700 rounded">
                    <FaComments className="mr-3" />
                    Forum
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
