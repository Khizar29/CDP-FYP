import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";

const AddAnnouncement = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Form fields state
  const [heading, setHeading] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate inputs
    if (!heading || !text) {
      setError("Both heading and text are required.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/announcements`,
        { heading, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Announcement created successfully!");
      setTimeout(() => navigate("/faculty/announcements"), 2000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Create Announcement</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          {/* Heading Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Heading</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
            />
          </div>

          {/* Text Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Text</label>
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              rows="5"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Announcement"}
            </button>

            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/faculty/announcements")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncement;
