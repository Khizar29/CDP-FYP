// src/components/StatsBanner.js
import React from 'react';
import { FaCalendarAlt, FaLaptop, FaUserTie, FaSearchDollar, FaUsers, FaMicroscope, FaIndustry } from 'react-icons/fa';
import CountUp from 'react-countup';

const stats = [
  { label: 'Number of graduating students', value: 950, icon: <FaCalendarAlt className="text-purple-500 text-6xl" /> },
  { label: 'Employed', value: 72, icon: <FaLaptop className="text-blue-500 text-6xl" /> },
  { label: 'Seeking Employment', value: 14, icon: <FaUserTie className="text-red-500 text-6xl" /> },
  { label: 'Average salary of undergraduate', value: 108000, icon: <FaSearchDollar className="text-green-500 text-6xl" />, prefix: 'Rs.' },
  { label: 'Recruitment Drives', value: 60, icon: <FaUserTie className="text-green-500 text-6xl" />, suffix: '+' },
  { label: 'Guest speaker sessions', value: 40, icon: <FaMicroscope className="text-orange-500 text-6xl" />, suffix: '+' },
  { label: 'Companies participated in Career Fair 2024', value: 170, icon: <FaIndustry className="text-red-500 text-6xl" />, suffix: '+' }
];

const StatsBanner = () => {
  return (
    <div className="flex justify-center space-x-8 mb-12 px-10"> {/* Added padding on left/right with px-10 */}
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[#C2E6F5] rounded-lg p-6 text-center shadow-lg hover:shadow-2xl transition transform hover:scale-105 w-64 h-48 flex flex-col justify-center items-center"
        >
          <div className="flex justify-center mb-4">
            {stat.icon}
          </div>
          <p className="text-4xl font-bold text-gray-800">
            {stat.prefix ? (
              <span>{stat.prefix}</span>
            ) : null}
            <CountUp start={0} end={stat.value} duration={3} />
            {stat.suffix && <span>{stat.suffix}</span>} {/* Display suffix (plus sign) */}
            {stat.label === 'Employed' || stat.label === 'Seeking Employment' ? '%' : ''}
          </p>
          <p className="text-gray-500 mt-2">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBanner;
