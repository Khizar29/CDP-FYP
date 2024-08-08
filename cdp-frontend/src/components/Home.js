// src/components/Home.js
import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import backgroundImage from '../Images/FAST_PIC_1.jpg';
import About from './About';

const Home = ({ aboutRef }) => {
  return (
    <div>
      <section id="home" className="relative h-screen rounded-3xl m-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative flex flex-col items-center justify-center h-full text-white text-center z-20">
          <h1 className="text-4xl md:text-6xl font-bold">Welcome <span className='text-white'>to </span> <br/>FAST <span className='text-yellow-500'>Career </span>Developement <span className='text-sky-600'>Portal</span> </h1>
          <p className="text-xl md:text-2xl mt-4">Your Gateway to a Successful Career Journey</p>
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
      <About ref={aboutRef} />
    </div>
  );
};

export default Home;
