import React, { useState } from "react";
import axios from "axios";

const EditFaculty = ({ faculty, onClose, refresh }) => {
    const [formData, setFormData] = useState({
        fullName: faculty.fullName || "",
        nuEmail: faculty.nuEmail || "",
        phoneNumber: faculty.phoneNumber || "",
        department: faculty.department || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty/${faculty._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                refresh(); // Refresh the faculty list
                onClose(); // Close modal after update
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error updating faculty. Please try again.");
            console.error("Error updating faculty:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
            onClick={onClose} // Close modal on background click
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Edit Faculty</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">NU Email</label>
                        <input
                            type="email"
                            name="nuEmail"
                            value={formData.nuEmail}
                            className="w-full p-2 border rounded focus:ring-blue-500"
                            required
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFaculty;
