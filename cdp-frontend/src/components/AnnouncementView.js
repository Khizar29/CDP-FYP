import React, { useEffect } from "react";

const AnnouncementView = ({ announcement, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!announcement) return null;

  const postedDate = new Date(announcement.postedOn || announcement.date);
  const isValidDate = !isNaN(postedDate.getTime());

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleBackgroundClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
    >
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 w-[95%] max-w-3xl rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col max-h-[90vh]">
        
        {/* Scrollable content area */}
        <div className="overflow-y-auto pr-2 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
            {announcement.heading || announcement.title}
          </h2>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {announcement.text || announcement.content}
          </p>

          <div className="flex flex-col sm:flex-row justify-between text-gray-500 text-xs sm:text-sm mt-6 border-t pt-4">
            <div>
              <span className="font-semibold">Posted by:</span>{" "}
              {announcement.postedBy?.fullName || "Unknown"}
            </div>
            <div>
              <span className="font-semibold">Posted on:</span>{" "}
              {isValidDate ? postedDate.toLocaleDateString() : "Invalid Date"}
            </div>
          </div>
        </div>

        {/* Always visible Close button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementView;
