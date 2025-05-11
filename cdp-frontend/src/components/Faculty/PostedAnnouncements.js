import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Graduates/Pagination";
import { UserContext } from "../../contexts/UserContext";
import AnnouncementView from "../AnnouncementView";

const FacultyManageAnnouncements = () => {
  const { user } = useContext(UserContext); // Get logged-in faculty
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // For the selected announcement
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Optional: for search filtering
  const announcementsPerPage = 10;

  // ✅ Open the modal for the selected announcement
  const openModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  // ✅ Close the modal
  const closeModal = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(false);
  };

  // Fetch announcements from the server
  const fetchAnnouncements = async (page = 1) => {
    if (!user || user.role !== "faculty") return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/announcements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page, limit: announcementsPerPage, searchTerm, facultyOnly: true },
        }
      );
      setAnnouncements(response.data.data);
      setFilteredAnnouncements(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements(currentPage);
  }, [currentPage, searchTerm, user]);

  // Ensure pagination buttons work properly
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle delete announcement
  const handleDeleteAnnouncement = async (announcementId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/announcements/${announcementId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from UI after successful delete
      setAnnouncements((prev) => prev.filter((ann) => ann._id !== announcementId));
      setFilteredAnnouncements((prev) => prev.filter((ann) => ann._id !== announcementId));

      alert("Announcement deleted successfully.");
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("Failed to delete announcement.");
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 md:mb-0">
              My Announcements
            </h2>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by Heading"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full md:w-auto py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <Link
                to="/faculty/announcements/add"
                id="NewAnnouncement"
                className="w-full md:w-auto inline-flex items-center justify-center bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                <FaPlus className="mr-2" /> New Announcement
              </Link>
            </div>
          </div>

          {/* Table for Announcements */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md mb-6">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-center bg-blue-100 border-b">#</th>
                  <th className="py-2 px-3 text-left bg-blue-100 border-b">Heading</th>
                  <th className="py-2 px-3 text-left bg-blue-100 border-b">Posted On</th>
                  <th className="py-2 px-3 text-left bg-blue-100 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement, index) => (
                    <tr
                      key={announcement._id}
                      className="border-b hover:bg-gray-100 transition duration-300"
                    >
                      <td className="py-2 px-3 text-center">{index + 1}</td>
                      <td className="py-2 px-3">{announcement.heading}</td>
                      <td className="py-2 px-3">
                        {new Date(announcement.postedOn).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {/* View Button */}
                        <button
                          className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-300 mr-2"
                          onClick={() => openModal(announcement)}
                        >
                          View
                        </button>

                        {/* Edit Button */}
                        <Link
                          to={`/faculty/announcements/edit/${announcement._id}`}
                          state={{ action: "edit", data: announcement }}
                        >
                          <button
                            className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                        </Link>

                        {/* Delete Button */}
                        <button
                          className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300"
                          onClick={() => handleDeleteAnnouncement(announcement._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-gray-500"
                    >
                      No Announcements Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* ✅ Modal for Viewing Announcement */}
      {selectedAnnouncement && isModalOpen && (
        <AnnouncementView
          announcement={selectedAnnouncement}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default FacultyManageAnnouncements;
