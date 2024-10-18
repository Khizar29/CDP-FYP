import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header'; // Adjust the import path as needed
import Footer from '../Footer'; // Adjust the import path as needed

// Import Material UI icons
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';

const ProfilePage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // useNavigate for navigation
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false); // State to toggle share menu

  useEffect(() => {
    const fetchAlumniDetails = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/${id}`);
        setAlumni(response.data.data);
      } catch (error) {
        setError(error.message || 'Error fetching alumni details');
      } finally {
        setLoading(false);
      }
    };
    fetchAlumniDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!alumni) return <div>No alumni data available</div>;

  const shareOptions = [
    {
      icon: <EmailIcon />, // Material UI Email Icon
      label: 'Email',
      url: `mailto:?subject=Check out this profile&body=Check out the profile of ${alumni.firstName} ${alumni.lastName}: http://localhost:3000/profile/${id}`,
    },
    {
      icon: <WhatsAppIcon />, // Material UI WhatsApp Icon
      label: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=Check out the profile of ${alumni.firstName} ${alumni.lastName}: http://localhost:3000/profile/${id}`,
    },
  ];

  // Generate the correct Google Drive thumbnail link format
  const profileImageUrl = alumni.profilePic
    ? `https://drive.google.com/thumbnail?id=${alumni.profilePic.split('/d/')[1]?.split('/')[0]}&sz=s4000`
    : 'https://placehold.co/300x300';

  return (
    <div className="min-h-screen bg-[#C1E4FB] flex flex-col">
      {/* Header */}
      <Header />

      {/* Social Media and Share Section */}
      <header className="bg-[#C1E4FB] flex justify-between items-center p-6 relative">
        <div className="flex space-x-4 text-[#5c2d91] text-xl"></div>
        <div className="flex items-center space-x-4 relative">
          {shareMenuOpen && (
            <div className="absolute flex space-x-2 -left-20 top-0">
              {shareOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-white shadow-md rounded-full hover:bg-gray-100 text-[#5c2d91]"
                >
                  {option.icon}
                </a>
              ))}
            </div>
          )}
          <button
            className="text-[#5c2d91] px-4 py-2 rounded-full bg-[#f4e1ce] hover:bg-[#e3cbb9] text-sm"
            onClick={() => setShareMenuOpen(!shareMenuOpen)}
          >
            <ShareIcon /> Share Profile
          </button>

          <button
            onClick={() => navigate('/alumni')} // Navigate to the alumni list
            className="text-[#5c2d91] px-4 py-2 rounded-full bg-[#f4e1ce] hover:bg-[#e3cbb9] text-sm"
          >
            Back to list
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row p-8 mb-12">
        {/* Left Section - Profile Image and Basic Info in a shadow box */}
        <div className="w-full flex flex-col items-center bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8 max-w-sm mx-auto">
          <img
            src={profileImageUrl || 'https://placehold.co/300x300'}
            alt={`Profile of ${alumni.firstName} ${alumni.lastName}`}
            className="rounded-lg w-64 h-64 object-cover mb-6 shadow-md"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#5c2d91]">{alumni.firstName} {alumni.lastName}</h1>
            <p className="text-sm text-gray-500 mt-2">{alumni.tagline || 'No tagline available'}</p>
            <p className="text-gray-500 text-sm mt-1"> {alumni.nuId}</p>
            <p className="text-gray-500 text-sm mt-1">Class of {alumni.yearOfGraduation}</p>
            <p className="text-gray-500 text-sm mt-1"> {alumni.discipline}</p>
            <p className="font-semibold text-[#5c2d91] mt-2">CGPA: {alumni.cgpa}</p>
            <div className="mt-4">
              <p className="text-gray-500 text-sm flex items-center justify-center">
                <EmailIcon className="mr-2" /> {alumni.nuEmail}
              </p>
              <p className="text-gray-500 text-sm flex items-center justify-center">
                <EmailIcon className="mr-2" /> {alumni.personalEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Skills, Experience, Final Year Project */}
        <div className="w-full md:w-2/3 mt-8 md:mt-0 md:ml-8">
          {/* Skills */}
          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-[#000]">Core Skills & Certifications</h2>
            <ul className="mt-4 text-sm text-[#5c2d91] grid grid-cols-2 gap-y-4">
              {alumni.skills ? alumni.skills.map((skill, index) => (
                <li key={index}><i className="fas fa-circle text-xs mr-2"></i> {skill}</li>
              )) : <li>No skills listed</li>}
              {alumni.certificates && <li><i className="fas fa-certificate text-xs mr-2"></i> {alumni.certificates}</li>}
            </ul>
          </div>

          {/* Experience */}
          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-[#000]">Experience</h2>
            <div className="mt-4">
              <h3 className="font-semibold text-[#5c2d91]">Professional Experience</h3>
              <p className="text-sm text-[#5c2d91] mt-2">{alumni.personalExperience || 'No professional experience available'}</p>

              {alumni.leadershipExperience && (
                <>
                  <h3 className="font-semibold text-[#5c2d91] mt-6">Leadership / Meta-Curricular</h3>
                  <ul className="mt-2 text-sm text-[#5c2d91] grid grid-cols-2 gap-y-4">
                    {alumni.leadershipExperience.map((item, index) => (
                      <li key={index}><i className="fas fa-circle text-xs mr-2"></i> {item}</li>
                    ))}
                  </ul>
                </>
              )}

              {alumni.internshipExperience && (
                <>
                  <h3 className="font-semibold text-[#5c2d91] mt-6">Internship / Volunteer Work</h3>
                  <ul className="mt-2 text-sm text-[#5c2d91] grid grid-cols-2 gap-y-4">
                    {alumni.internshipExperience.map((item, index) => (
                      <li key={index}><i className="fas fa-circle text-xs mr-2"></i> {item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Final Year Project */}
          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#000]">Final Year Project</h2>
            <div className="mt-4">
              <h3 className="font-semibold text-[#5c2d91]">Project Title</h3>
              <p className="text-sm text-gray-600 mt-2">{alumni.fyp || 'No final year project title available'}</p>
              <h3 className="font-semibold text-[#5c2d91] mt-4">Description</h3>
              <p className="text-sm text-gray-600 mt-2">{alumni.fypDescription || 'No description available'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
