import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBriefcase, FaUser, FaCalendarAlt, FaComments, FaGraduationCap } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && !event.target.closest('aside')) {
                toggleSidebar();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, toggleSidebar]);

    return (
        <aside className={`bg-blue-900 text-white w-64 min-h-screen p-6 pt-8 fixed top-16 left-0 z-10 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
            {/* Close Button for Mobile View */}
            <button 
                onClick={toggleSidebar} 
                className="absolute top-4 right-4 text-white text-2xl font-bold lg:hidden hover:text-gray-300 transition"
            >
                ✕
            </button>

            <nav className="mt-10">
                <Link to="/admin" onClick={toggleSidebar} className="flex items-center mt-4 py-2 px-6 text-xl text-gray-100 hover:bg-blue-700 rounded">
                    <FaHome className="mr-3" />
                    Home
                </Link>
                <Link to="/admin/jobs" id="adminjobs" onClick={toggleSidebar} className="flex items-center mt-4 py-2 px-6 text-xl text-gray-100 hover:bg-blue-700 rounded">
                    <FaBriefcase className="mr-3" />
                    Jobs
                </Link>
                <Link to="/admin/graduates" onClick={toggleSidebar} className="flex items-center mt-4 py-2 px-6 text-xl text-gray-100 hover:bg-blue-700 rounded">
                    <FaGraduationCap className="mr-2 w-5" />
                    Graduates
                </Link>
                <Link to="/admin/users" onClick={toggleSidebar} className="flex items-center mt-4 py-2 px-6 text-xl text-gray-100 hover:bg-blue-700 rounded">
                    <FaUser className="mr-3" />
                    Users
                </Link>
                <Link to="/admin/newsfeeds" onClick={toggleSidebar} className="flex items-center mt-4 py-2 px-6 text-xl text-gray-100 hover:bg-blue-700 rounded">
                    <FaCalendarAlt className="mr-3" />
                    Events
                </Link>
                <Link to="/admin/testimonials" onClick={toggleSidebar} className="flex items-center mt-4 py-2 px-6 text-xl text-gray-100 hover:bg-blue-700 rounded">
                    <FaComments className="mr-3" />
                    Testimonials
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
