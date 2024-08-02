// src/components/AlumniPage.js
import React from 'react';
import backgroundImage from '../Images/graduates.jpeg'; // Replace with your actual image path
import SearchBar from './SearchBar'; // Import the SearchBar component

const AlumniPage = () => {
  return (
    <div>
      <div
        className="relative h-2/3 bg-cover bg-center" // Adjusted height
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
        <div className="relative flex flex-col items-center justify-center h-full text-white text-center z-10">
          <h1 className="text-3xl md:text-4xl font-bold">Alumnus/Alumnae List</h1>
          <p className="text-md md:text-lg mt-4">Connecting our alumni network</p>
        </div>
      </div>
      <div className="py-8">
        <SearchBar /> {/* Add the SearchBar component here */}
      </div>
    </div>
  );
};

export default AlumniPage;
