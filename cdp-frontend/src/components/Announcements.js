import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AnnouncementView from "./AnnouncementView";

const Announcement = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [allAnnouncements, setAllAnnouncements] = useState([]); // All announcements
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const announcementsPerPage = 9; // 9 announcements per page

  useEffect(() => {
    setFadeIn(true);
    fetchFacultyNames();
    fetchAnnouncements();
  }, []);

  const fetchFacultyNames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/announcements/faculty-names`);
      setFacultyList(response.data.data);
    } catch (err) {
      console.error("Error fetching faculty names:", err);
      setError("Error fetching faculty names");
    }
  };

  const fetchAnnouncements = async (facultyName = "") => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/announcements`, {
        withCredentials: true,
        params: {
          facultyName: facultyName,
          facultyOnly: false,
        },
      });
      setAllAnnouncements(response.data.data); // Fetch all announcements at once
      setCurrentPage(1); // Reset to page 1 after fetching
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(`Error fetching announcements: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyChange = (facultyName) => {
    setSelectedFaculty(facultyName);
    fetchAnnouncements(facultyName);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = allAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
  const totalPages = Math.ceil(allAnnouncements.length / announcementsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-lightblue-400 to-lightblue-100 min-h-screen py-8 px-4 sm:px-6">
      <div
        className={`transition-opacity duration-1000 ease-in-out ${
          fadeIn ? "opacity-100" : "opacity-0"
        } max-w-7xl mx-auto`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faBullhorn} className="text-blue-900 text-3xl sm:text-4xl" />
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">Announcements</h2>
          </div>

          {/* Faculty Filter Dropdown */}
          <div className="w-full sm:w-1/5">
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

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {currentAnnouncements.map((announcement, index) => (
            <div
              key={index}
              className="bg-blue-100 p-5 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full"
            >
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between mb-3">
                  <h3 className="text-lg sm:text-2xl font-bold text-blue-900 mb-2">
                    {announcement.heading}
                  </h3>
                  <span className="text-yellow-500 font-bold text-sm sm:text-base">
                    {announcement.type}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 text-sm sm:text-base line-clamp-1">
                  {announcement.text}
                </p>

                <div className="flex justify-between text-gray-500 text-xs sm:text-sm mb-2">
                  <span className="text-yellow-500">{formatDate(announcement.postedOn)}</span>
                </div>

                <div className="text-gray-500 text-xs italic mb-6">
                  Posted by:{" "}
                  <span className="font-medium text-darkblue">
                    {announcement.postedBy?.fullName}
                  </span>
                </div>
              </div>

              {/* View More Button */}
              <div className="flex justify-start mt-auto">
                <button
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="py-2 px-6 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm"
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="py-2 px-4 bg-blue-800 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-blue-900 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="py-2 px-4 bg-blue-800 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {selectedAnnouncement && (
          <AnnouncementView
            announcement={selectedAnnouncement}
            onClose={() => setSelectedAnnouncement(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Announcement;
