import React, { useState } from "react";
import axios from "axios";

const EditRecruiter = ({ recruiter, onClose, refresh }) => {
    const [formData, setFormData] = useState({
        fullName: recruiter.fullName || "",
        companyName: recruiter.companyName || "",
        companyEmail: recruiter.companyEmail || "",
        companyPhone: recruiter.companyPhone || "",
        designation: recruiter.designation || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/${recruiter._id}`,
                formData,
                { withCredentials: true }
            );
            refresh(); // Refresh the recruiter list
            onClose(); // Close modal after update
        } catch (err) {
            setError("Error updating recruiter. Please try again.");
            console.error("Error updating recruiter:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Edit Recruiter</h2>

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
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Email</label>
                        <input
                            type="email"
                            name="companyEmail"
                            value={formData.companyEmail}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Phone</label>
                        <input
                            type="tel"
                            name="companyPhone"
                            value={formData.companyPhone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
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

export default EditRecruiter;
