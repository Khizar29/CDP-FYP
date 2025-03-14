import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import EditRecruiter from "./EditRecruiter";
import Pagination from "../Graduates/Pagination"; // ✅ Import Pagination Component

const AdminRecruiters = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all"); // all, verified, pending
    const [searchTerm, setSearchTerm] = useState("");
    const [editRecruiter, setEditRecruiter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Number of recruiters per page

    useEffect(() => {
        fetchRecruiters(currentPage);
    }, [currentPage, filterStatus, searchTerm]); // ✅ Refetch on page change or filter change

    const fetchRecruiters = async (page = 1) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters`, {
                withCredentials: true,
                params: {
                    page,
                    limit,
                    searchTerm,
                    filterStatus,
                },
            });

            setRecruiters(response.data.data);
            setTotalPages(response.data.totalPages); // ✅ Set total pages from API
        } catch (error) {
            console.error("Error fetching recruiters:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleVerify = async (id) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/verify/${id}`, {}, { withCredentials: true });
            fetchRecruiters(currentPage);
        } catch (error) {
            console.error("Error verifying recruiter:", error);
        }
    };

    const handleUnverify = async (id) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/unverify/${id}`, {}, { withCredentials: true });
            fetchRecruiters(currentPage);
        } catch (error) {
            console.error("Error unverifying recruiter:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this recruiter?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/${id}`, { withCredentials: true });
                fetchRecruiters(currentPage);
            } catch (error) {
                console.error("Error deleting recruiter:", error);
            }
        }
    };

    const filteredRecruiters = recruiters.filter((rec) => {
        if (filterStatus === "verified") return rec.isVerified;
        if (filterStatus === "pending") return !rec.isVerified;
        return true;
    }).filter(rec => rec.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || rec.companyEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Manage Recruiters</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by Company or Email"
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

            {/* Recruiters Table */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">#</th> {/* ✅ Numbering Column */}
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Company</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Email</th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">Status</th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecruiters.map((rec, index) => (
                            <tr key={rec._id} className="border-b hover:bg-gray-100 transition duration-300">
                                <td className="py-2 px-3 text-center">{(currentPage - 1) * limit + index + 1}</td> {/* ✅ Numbering */}
                                <td className="py-2 px-3">{rec.companyName}</td>
                                <td className="py-2 px-3">{rec.companyEmail}</td>
                                <td className="py-2 px-3 text-center">{rec.isVerified ? "✅ Verified" : "❌ Pending"}</td> {/* ✅ Center align Status */}
                                <td className="py-2 px-3 flex justify-center gap-2">
                                    {!rec.isVerified ? (
                                        <button onClick={() => handleVerify(rec._id)} className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 flex items-center gap-1">
                                            <FaCheck /> Approve
                                        </button>
                                    ) : (
                                        <button onClick={() => handleUnverify(rec._id)} className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 flex items-center gap-1">
                                            <FaTimes /> Unverify
                                        </button>
                                    )}
                                    <button onClick={() => setEditRecruiter(rec)} className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 flex items-center gap-1">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(rec._id)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 flex items-center gap-1">
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Show Edit Recruiter Modal */}
            {editRecruiter && (
                <EditRecruiter
                    recruiter={editRecruiter}
                    onClose={() => setEditRecruiter(null)}
                    refresh={() => fetchRecruiters(currentPage)}
                />
            )}
        </div>
    );
};

export default AdminRecruiters;
