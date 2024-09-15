import React from 'react';
import { Link } from "react-router-dom";

const About = React.forwardRef((props, ref) => (
  <div ref={ref} id="about" className="bg-[#E3F6FD] py-16"> {/* Changed the full section background to bg-blue-100 */}
    <div className="container mx-auto px-4 lg:px-8">
      <div className="md:w-3/4 mx-auto">
        {/* Intro Section */}
        <h6 className="text-blue-600 uppercase tracking-widest text-sm font-semibold">Career Development</h6>
        <h2 className="text-4xl font-bold text-gray-900 mt-2 leading-tight">
          About the Career Development Portal
        </h2>
        <p className="text-lg text-gray-600 mt-4 leading-relaxed">
          Welcome to the Career Services and Industrial Liaison Office Portal of FAST National University Karachi. Our platform is designed to assist students, alumni, and employers in building successful career connections. We are dedicated to empowering individuals and organizations by bridging the gap between job seekers and employers.
        </p>

        {/* Mission Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mt-8">
          <h3 className="text-2xl font-semibold text-gray-800">Our Mission</h3>
          <p className="text-gray-700 mt-4 leading-relaxed">
            At the heart of our mission is the desire to connect talented individuals with meaningful career opportunities. We aim to foster a community where job seekers find roles that align with their skills, goals, and values, while also helping employers discover top-tier talent to enhance their organizations.
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed">
            Whether you're a student taking your first steps toward a career or an alumnus looking for growth opportunities, our portal is here to support you at every stage. Employers can also rely on us to connect them with graduates who are prepared to make a difference in their industry.
          </p>
        </div>

        {/* Value Proposition Section */}
        <div className="bg-blue-100 rounded-lg p-8 mt-8"> {/* Kept the background color here for contrast */}
          <h3 className="text-2xl font-semibold text-blue-900">Why Choose Us?</h3>
          <ul className="list-disc list-inside text-gray-700 mt-4 leading-relaxed">
            <li><strong>Comprehensive Job Listings:</strong> Access a wide range of job opportunities tailored to your skills and interests.</li>
            <li><strong>Professional Development:</strong> Explore workshops, seminars, and resources to boost your career readiness.</li>
            <li><strong>Industry Connections:</strong> Build lasting relationships with employers and industry leaders.</li>
            <li><strong>Personalized Career Guidance:</strong> Receive one-on-one counseling and resume review services.</li>
            <li><strong>Alumni Network:</strong> Tap into a robust network of FAST alumni who are making strides in their respective fields.</li>
          </ul>
        </div>

        {/* Quote Section */}
        <blockquote className="bg-gray-200 rounded-lg p-6 mt-8 text-gray-700 italic border-l-4 border-blue-500">
          "Thank you for choosing us as your partner in career growth. We look forward to helping you achieve your aspirations and connect you with opportunities that will shape your future."
        </blockquote>

      </div>
    </div>
  </div>
));

export default About;
