// src/components/ContactUs.js
import React from 'react';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';

const ContactUs = () => {
  const latitude = 24.8568991;
  const longitude = 67.2646838;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 px-20 py-16">
      <div className="w-full max-w-7xl bg-gray-800 rounded-lg shadow-lg flex overflow-hidden flex-col lg:flex-row">
        {/* Left Section - Contact Info */}
        <div className="w-full lg:w-1/2 p-16 bg-gradient-to-b from-blue-500 to-blue-200 text-white">
          <h2 className="text-3xl font-bold mb-6">Get in touch</h2>
          <div className="mb-8">
            <h3 className="text-lg font-semibold">Visit us</h3>
            <p>Office of Industrial Liaison, Career Services and Digital Media, FAST National University of Computer and Emerging Sciences, Karachi</p>
            <p>St-4, Sector 17-D, NH 5, Karachi, Karachi City, Sindh</p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold">Chat to us</h3>
            <p>Our friendly team is here to help.</p>
            <p><a href="mailto:aysha.siddiqui@nu.edu.pk" className="text-white">aysha.siddiqui@nu.edu.pk</a></p>
            <p><a href="mailto:cso.khi@nu.edu.pk" className="text-white">cso.khi@nu.edu.pk</a></p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold">Call us</h3>
            <p>Mon-Fri from 9am to 3:30pm</p>
            <p><a href="tel:+92-21-111-128-128" className="text-white">+92-21-111-128-128</a></p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold">Social media</h3>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/aysha-siddiqui-9880451a2/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <FaLinkedin size={24} />
              </a>
              {/* Add other social media links as needed */}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold">Location</h3>
            <iframe
              title="Google Maps"
              width="100%"
              height="200"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="w-full lg:w-1/2 p-16 bg-gray-900 text-white">
          <form>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 text-lg">First Name</label>
                <input
                  type="text"
                  placeholder="Your first name"
                  className="w-full p-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-lg">Last Name</label>
                <input
                  type="text"
                  placeholder="Your last name"
                  className="w-full p-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="block mb-2 text-lg">Subject</label>
              <input
                type="text"
                placeholder="Your subject"
                className="w-full p-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-8">
              <label className="block mb-2 text-lg">Email</label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-8">
              <label className="block mb-2 text-lg">Message</label>
              <textarea
                placeholder="Tell us what we can help you with"
                className="w-full p-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
              ></textarea>
            </div>

            <div className="mt-8">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox bg-gray-800 border border-gray-700 text-blue-500" />
                <span className="ml-3 text-lg">
                  I'd like to receive more information about the company. I understand and agree to the{' '}
                  <a href="#" className="text-blue-500">Privacy Policy</a>.
                </span>
              </label>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full p-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
