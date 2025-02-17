import React, { useState } from "react";
import DashboardHeader from "../DashboardHeader";
import { Outlet } from "react-router-dom";

const FacultyLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
          
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Recruiter Header */}
                <DashboardHeader role="faculty" onToggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="p-6 mt-16 overflow-y-auto">
                    <Outlet />  {/* ✅ Only renders the active page */}
                </main>
            </div>
        </div>
    );
};

export default FacultyLayout;
