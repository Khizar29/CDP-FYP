import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import EditFaculty from "./EditFaculty";
import Pagination from "../Graduates/Pagination";

const AdminFaculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [editFaculty, setEditFaculty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFaculty, setSelectedFaculty] = useState([]);
    const limit = 10;

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
            console.error("Error fetching faculty:", error);
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

    const filteredFaculty = faculty.filter(fac => {
        if (filterStatus === "verified") return fac.isVerified;
        if (filterStatus === "pending") return !fac.isVerified;
        return true;
    }).filter(fac =>
        fac.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fac.nuEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBulkAction = async (actionType) => {
        try {
            if (selectedFaculty.length === 0) return;

            let confirmationMessage = "";
            switch (actionType) {
                case "approve":
                    confirmationMessage = "Approve selected faculty?";
                    break;
                case "unverify":
                    confirmationMessage = "Unverify selected faculty?";
                    break;
                case "delete":
                    confirmationMessage = "Delete selected faculty?";
                    break;
                default:
                    return;
            }

            if (!window.confirm(confirmationMessage)) return;

            const requests = selectedFaculty.map(id => {
                switch (actionType) {
                    case "approve":
                        return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty/verify/${id}`, {}, { withCredentials: true });
                    case "unverify":
                        return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty/unverify/${id}`, {}, { withCredentials: true });
                    case "delete":
                        return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faculty/${id}`, { withCredentials: true });
                    default:
                        return null;
                }
            });

            await Promise.all(requests);
            setSelectedFaculty([]);
            fetchFaculty(currentPage);
        } catch (error) {
            console.error("Bulk action error:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Manage Faculty</h2>

            {/* Filters, Bulk Actions, Search */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search by Name or Email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900 min-w-[200px]"
                />

                {selectedFaculty.length > 0 && (
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

            {/* Faculty Table */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-3 bg-blue-100 border-b text-center">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedFaculty(filteredFaculty.map(f => f._id));
                                        } else {
                                            setSelectedFaculty([]);
                                        }
                                    }}
                                    checked={
                                        selectedFaculty.length === filteredFaculty.length &&
                                        filteredFaculty.length > 0
                                    }
                                />
                            </th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">#</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Name</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Email</th>
                            <th className="py-2 px-3 text-left bg-blue-100 border-b">Department</th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">Status</th>
                            <th className="py-2 px-3 text-center bg-blue-100 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFaculty.map((fac, index) => (
                            <tr key={fac._id} className="border-b hover:bg-gray-100 transition duration-300">
                                <td className="py-2 px-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedFaculty.includes(fac._id)}
                                        onChange={() => {
                                            if (selectedFaculty.includes(fac._id)) {
                                                setSelectedFaculty(selectedFaculty.filter(id => id !== fac._id));
                                            } else {
                                                setSelectedFaculty([...selectedFaculty, fac._id]);
                                            }
                                        }}
                                    />
                                </td>
                                <td className="py-2 px-3 text-center">{(currentPage - 1) * limit + index + 1}</td>
                                <td className="py-2 px-3">{fac.fullName}</td>
                                <td className="py-2 px-3">{fac.nuEmail}</td>
                                <td className="py-2 px-3">{fac.department}</td>
                                <td className="py-2 px-3 text-center">{fac.isVerified ? "✅ Verified" : "❌ Pending"}</td>
                                <td className="py-2 px-3 flex justify-center gap-2">
                                    {!fac.isVerified ? (
                                        <button
                                            onClick={() => handleVerify(fac._id)}
                                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 flex items-center gap-1"
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUnverify(fac._id)}
                                            className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 flex items-center gap-1"
                                        >
                                            <FaTimes /> Unverify
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditFaculty(fac)}
                                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 flex items-center gap-1"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(fac._id)}
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
            {editFaculty && (
                <EditFaculty
                    faculty={editFaculty}
                    onClose={() => setEditFaculty(null)}
                    refresh={() => fetchFaculty(currentPage)}
                />
            )}
        </div>
    );
};

export default AdminFaculty;
