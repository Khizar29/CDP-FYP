import React, { useState, useContext, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import backgroundImage1 from '../Images/FAST_PIC_1.jpg';
import backgroundImage2 from '../Images/FAST_PIC_2.jpg';
import backgroundImage3 from '../Images/FAST_PIC_3.jpg';
import bgimg4 from '../Images/bg-4.jpg';
import bgimg5 from '../Images/bg-5.jpg';
import bgimg6 from '../Images/bg-6.jpg';
import bgimg7 from '../Images/bg-7.jpg';

import About from './About';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import ContactUs from './ContactUs';
import SignIn from './SignIn';
import Slider from './Testimonial/Slider';
import NewsFeed from './Newsfeeds/NewsFeed';

const Home = ({ aboutRef, contactRef }) => {
  const { user, logout } = useContext(UserContext); // Get logout from context
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [signInOpen, setSignInOpen] = useState(false);
  const backgroundImages = [backgroundImage1, backgroundImage2, backgroundImage3];
  const transitionInterval = 5000;
  const navigate = useNavigate();

  useEffect(() => {
    const changeBackgroundImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    };
    const interval = setInterval(changeBackgroundImage, transitionInterval);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from context
      navigate('/');
      alert('Log out Successful');
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const handleOpenSignIn = () => setSignInOpen(true);
  const handleCloseSignIn = () => setSignInOpen(false);

  return (
    <div>
      <section id="home" className="relative h-screen rounded-3xl m-4 lg:m-10 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex transition-all ease-linear duration-[5000ms] h-full" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className="w-full h-full bg-cover bg-center flex-none"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative flex flex-col items-center justify-center h-full text-white text-center z-20 px-4 lg:px-0">
          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Welcome <span className='text-white'>to </span> <br />
            FAST <span className='text-yellow-500'>Career </span>
            Development <span className='text-sky-600'>Portal</span>
          </h1>
          <p className="text-lg lg:text-xl xl:text-2xl mt-4 max-w-3xl mx-auto">
            Your Gateway to a Successful Career Journey
          </p>
          <div className="mt-8 space-y-4 lg:space-y-0 lg:space-x-4 flex flex-col lg:flex-row">
            {user && user.role === 'admin' && (
              <RouterLink to="/admin" className="bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer">
                Admin Dashboard
              </RouterLink>
            )}
            {user && user.role === 'recruiter' && (
              <RouterLink to="/recruiter" className="bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer">
                Recruiter Dashboard
              </RouterLink>
            )}
            {user && user.role === 'faculty' && (
              <RouterLink to="/faculty/announcements" className="bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer">
                Faculty Dashboard
              </RouterLink>
            )}
            {!user && (
              <ScrollLink to="about" smooth={true} duration={500} className="bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer">
                Find Out More
              </ScrollLink>
            )}

            {user ? (
              <button onClick={handleLogout} className="bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer">
                Logout
              </button>
            ) : (
              <button onClick={handleOpenSignIn} className="bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer">
                Login
              </button>
            )}
          </div>
        </div>
      </section>

      <section
        className="min-h-screen py-10 flex flex-col items-center justify-center bg-cover bg-center relative space-y-10"
        style={{
          backgroundImage: `url(${bgimg5})`,
        }}
      >
        <About ref={aboutRef} />
      </section>

      <section className="min-h-screen py-10 flex flex-col items-center justify-center bg-cover bg-center relative space-y-10">
        <NewsFeed limit={4} />
      </section>

      <section
        className="min-h-screen py-10 flex flex-col items-center justify-center bg-cover bg-center relative space-y-10"
        style={{
          backgroundImage: `url(${bgimg6})`,
        }}
      >
        <div className="text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-100 mb-2">
            Testimonials
          </h2>
        </div>
        <Slider />
      </section>

      <div ref={contactRef}>
        <ContactUs />
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
    </div>
  );
};

export default Home;
