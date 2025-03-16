

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios

const Announcement = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFadeIn(true);
    fetchFacultyNames(); // Fetch faculty names for the filter
    fetchAnnouncements(); // Fetch announcements on component mount
  }, []);

  // Fetch faculty names from the backend
  const fetchFacultyNames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/announcements/faculty-names`);
      setFacultyList(response.data.data); // Set faculty names for the filter dropdown
    } catch (err) {
      console.error("Error fetching faculty names:", err);
      setError("Error fetching faculty names");
    }
  };

  // Fetch announcements from the backend
  const fetchAnnouncements = async (facultyName = "") => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/announcements`, {
        withCredentials: true,
        params: {
          facultyName: facultyName, // Send faculty name as a filter
          page: 1,
          limit: 10,
          facultyOnly: false,
        },
      });
      setFilteredAnnouncements(response.data.data); // Set announcements data
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(`Error fetching announcements: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle faculty filter change
  const handleFacultyChange = (facultyName) => {
    setSelectedFaculty(facultyName); // Update selected faculty
    fetchAnnouncements(facultyName); // Fetch announcements based on selected faculty
  };

  // Format date to "Month Day, Year" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-lightblue-400 to-lightblue-100 min-h-screen py-10">
      <div
        className={`transition-opacity duration-1000 ease-in-out ${fadeIn ? "opacity-100" : "opacity-0"} max-w-7xl mx-auto px-6`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faBullhorn} className="text-darkblue text-4xl" />
            <h2 className="text-4xl font-bold text-darkblue">Announcements</h2>
          </div>

          {/* Faculty Filter Dropdown */}
          <div className="w-1/5 ml-auto">
            <select
              className="p-3 bg-white border border-gray-300 rounded-md text-darkblue font-medium w-full text-sm"
              value={selectedFaculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
            >
              <option value="">Filter by Faculty</option>
              {facultyList.map((faculty, index) => (
                <option key={index} value={faculty.fullName}>
                  {faculty.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid layout with filtered announcements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {filteredAnnouncements.map((announcement, index) => (
            <div
              key={index}
              className="bg-blue-100 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="flex justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{announcement.heading}</h3>
                <span className="text-yellow-500 font-bold">{announcement.type}</span>
              </div>

              {/* Card Content */}
              <p className="text-gray-700 mb-4">{announcement.text}</p>
              <div className="flex justify-between text-gray-500 text-sm mb-1">
               <span className="text-yellow-500">{formatDate(announcement.postedOn)}</span> {/* Format posted date */}
              </div>

              {/* Display Faculty Name */}
              <div className="text-gray-500 text-xs italic mb-4">
                Posted by: <span className="font-medium text-darkblue">{announcement.postedBy?.fullName}</span>
              </div>

              <button className="py-2 px-4 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition duration-300">
                View More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
