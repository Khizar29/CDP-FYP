import React, { useEffect, useState, useContext, useRef } from "react";
import {  FaBars } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"; // Import icons

import { BsThreeDotsVertical } from "react-icons/bs"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Images/logo-FAST-NU.png";
import { UserContext } from "../contexts/UserContext";

const DashboardHeader = ({ role, onToggleSidebar }) => {
    const { user, logout } = useContext(UserContext);
    const [name, setName] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
    }, [role]);
    
    useEffect(() => {
        if (user && user.role) {
            setName(user.fullName);
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/"); // Redirect to Home page after logout
            alert("Log out Successful");
        } catch (error) {
            console.error("Error during logout", error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="bg-white shadow-lg fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-20">
            <div className="flex items-center">
                <button className="text-xl cursor-pointer block lg:hidden" onClick={onToggleSidebar}>
                    <FaBars />
                </button>
                <img src={logo} alt="Logo" className="h-10 ml-4 mr-2" />
                <h1 className="ml-4 text-xl font-bold text-blue-900">
                    {role === "admin" && "Admin Dashboard"}
                    {role === "recruiter" && "Recruiter Dashboard"}
                    {role === "faculty" && "Faculty Dashboard"} {/* Add faculty role here */}
                </h1>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                    <span className="text-blue-900 mr-2 hidden md:inline-block">{name}</span>
                    <span className="text-blue-900 md:hidden">
                        <BsThreeDotsVertical />
                    </span>
                    <span className={`transform transition-transform ${dropdownOpen ? "rotate-180" : ""} hidden md:inline-block`}>▼</span>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                        <div className="px-4 py-2 text-gray-800">
                            {name}
                        </div>
                        <hr className="border-gray-300" />
                        <Link to="/" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                            <FontAwesomeIcon icon={faGlobe} className="mr-2 text-blue-600" /> {/* Webpage icon */}
                            WebPage
                        </Link>
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
                            <FontAwesomeIcon icon={faRightFromBracket} className="mr-2 text-red-600" /> {/* Logout icon */}
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default DashboardHeader;
