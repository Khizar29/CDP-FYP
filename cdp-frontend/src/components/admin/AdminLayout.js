import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import HeaderAdmin from './HeaderAdmin';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prevState => !prevState);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true); // Keep sidebar open on large screens
            } else {
                setSidebarOpen(false); // Hide sidebar on small screens
            }
        };

        handleResize(); // Initialize sidebar state based on current window size

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            {/* Main Content Area */}
            <div className="flex-1 transition-all duration-300">
                {/* Header */}
                <HeaderAdmin onToggleSidebar={toggleSidebar} />
                
                {/* Main Content */}
                <main className="p-8 mt-10 mx-auto w-full max-w-screen-xl">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;