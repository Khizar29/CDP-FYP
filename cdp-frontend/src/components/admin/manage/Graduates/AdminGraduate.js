import React, { useState, useEffect } from 'react';
import GraduateTable from './GraduateTable';
import AddGraduate from './AddGraduate';
import axios from 'axios';

const AdminGraduates = () => {
    const [showModal, setShowModal] = useState(false);
    const [errorLogs, setErrorLogs] = useState([]);
    const [graduates, setGraduates] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state

    const fetchGraduates = async () => {
        setLoading(true); // Set loading to true while fetching data
        try {
            const token = localStorage.getItem('accessToken'); // Ensure token is present
            const response = await axios.get('http://localhost:8000/api/v1/graduates', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGraduates(response.data.data);
            setLoading(false); // Set loading to false after fetching data
        } catch (error) {
            console.error("Error fetching graduates", error.response ? error.response.data : error.message);
            setLoading(false); // Set loading to false in case of an error
        }
    };

    useEffect(() => {
        fetchGraduates();
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleHideModal = () => setShowModal(false);

    // Function to handle errors and display them
    const handleErrors = (errors) => {
        setErrorLogs(errors);
    };

    // Function to refresh the graduate list after successful import
    const handleRefresh = () => {
        fetchGraduates(); // Re-fetch the data to update the UI
    };

    return (
        <div className="p-6">
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

            {/* Display error logs if any */}
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

            {/* Show loading indicator while fetching data */}
            {loading ? (
                <div className="text-center py-4">Loading graduates...</div>
            ) : (
                <GraduateTable graduates={graduates} />
            )}
        </div>
    );
};

export default AdminGraduates;
