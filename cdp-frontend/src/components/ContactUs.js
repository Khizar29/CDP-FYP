// src/components/ContactUs.js
import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import illustration from '../Images/contact.png'; // Replace with your actual image path

const ContactUs = () => {
  const latitude = 24.8568991;
  const longitude = 67.2646838;

  return (
    <div className="bg-white p-8 lg:p-31 flex flex-col lg:flex-row items-center justify-between">
      <div className="text-left lg:w-1/2">
        <h3 className="text-green-600 text-sm mb-2">How can we help you?</h3>
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-700 mb-3">
          The Team of Office of Industrial Liaison and Career Services is here to assist you in every way possible. Whether you're a job seeker in search of guidance or an employer with hiring needs, we're just a message away.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-2">
          <FaEnvelope className="inline mr-2 text-green-600" />
          <a href="mailto:aysha.siddiqui@nu.edu.pk" className="text-blue-500">aysha.siddiqui@nu.edu.pk</a>
        </p>
        <p className="mb-5">
          <FaEnvelope className="inline mr-2 text-green-600" />
          <a href="mailto:cso.khi@nu.edu.pk" className="text-blue-500">cso.khi@nu.edu.pk</a>
        </p>

        <h2 className="text-2xl font-semibold mb-3">Connect on Social Media</h2>
        <p className="mb-5">
          <FaLinkedin className="inline mr-2 text-green-600" />
          <a href="https://www.linkedin.com/in/aysha-siddiqui-9880451a2/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Aysha Siddiqui LinkedIn
          </a>
        </p>

        <h2 className="text-2xl font-semibold mb-4">Visit Us</h2>
        <p className="mb-3">
          Office of Industrial Liaison, Career Services and Digital Media, FAST National University of Computer and Emerging Sciences, Karachi
          <br />
          St-4, Sector 17-D, NH 5, Karachi, Karachi City, Sindh
        </p>

        <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
        <p className="mb-4">
          Monday to Friday: 9:00 AM – 3:30 PM (Local Time)
          <br />
          Saturday: Closed
          <br />
          Sunday: Closed
        </p>

        <h2 className="text-2xl font-semibold mb-3">Location</h2>
        <div className="mb-6">
          <iframe
            title="Google Maps"
            width="100%"
            height="300"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
        <img src={illustration} alt="Illustration" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default ContactUs;
