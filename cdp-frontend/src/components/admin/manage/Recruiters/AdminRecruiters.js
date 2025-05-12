
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import EditRecruiter from "./EditRecruiter";
import Pagination from "../Graduates/Pagination";

const AdminRecruiters = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [editRecruiter, setEditRecruiter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRecruiters, setSelectedRecruiters] = useState([]);
    const limit = 10;

    useEffect(() => {
        fetchRecruiters(currentPage);
    }, [currentPage, filterStatus, searchTerm]);

    const fetchRecruiters = async (page = 1) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters`, {
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

            setRecruiters(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching recruiters:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleVerify = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/verify/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchRecruiters(currentPage);
        } catch (error) {
            console.error("Error verifying recruiter:", error);
        }
    };

    const handleUnverify = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/unverify/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchRecruiters(currentPage);
        } catch (error) {
            console.error("Error unverifying recruiter:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this recruiter?")) {
            try {
                const token = localStorage.getItem("accessToken");
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
    }).filter(rec =>
        rec.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.companyEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBulkAction = async (actionType) => {
        try {
            if (selectedRecruiters.length === 0) return;

            let confirmationMessage = "";
            switch (actionType) {
                case "approve":
                    confirmationMessage = "Are you sure you want to approve all selected recruiters?";
                    break;
                case "unverify":
                    confirmationMessage = "Are you sure you want to unverify all selected recruiters?";
                    break;
                case "delete":
                    confirmationMessage = "Are you sure you want to delete selected recruiters?";
                    break;
                default:
                    return;
            }

            if (!window.confirm(confirmationMessage)) {
                return;
            }

            const requests = selectedRecruiters.map(id => {
                switch (actionType) {
                    case "approve":
                        return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/verify/${id}`, {}, { withCredentials: true });
                    case "unverify":
                        return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/unverify/${id}`, {}, { withCredentials: true });
                    case "delete":
                        return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/recruiters/${id}`, { withCredentials: true });
                    default:
                        return null;
                }
            });

            await Promise.all(requests);
            setSelectedRecruiters([]);
            fetchRecruiters(currentPage);
        } catch (error) {
            console.error("Error performing bulk action:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Manage Recruiters</h2>

            {/* Filters, Bulk Actions, and Search in One Row */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 flex-wrap">
                {/* Search box expands to fill remaining space */}
                <input
                    type="text"
                    placeholder="Search by Company or Email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900 min-w-[200px]"
                />

                {/* Bulk action buttons */}
                {selectedRecruiters.length > 0 && (
                    <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                        <button onClick={() => handleBulkAction("approve")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Bulk Approve
                        </button>
                        <button onClick={() => handleBulkAction("unverify")} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                            Bulk Unverify
                        </button>
                        <button onClick={() => handleBulkAction("delete")} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Bulk Delete
                        </button>
                    </div>
                )}

                {/* Filter dropdown */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full md:w-auto py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900 min-w-[150px]"
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
                            <th className="py-2 px-3 bg-blue-100 border-b text-center">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedRecruiters(filteredRecruiters.map(rec => rec._id));
                                        } else {
                                            setSelectedRecruiters([]);
                                        }
                                    }}
                                    checked={
                                        selectedRecruiters.length === filteredRecruiters.length &&
                                        filteredRecruiters.length > 0
                                    }
                                />
                            </th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">#</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Company</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Email</th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">Status</th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecruiters.map((rec, index) => (
                            <tr key={rec._id} className="border-b hover:bg-gray-100 transition duration-300">
                                <td className="py-2 px-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedRecruiters.includes(rec._id)}
                                        onChange={() => {
                                            if (selectedRecruiters.includes(rec._id)) {
                                                setSelectedRecruiters(selectedRecruiters.filter(id => id !== rec._id));
                                            } else {
                                                setSelectedRecruiters([...selectedRecruiters, rec._id]);
                                            }
                                        }}
                                    />
                                </td>
                                <td className="py-2 px-3 text-center">{(currentPage - 1) * limit + index + 1}</td>
                                <td className="py-2 px-3">{rec.companyName}</td>
                                <td className="py-2 px-3">{rec.companyEmail}</td>
                                <td className="py-2 px-3 text-center">
                                    {rec.isVerified ? "✅Verified" : "❌Pending"}
                                </td>
                                <td className="py-2 px-3 flex justify-center gap-2">
                                    {!rec.isVerified ? (
                                        <button
                                            onClick={() => handleVerify(rec._id)}
                                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 flex items-center gap-1"
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUnverify(rec._id)}
                                            className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 flex items-center gap-1"
                                        >
                                            <FaTimes /> Unverify
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditRecruiter(rec)}
                                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 flex items-center gap-1"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rec._id)}
                                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 flex items-center gap-1"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Edit Modal */}
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
