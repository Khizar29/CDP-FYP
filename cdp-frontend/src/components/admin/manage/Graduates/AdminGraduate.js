import React, { useState, useEffect } from 'react';
import GraduateTable from './GraduateTable';
import AddGraduate from './AddGraduate';
import axios from 'axios';
import Pagination from './Pagination'; // Import Pagination component

const AdminGraduates = () => {
    const [showModal, setShowModal] = useState(false);
    const [errorLogs, setErrorLogs] = useState([]);
    const [graduates, setGraduates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const graduatesPerPage = 10; // Set how many graduates to show per page

    const fetchGraduates = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8000/api/v1/graduates', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: page,
                    limit: graduatesPerPage, // Limit results per page
                },
            });
            setGraduates(response.data.data); // Update graduates state
            setTotalPages(response.data.totalPages); // Set total pages
            setLoading(false);
        } catch (error) {
            console.error('Error fetching graduates:', error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    const handleDelete = (nuId) => {
        // Update graduates state after deletion
        setGraduates(graduates.filter(graduate => graduate.nuId !== nuId));
    };

    useEffect(() => {
        fetchGraduates(currentPage); // Fetch graduates when page changes
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Change page when user clicks pagination
    };

    const handleShowModal = () => setShowModal(true);
    const handleHideModal = () => setShowModal(false);

    const handleErrors = (errors) => setErrorLogs(errors);
    const handleRefresh = () => fetchGraduates(currentPage); // Refresh graduates

    return (
        <div className="p-6 mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-900">Manage Graduates</h1>
                <button
                    onClick={handleShowModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition duration-300"
                >
                    Import Graduates
                </button>
            </div>
            
            <AddGraduate show={showModal} onClose={handleHideModal} onErrors={handleErrors} onRefresh={handleRefresh} />

            {errorLogs.length > 0 && (
                <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                    <h2 className="font-bold mb-2">Import Errors:</h2>
                    <ul>
                        {errorLogs.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">Loading graduates...</div>
            ) : (
                <>
                    <GraduateTable graduates={graduates} onDelete={handleDelete} /> {/* Pass onDelete to GraduateTable */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default AdminGraduates;
