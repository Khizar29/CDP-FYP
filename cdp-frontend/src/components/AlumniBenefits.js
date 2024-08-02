// src/components/AlumniBenefits.js
import React from 'react';
import { FaClipboardList, FaBook, FaUserFriends } from 'react-icons/fa';
import backgroundImage from '../Images/FAST_PIC_3.jpg';

const AlumniBenefits = () => {
  const benefits = [
    { icon: <FaClipboardList />, title: "Career Support", description: "Get assistance with your career goals." },
    { icon: <FaBook />, title: "News & Events", description: "Stay informed and engaged with the latest updates and events from the FAST Alumni & Career Portal." },
    { icon: <FaUserFriends />, title: "Alumni Directory", description: "Connect with fellow alumni." },
  ];

  return (
    <div
      className="py-8"  // Adjust padding to reduce white space
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white">ALUMNI BENEFITS</h2>
        <p className="text-gray-200 mt-2">As a member of the global FAST alumni network, you have access to a variety of exclusive services and benefits.</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-white bg-opacity-20 p-4 rounded-full inline-block mb-4">
              <div className="text-white text-3xl">{benefit.icon}</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-300">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniBenefits;
