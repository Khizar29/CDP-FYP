import React, { useState } from 'react';
import { Link } from "react-router-dom";
import fatimaImg from '../Images/fatima.jpeg'; // Import Fatima Ali's image

const About = React.forwardRef((props, ref) => {
  const [showDev, setShowDev] = useState(false);

  return (
    <div ref={ref} id="about" className="bg-white pt-2 pb-2 md:pt-4 md:pb-3 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Slider Container */}
        <div className="relative w-full min-h-[550px] md:min-h-[600px] lg:min-h-[650px] overflow-hidden rounded-lg shadow-lg">
          <div
            className={`flex transition-transform duration-700 ease-in-out w-[200%] ${
              showDev ? '-translate-x-1/2' : 'translate-x-0'
            }`}
          >
            {/* Slide 1: About Portal */}
            <div className="w-full md:w-1/2 min-h-[550px] px-4 flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <h6 className="text-gray-600 uppercase tracking-widest text-sm">All About Our Campus</h6>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  About Career Development Portal
                </h2>
                <h4 className="text-xl font-semibold text-blue-600 mt-4">
                  Welcome to the Career Services and Industrial Liaison Office Portal of FAST National University Karachi.
                </h4>
                <p className="text-gray-700 mt-4">
                  We are passionate about connecting talented individuals with their dream careers and empowering organizations to find the perfect fit for their teams.
                  <br /><br />
                  <span className="font-bold">Our mission</span> is to bridge the gap between job seekers and employers, creating meaningful professional connections.
                </p>
                <p className="text-gray-700 mt-4">
                  Whether you're starting out or leveling up your career, we're here for you.
                </p>
                <blockquote className="border-l-4 border-blue-500 pl-4 mt-4 italic text-gray-600">
                  "Thank you for choosing us as your partner in career growth."
                </blockquote>
                <div className="mt-6">
                  <p className="text-gray-700">
                    Ready to get started?{" "}
                    <Link to="/signup" className="text-blue-500">Sign Up</Link> /{" "}
                    <Link to="/signin" className="text-blue-500">Log In</Link>
                  </p>
                  <button
                    onClick={() => setShowDev(true)}
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Meet the Developers 🚀
                  </button>
                </div>
              </div>
            </div>

            {/* Slide 2: Developers */}
            <div className="w-full md:w-1/2 min-h-[550px] px-4 flex items-center justify-center">
              <div className="text-center max-w-5xl w-full">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">About the Developers</h2>
                <p className="italic text-gray-600 mb-8">
                  "Made with ❤️ by FASTians passionate about innovation and impact."
                </p>

                {/* Developer Cards in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
                  {[
                    {
                      name: 'Syed Khizar Ali',
                      role: 'Full Stack Developer',
                      id: '21K-3329',
                      img: 'https://via.placeholder.com/150',
                      link: 'https://www.linkedin.com/in/syed-khizar-ali-091520326/'
                    },
                    {
                      name: 'Fatima Ali',
                      role: 'Frontend Developer',
                      id: '21K-3249',
                      img: fatimaImg,
                      link: 'https://www.linkedin.com/in/fatima-ali-680442244/'
                    },
                    {
                      name: 'Syed Muhammad Ali',
                      role: 'Backend Developer',
                      id: '21K-3335',
                      img: 'https://via.placeholder.com/150',
                      link: 'https://www.linkedin.com/in/syedmuhammadali'
                    }
                  ].map((dev, idx) => (
                    <a
                      key={idx}
                      href={dev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
                    >
                      <img
                        src={dev.img}
                        alt={dev.name}
                        className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
                      />
                      <p className="mt-4 font-bold text-lg text-gray-800">{dev.name}</p>
                      <p className="text-sm text-gray-500">{dev.id}</p>
                      <p className="text-sm text-gray-500">{dev.role}</p>
                      {dev.note && (
                        <p className="text-xs italic text-red-400 mt-1">{dev.note}</p>
                      )}
                    </a>
                  ))}
                </div>

                <button
                  onClick={() => setShowDev(false)}
                  className="mt-10 inline-block bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                >
                  ← Back to About
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default About;
