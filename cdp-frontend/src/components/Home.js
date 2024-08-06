// src/components/Home.js
import React from 'react';
import { Link as ScrollLink } from 'react-scroll'; // Use react-scroll for smooth scrolling
import { Link as RouterLink } from 'react-router-dom'; // Use react-router-dom for navigation
import backgroundImage from '../Images/FAST_PIC_1.jpg';
import About from './About';
// import AlumniBenefits from './AlumniBenefits';
// import ContactUs from './ContactUs'; // Import the ContactUs component

const Home = ({ aboutRef }) => {
  return (
    <div>
      <section id="home" className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative flex flex-col items-center justify-center h-full text-white text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold">Welcome to FAST ALUMNI & Career Portal</h1>
          <p className="text-xl md:text-2xl mt-4">Connecting CS alumni across the globe</p>
          <div className="mt-8 space-x-4">
            <ScrollLink to="about" smooth={true} duration={500} className="bg-blue-900 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer">
              Find Out More
            </ScrollLink>
            <RouterLink to="/signin" className="bg-blue-900 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer">
              Login
            </RouterLink>
          </div>
        </div>
      </section>
      <About ref={aboutRef} /> {/* Move About section here */}
    </div>
  );
};

export default Home;
