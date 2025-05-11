import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import EditFaculty from "./EditFaculty";
import Pagination from "../Graduates/Pagination";

const AdminFaculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all"); // all, verified, pending
    const [searchTerm, setSearchTerm] = useState("");
    const [editFaculty, setEditFaculty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Number of faculty per page

    useEffect(() => {
        fetchFaculty(currentPage);
    }, [currentPage, filterStatus, searchTerm]);

    const fetchFaculty = async (page = 1) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page,
                    limit,
                    searchTerm,
                    filterStatus,
                },
            });

            setFaculty(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching faculty members:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleVerify = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");

            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty/verify/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchFaculty(currentPage);
        } catch (error) {
            console.error("Error verifying faculty:", error);
        }
    };

    const handleUnverify = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty/unverify/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchFaculty(currentPage);
        } catch (error) {
            console.error("Error unverifying faculty:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this faculty member?")) {
            try {
                const token = localStorage.getItem("accessToken");
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchFaculty(currentPage);
            } catch (error) {
                console.error("Error deleting faculty:", error);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Manage Faculty</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by Name or Email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-auto py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full md:w-auto py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                    <option value="all">All</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {/* Faculty Table */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">#</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Name</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Email</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Department</th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">Status</th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculty.map((fac, index) => (
                            <tr key={fac._id} className="border-b hover:bg-gray-100 transition duration-300">
                                <td className="py-2 px-3 text-center">{(currentPage - 1) * limit + index + 1}</td>
                                <td className="py-2 px-3">{fac.fullName}</td>
                                <td className="py-2 px-3">{fac.nuEmail}</td>
                                <td className="py-2 px-3">{fac.department}</td>
                                <td className="py-2 px-3 text-center">{fac.isVerified ? "✅ Verified" : "❌ Pending"}</td>
                                <td className="py-2 px-3 flex justify-center gap-2">
                                    {!fac.isVerified ? (
                                        <button onClick={() => handleVerify(fac._id)} className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 flex items-center gap-1">
                                            <FaCheck /> Approve
                                        </button>
                                    ) : (
                                        <button onClick={() => handleUnverify(fac._id)} className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 flex items-center gap-1">
                                            <FaTimes /> Unverify
                                        </button>
                                    )}
                                    <button onClick={() => setEditFaculty(fac)} className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 flex items-center gap-1">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(fac._id)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 flex items-center gap-1">
                                        <FaTrash /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Component */}
            <div className="mt-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>

            {/* Show Edit Faculty Modal */}
            {editFaculty && (
                <EditFaculty faculty={editFaculty} onClose={() => setEditFaculty(null)} refresh={() => fetchFaculty(currentPage)} />
            )}
        </div>
    );
};

export default AdminFaculty;
