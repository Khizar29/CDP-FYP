import React, { useState, useEffect } from "react";
import DashboardHeader from "../DashboardHeader";
import { Outlet } from "react-router-dom";
import SidebarFaculty from "./SidebarFaculty";

const FacultyLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <SidebarFaculty isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <DashboardHeader role="faculty" onToggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="p-6 mt-16 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FacultyLayout;
