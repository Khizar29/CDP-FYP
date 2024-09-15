import React, { useState, useEffect, useContext } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import About from './About';
import Testimonials from './Testimonials';
import StatsBanner from './StatsBanner';
import { UserContext } from '../contexts/UserContext';

// Import your background images
import backgroundImage1 from '../Images/FAST_PIC_1.jpg';
import backgroundImage2 from '../Images/FAST_PIC_2.jpg';
import backgroundImage3 from '../Images/FAST_PIC_3.jpg';

const images = [backgroundImage1, backgroundImage2, backgroundImage3];

const Home = ({ aboutRef }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { user, setUser } = useContext(UserContext); // Access user from context

  // Custom hook to change images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length); // Cycle through images
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval when component unmounts
  }, []);

  const handleLogout = () => {
    // Clear the user context when logging out
    setUser(null);
    // You can also add logout logic (like calling an API to destroy the session)
    alert('Logged out successfully');
  };

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="relative h-screen rounded-3xl m-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            transition: 'background-image 1s ease-in-out', // Smooth transition
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative flex flex-col items-center justify-center h-full text-white text-center z-20">
          <h1 className="text-4xl md:text-6xl font-bold">
            Welcome <span className="text-white">to </span>
            <br />
            FAST <span className="text-yellow-500">Career </span>
            Development <span className="text-sky-600">Portal</span>
          </h1>
          <p className="text-xl md:text-2xl mt-4">Your Gateway to a Successful Career Journey</p>
          <div className="mt-8 space-x-4">
            {/* Conditionally render "Find Out More" or "Admin Panel" */}
            {user?.role === 'admin' ? (
              <RouterLink
                to="/admin"
                className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400 transition duration-300 cursor-pointer"
              >
                Admin Panel
              </RouterLink>
            ) : (
              <ScrollLink
                to="about-section"
                smooth={true}
                duration={500}
                className="bg-blue-900 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer"
              >
                Find Out More
              </ScrollLink>
            )}

            {/* Conditionally render "Login" or "Logout" */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500 transition duration-300 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <RouterLink
                to="/signin"
                className="bg-blue-900 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer"
              >
                Login
              </RouterLink>
            )}
          </div>
        </div>
      </section>

      {/* Stats Banner Section */}
      <StatsBanner />

      {/* About Section */}
      <section id="about-section">
        <About ref={aboutRef} />
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default Home;
