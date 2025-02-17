import React from "react";
import { X } from "lucide-react";

const AnnouncementView = ({ announcement, onClose }) => {
  // Ensure the announcement exists
  if (!announcement) return null;

  // Ensure date is valid
  const postedDate = new Date(announcement.postedOn || announcement.date);
  const isValidDate = !isNaN(postedDate.getTime());

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[90%] md:w-1/2 lg:w-1/3 rounded-2xl shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose} // ✅ Closes only when clicking the close button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* Announcement Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {announcement.heading || announcement.title}
        </h2>

        {/* Announcement Content */}
        <p className="text-gray-600 text-sm md:text-base">{announcement.text || announcement.content}</p>

        {/* Posted By */}
        <div className="mt-4 text-gray-500 text-xs md:text-sm">
          Posted by: {announcement.postedBy?.fullName || "Unknown"}
        </div>

        {/* Date */}
        <div className="mt-4 text-gray-500 text-xs md:text-sm">
          Posted on: {isValidDate ? postedDate.toLocaleDateString() : "Invalid Date"}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose} // ✅ Closes only when clicking this button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementView;
