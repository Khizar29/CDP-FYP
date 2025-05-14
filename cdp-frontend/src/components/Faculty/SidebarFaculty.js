import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdCampaign } from "react-icons/md";  // New announcement icon
import { FaNewspaper } from "react-icons/fa";  // Newsfeed icon

const SidebarFaculty = ({ isOpen, toggleSidebar }) => {
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
        <aside className={`bg-blue-900 text-white w-64 min-h-screen p-6 pt-8 fixed top-16 left-0 z-10 transform transition-transform duration-300 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>

            {/* Close Button for Mobile View */}
            <button 
                onClick={toggleSidebar} 
                className="absolute top-4 right-4 text-white text-2xl font-bold lg:hidden hover:text-gray-300 transition"
            >
                ✕
            </button>

            {/* Adjusted spacing */}
            <nav className="mt-20">
                <Link to="/faculty/announcements" onClick={toggleSidebar} className="flex items-center py-3 px-6 text-lg text-gray-100 hover:bg-blue-700 rounded">
                    <MdCampaign className="mr-3 text-xl" />
                    Announcements
                </Link>
                <Link to="/faculty/newsfeed" onClick={toggleSidebar} className="flex items-center py-3 px-6 text-lg text-gray-100 hover:bg-blue-700 rounded">
                    <FaNewspaper className="mr-3 text-x1" />
                    Newsfeed
                </Link>
                <Link to="/faculty/jobs" onClick={toggleSidebar} className="flex items-center py-3 px-6 text-lg text-gray-100 hover:bg-blue-700 rounded">
                    <FaNewspaper className="mr-3 text-x1" />
                    Jobs
                </Link>
            </nav>
        </aside>
    );
};

export default SidebarFaculty;
