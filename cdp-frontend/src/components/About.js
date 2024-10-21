import React from 'react';
import { Link } from "react-router-dom";

const About = React.forwardRef((props, ref) => (
  <div ref={ref} id="about" className="bg-white py-12">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="flex flex-col items-center">
        {/* Narrow the width */}
        <div className="max-w-2xl w-full text-center">
          <h6 className="text-gray-600 uppercase tracking-widest text-sm">All About Our Campus</h6>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            About Career Development Portal
          </h2>
          <h4 className="text-xl font-semibold text-blue-600 mt-4">
            Welcome to the Career Services and Industrial Liaison Office Portal of FAST National University Karachi.
          </h4>
          <p className="text-gray-700 mt-4">
            We are passionate about connecting talented individuals with their dream careers and empowering organizations to find the perfect fit for their teams.
            <br />
            <br />
            <span className="font-bold">Our mission</span> is simple: to bridge the gap between job seekers and employers, fostering mutually beneficial connections that lead to personal and professional growth. We're committed to helping job seekers find meaningful employment opportunities that align with their skills, goals, and values.
          </p>
          <p className="text-gray-700 mt-4">
            Simultaneously, we assist employers in identifying top talent to drive their businesses forward. Whether you're taking the first step on your career journey or looking to take it to the next level, FAST National University Career Services and Industrial Liaison Office is here to support you every step of the way.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 mt-4 italic text-gray-600">
            "Thank you for choosing us as your partner in career growth. We look forward to helping you achieve your aspirations and connect you with the opportunities that will shape your future."
          </blockquote>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-700">
              Ready to embark on your career journey with us?{" "}
              <Link to="/signup" className="text-blue-500">Sign Up</Link> / <Link to="/signin" className="text-blue-500">Log In</Link> today!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

export default About;
