// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use react-router-dom for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faInfoCircle, faGraduationCap, faCalendar, faUser, faPhone, faGift } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/logo-FAST-NU.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-blue-900 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-5">
        <div className="flex items-center">
          <img src={logo} alt="FAST University Logo" className="h-10 md:h-12" />
        </div>
        <nav className="hidden md:flex flex-grow justify-end space-x-6">
          <Link to="/" className="text-white no-underline font-semibold flex items-center space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faHome} /> <span>Home</span>
          </Link>
          
          <Link to="/about" className="text-white no-underline font-semibold flex items-center space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faInfoCircle} /> <span>About Us</span>
          </Link>
          <Link to="/benefits" className="text-white no-underline font-semibold flex items-center space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faGift} /> <span>Benefits</span>
          </Link>
          <Link to="/alumni" className="text-white no-underline font-semibold flex items-center space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faGraduationCap} /> <span>Alumni</span>
          </Link>
          <Link to="/events" className="text-white no-underline font-semibold flex items-center space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faCalendar} /> <span>News & Events</span>
          </Link>
          <Link to="/signin" className="text-white no-underline font-semibold flex items-center space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faUser} /> <span>Login</span>
          </Link>
          <Link to="/contact" className="text-white no-underline font-semibold flex items-center space-x-1 cursor-pointer">
            <FontAwesomeIcon icon={faPhone} /> <span>Contact Us</span>
          </Link>
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-30 transform md:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={toggleMenu}></div>
          <nav className="relative bg-blue-900 h-full w-64 py-4 flex flex-col">
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
            <Link to="/benefits" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faGift} /> <span>Benefits</span>
            </Link>
            <Link to="/alumni" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faGraduationCap} /> <span>Alumni</span>
            </Link>
            <Link to="/events" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faCalendar} /> <span>News & Events</span>
            </Link>
            <Link to="/signin" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faUser} /> <span>Login</span>
            </Link>
            <Link to="/contact" className="text-white no-underline px-6 py-2 font-semibold flex items-center space-x-1 cursor-pointer" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faPhone} /> <span>Contact Us</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
