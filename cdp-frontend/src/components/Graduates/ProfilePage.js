
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-[#5c2d91]">Loading...</div>
      </div>
    );

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

  const profileImageUrl = alumni.profilePic ? alumni.profilePic : placeholder;
  const sanitizeHtml = (htmlContent) => ({
    __html: DOMPurify.sanitize(htmlContent),
  });

  return (
    <div className="min-h-screen bg-[#d39fed] flex flex-col relative">
      <Header />

      {/* Share + Back Button */}
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

      {/* Profile Content */}
      <main className="container mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row px-12 py-8 mb-12 relative">
        <div className="w-full flex flex-col items-center bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8 max-w-sm mx-auto">
          <img
            src={profileImageUrl}
            alt={`Profile of ${alumni.fullName}`}
            className="rounded-lg w-64 h-64 object-cover mb-6 shadow-md"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yellow-500">{alumni.fullName}</h1>
            <p className="text-sm font-bold text-gray-500 mt-2">{alumni.tagline || "No tagline available"}</p>
            <p className="text-sky-600 font-bold text-md mt-1">{alumni.nuId}</p>
            <p className="text-sky-600 font-bold text-md mt-1">Class of {alumni.yearOfGraduation}</p>
            <p className="text-sky-600 font-bold text-md mt-1">{alumni.discipline}</p>
            <p className="text-sky-600 font-bold text-md mt-1">CGPA: {alumni.cgpa}</p>
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

        {/* Right Info */}
        <div className="w-full md:w-2/3 mt-8 md:mt-0 md:ml-8">
          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-yellow-500">Certifications</h2>
            <div
              className="text-md text-sky-600 mt-2"
              dangerouslySetInnerHTML={sanitizeHtml(alumni.certificate || "No certifications listed")}
            ></div>
          </div>

          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-yellow-500">Professional Experience</h2>
            <div
              className="text-md text-sky-600 mt-2"
              dangerouslySetInnerHTML={sanitizeHtml(alumni.personalExperience || "No professional experience")}
            ></div>
          </div>

          <div className="bg-[#C1E4FB] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-yellow-500">Final Year Project</h2>
            <div
              className="text-md text-sky-600 mt-2"
              dangerouslySetInnerHTML={sanitizeHtml(alumni.fyp || "No final year project title available")}
            ></div>
          </div>
        </div>
      </main>

      {/* ✨ Final Beautiful Floating Navigation */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {/* Previous */}
        <button
          onClick={() => navigate(`/profile/${neighbors.prev}`)}
          disabled={!neighbors.prev}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-xl backdrop-blur-md bg-[#f4e1ce]/70 text-sm font-medium transition transform hover:-translate-y-1 hover:scale-105 ${
            neighbors.prev
              ? 'text-[#5c2d91] hover:bg-[#f4e1ce]'
              : 'text-gray-400 bg-gray-300 cursor-not-allowed'
          }`}
        >
          <ArrowBackIosIcon fontSize="small" />
          Previous Graduate
        </button>

        {/* Next */}
        <button
          onClick={() => navigate(`/profile/${neighbors.next}`)}
          disabled={!neighbors.next}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-xl backdrop-blur-md bg-[#f4e1ce]/70 text-sm font-medium transition transform hover:-translate-y-1 hover:scale-105 ${
            neighbors.next
              ? 'text-[#5c2d91] hover:bg-[#f4e1ce]'
              : 'text-gray-400 bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next Graduate
          <ArrowForwardIosIcon fontSize="small" />
        </button>

        {/* Back to List */}
        <button
          onClick={() => navigate("/alumni")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-xl backdrop-blur-md bg-[#f4e1ce]/70 text-[#5c2d91] text-sm font-medium transition transform hover:-translate-y-1 hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M3 14h11m-7-7v10M17 7l4 4-4 4" />
          </svg>
          Back to List
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
