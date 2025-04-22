import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import placeholder from "../../Images/placeholder.png";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [neighbors, setNeighbors] = useState({ prev: null, next: null });

  useEffect(() => {
    const fetchAlumniDetails = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/${id}`
        );
        setAlumni(response.data.data);

        // Fetch neighboring alumni for navigation
        const neighborsResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates/${id}/neighbors`
        );
        setNeighbors(neighborsResponse.data.data);
      } catch (error) {
        setError(error.message || "Error fetching alumni details");
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
      icon: <EmailIcon />,
      label: "Email",
      url: `mailto:?subject=Check out this profile&body=Check out the profile of ${alumni.fullName}: http://111.68.108.227:3000/profile/${id}`,
    },
    {
      icon: <WhatsAppIcon />,
      label: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=Check out the profile of ${alumni.fullName}: http://111.68.108.227:3000/profile/${id}`,
    },
  ];

  const profileImageUrl = alumni.profilePic
    ? alumni.profilePic
    : `${placeholder}`;

  const sanitizeHtml = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  return (
    <div className="min-h-screen bg-[#d39fed] flex flex-col">
      {/* Header */}
      <Header />

      {/* Navigation Controls - Top (for mobile) */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#5c2d91] text-white">
        <button
          onClick={() => {
            navigate(`/profile/${neighbors.prev}`);
          }}
          disabled={!neighbors.prev}
          className={`flex items-center px-3 py-2 rounded ${neighbors.prev ? 'bg-[#f4e1ce] text-[#5c2d91] hover:bg-[#e3cbb9]' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          <ArrowBackIosIcon fontSize="small" />
          <span className="ml-1">Previous</span>
        </button>
        <button
          onClick={() => navigate("/alumni")}
          className="px-4 py-2 rounded-full bg-[#f4e1ce] text-[#5c2d91] hover:bg-[#e3cbb9] text-sm"
        >
          Back to list
        </button>
        <button
          onClick={() => navigate(`/profile/${neighbors.next}`)}
          disabled={!neighbors.next}
          className={`flex items-center px-3 py-2 rounded ${neighbors.next ? 'bg-[#f4e1ce] text-[#5c2d91] hover:bg-[#e3cbb9]' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          <span className="mr-1">Next</span>
          <ArrowForwardIosIcon fontSize="small" />
        </button>
      </div>

      {/* Social Media and Share Section */}
      <header className="hidden md:flex justify-between items-center p-6 relative">
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
            onClick={() => navigate("/alumni")}
            className="text-[#5c2d91] px-4 py-2 rounded-full bg-[#f4e1ce] hover:bg-[#e3cbb9] text-sm"
          >
            Back to list
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row px-12 py-8 mb-12 relative">
        {/* Left arrow - now fully visible */}
        <div className="hidden md:flex flex-col justify-center absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => navigate(`/profile/${neighbors.prev}`)}
            disabled={!neighbors.prev}
            className={`
      p-0 w-12 h-12 rounded-full shadow-lg flex items-center justify-center
      ${neighbors.prev ? 'bg-yellow-500 text-white hover:bg-yellow-700' : 'bg-gray-300 cursor-not-allowed'}
    `}
            aria-label="Previous profile"
          >
            <ArrowBackIosIcon
              fontSize="medium"
              className="relative left-[2px]" // Slight adjustment for perfect centering
            />
          </button>
        </div>

        {/* Right arrow - perfectly centered */}
        <div className="hidden md:flex flex-col justify-center absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => navigate(`/profile/${neighbors.next}`)}
            disabled={!neighbors.next}
            className={`
      p-0 w-12 h-12 rounded-full shadow-lg flex items-center justify-center
      ${neighbors.next ? 'bg-yellow-500 text-white hover:bg-yellow-700' : 'bg-gray-300 cursor-not-allowed'}
    `}
            aria-label="Next profile"
          >
            <ArrowForwardIosIcon
              fontSize="medium"
              className="relative right-[2px]" 
            />
          </button>
        </div>

        {/* Left Section - Profile Image and Basic Info */}
        <div className="w-full flex flex-col items-center bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8 max-w-sm mx-auto">
          <img
            src={profileImageUrl || `${placeholder}`}
            alt={`Profile of ${alumni.fullName}`}
            className="rounded-lg w-64 h-64 object-cover mb-6 shadow-md"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yellow-500">
              {alumni.fullName}
            </h1>
            <p className="text-sm font-bold text-gray-500 mt-2">
              {alumni.tagline || "No tagline available"}
            </p>
            <p className="text-sky-600 font-bold text-md mt-1">
              {" "}
              {alumni.nuId}
            </p>
            <p className="text-sky-600 font-bold text-md mt-1">
              Class of {alumni.yearOfGraduation}
            </p>
            <p className="text-sky-600 font-bold text-md mt-1">
              {" "}
              {alumni.discipline}
            </p>
            <p className="text-sky-600 font-bold text-md mt-1">
              CGPA: {alumni.cgpa}
            </p>
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

        {/* Right Section */}
        <div className="w-full md:w-2/3 mt-8 md:mt-0 md:ml-8">
          {/* Certifications */}
          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-yellow-500">Certifications</h2>
            <div
              className="text-md text-sky-600 mt-2"
              dangerouslySetInnerHTML={sanitizeHtml(alumni.certificate || "No certifications listed")}
            ></div>
          </div>

          {/* Experience */}
          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-yellow-500">Professional Experience</h2>
            <div
              className="text-md text-sky-600 mt-2"
              dangerouslySetInnerHTML={sanitizeHtml(alumni.personalExperience || "No professional experience")}
            ></div>
          </div>

          {/* Final Year Project */}
          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-yellow-500">Final Year Project</h2>
            <div
              className="text-md text-sky-600 mt-2"
              dangerouslySetInnerHTML={sanitizeHtml(alumni.fyp || "No final year project title available")}
            ></div>
          </div>
        </div>
      </main>

      {/* Navigation Controls - Bottom (for mobile) */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#5c2d91] text-white">
        <button
          onClick={() => navigate(`/profile/${neighbors.prev}`)}
          disabled={!neighbors.prev}
          className={`flex items-center px-3 py-2 rounded ${neighbors.prev ? 'bg-[#f4e1ce] text-[#5c2d91] hover:bg-[#e3cbb9]' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          <ArrowBackIosIcon fontSize="small" />
          <span className="ml-1">Previous</span>
        </button>
        <button
          onClick={() => navigate("/alumni")}
          className="px-4 py-2 rounded-full bg-[#f4e1ce] text-[#5c2d91] hover:bg-[#e3cbb9] text-sm"
        >
          Back to list
        </button>
        <button
          onClick={() => navigate(`/profile/${neighbors.next}`)}
          disabled={!neighbors.next}
          className={`flex items-center px-3 py-2 rounded ${neighbors.next ? 'bg-[#f4e1ce] text-[#5c2d91] hover:bg-[#e3cbb9]' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          <span className="mr-1">Next</span>
          <ArrowForwardIosIcon fontSize="small" />
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;