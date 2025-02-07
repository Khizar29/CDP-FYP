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
    <section
      className="min-h-screen py-16 flex flex-col items-center justify-center bg-cover bg-center relative space-y-10"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative text-center text-white max-w-3xl">
        <h2 className="text-5xl font-extrabold text-gray-100">ALUMNI BENEFITS</h2>
        <p className="text-lg mt-4 text-gray-300">
          As a member of the global FAST alumni network, you have access to a variety of exclusive services and benefits.
        </p>
      </div>
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-gray-900 bg-opacity-80 text-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-xl border border-gray-700"
          >
            <div className="bg-gray-800 p-6 rounded-full inline-block mb-6 text-4xl text-blue-400 shadow-md">
              {benefit.icon}
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-100">{benefit.title}</h3>
            <p className="text-gray-400 text-lg leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlumniBenefits;
