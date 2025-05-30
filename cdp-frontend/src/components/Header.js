import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faInfoCircle, faChalkboardTeacher, faGraduationCap, faCalendar, faUser, faPhone, faBullhorn, faBriefcase, faKey, faRightFromBracket, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import logo from '../Images/logo-FAST-NU.png';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import SignIn from './SignIn'; // Import the SignIn component
import { IoMdLogOut } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";


const Header = ({ scrollToSection }) => {
  const navigate = useNavigate(); // Initialize navigate for programmatic navigation
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to Home page after logout
      alert('Log out Successful');
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleOpenSignIn = () => setSignInOpen(true);
  const handleCloseSignIn = () => setSignInOpen(false);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-100 to-sky-600 text-white py-2 md:py-4">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center">
          <img src={logo} alt="FAST University Logo" className="h-8 md:h-10 lg:h-12" />
        </div>
        <nav className="hidden md:flex flex-grow justify-end space-x-4 lg:space-x-6">
          <Link to="/" className="text-white no-underline font-semibold flex items-center hover:text-yellow-400 space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faHome} /> <span>Home</span>
          </Link>
          <Link to="/about" className="text-white no-underline font-semibold flex items-center hover:text-yellow-400 space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faInfoCircle} /> <span>About Us</span>
          </Link>
          {user && (
            <Link to="/announcements" className="text-white no-underline font-semibold flex items-center hover:text-yellow-400 space-x-1 cursor-pointer">
              <FontAwesomeIcon icon={faBullhorn} /> <span>Announcement</span>
            </Link>
          )}
          <Link to="/jobs" className="text-white no-underline font-semibold flex items-center hover:text-yellow-400 space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faBriefcase} /> <span>Jobs</span>
          </Link>
          <Link to="/alumni" className="text-white no-underline font-semibold flex items-center hover:text-yellow-400 space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faGraduationCap} /> <span>Alumni</span>
          </Link>
          <Link to="/news" className="text-white no-underline font-semibold flex items-center hover:text-yellow-400 space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faCalendar} /> <span>News & Events</span>
          </Link>
          <Link to="/contactUs" className="text-white no-underline font-semibold flex items-center hover:text-yellow-400 space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faPhone} /> <span>Contact Us</span>
          </Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                <span className="text-white mr-2 hidden md:inline-block">{user.fullName}</span>
                <span className="text-white md:hidden">
                  <BsThreeDotsVertical />
                </span>
                <span className={`transform transition-transform ${isDropdownOpen ? "rotate-180" : ""} hidden md:inline-block`}>
                  ▼
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-gray-800">{user.fullName}</div>
                  <hr className="border-gray-300" />
                  <Link to="/change-password" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faKey} className="mr-2 text-blue-600" /> {/* Key Icon for Password */}
                    Change Password
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <FontAwesomeIcon icon={faUserShield} className="mr-2 text-purple-600" /> {/* Admin Panel icon */}
                      Admin Panel
                    </Link>
                  )}
                  {user.role === 'faculty' && (
                    <Link to="/faculty/announcements" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" /> Faculty Panel
                    </Link>
                  )}
                  {user.role === 'recruiter' && (
                    <Link to="/recruiter" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" /> Recruiter Panel
                    </Link>
                  )}
                  {(user.role === "user" && (
                    <Link to={`/edit-profile/${user.nuId}`} className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" /> {/* User Icon for Profile */}
                      Update Profile
                    </Link>
                  ))}
                  <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faRightFromBracket} className="mr-2 text-red-600" /> {/* Logout icon */}
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div onClick={handleOpenSignIn} className="text-white no-underline font-semibold flex items-center space-x-1 cursor-pointer">
              <FontAwesomeIcon icon={faUser} /> <span>Login</span>
            </div>
          )}
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-30 transform md:hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black opacity-50" onClick={toggleMenu}></div>
            <nav className="relative bg-gradient-to-bl from-blue-100 to-sky-600 h-full w-64 py-4 flex flex-col transition-transform duration-300 transform">
              <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
                <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
              </button>
              <img src={logo} alt="FAST University Logo" className="h-10 mx-auto mb-6" />
              <Link to="/" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faHome} /> <span>Home</span>
              </Link>
              <Link to="/about" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faInfoCircle} /> <span>About Us</span>
              </Link>
              {user && (
                <Link to="/announcements" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
                  <FontAwesomeIcon icon={faBullhorn} /> <span>Announcements</span>
                </Link>
              )}
              <Link to="/jobs" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBriefcase} /> <span>Jobs</span>
              </Link>
              <Link to="/alumni" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faGraduationCap} /> <span>Alumni</span>
              </Link>
              <Link to="/news" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faCalendar} /> <span>News & Events</span>
              </Link>
              <Link to="/contactUs" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faPhone} /> <span>Contact Us</span>
              </Link>

              {user ? (
                <div className="relative">
                  <div className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faUser} /> <span>{user.fullName}</span>
                    <FontAwesomeIcon
                      icon={isDropdownOpen ? faAngleUp : faAngleDown}
                      className="ml-2"
                    />
                  </div>
                  {isDropdownOpen && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <Link to="/change-password" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                        <FontAwesomeIcon icon={faKey} className="mr-2 text-blue-600" /> {/* Key Icon for Password */}
                        Change Password
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                          <FontAwesomeIcon icon={faUserShield} className="mr-2 text-purple-600" /> {/* Admin Panel icon */}
                          Admin Panel
                        </Link>
                      )}
                      {/* Faculty Panel Link */}
                      {user.role === 'faculty' && (
                        <Link to="/faculty/announcements" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                          <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" /> Faculty Panel
                        </Link>
                      )}
                      {user.role === 'recruiter' && (
                        <Link to="/recruiter" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                          <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" /> Recruiter Panel
                        </Link>
                      )}
                      <div onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">
                        <FontAwesomeIcon icon={faRightFromBracket} className="mr-2 text-red-600" /> {/* Logout icon */}
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
                  <FontAwesomeIcon icon={faUser} /> <span>Login</span>
                </Link>
              )}
            </nav>
          </>
        )}
      </div>

      {signInOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg relative max-w-md w-full">
            <button
              onClick={handleCloseSignIn}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <SignIn onClose={handleCloseSignIn} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
