import React, { useState } from 'react';
import axios from 'axios';

const AddGraduate = ({ show, onClose, onErrors, onRefresh }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state for import process

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = async () => {
        if (!file) return;
        
        setLoading(true); // Set loading to true while importing
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('accessToken'); // Get the token from localStorage
            const response = await axios.post('http://localhost:8000/api/v1/graduates/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` // Add the authorization header
                }
            });

            // Check if there were any errors returned by the server
            if (response.data.errors) {
                onErrors(response.data.errors);
            } else {
                // Display a more detailed success message
                const message = `Graduates imported successfully. ${response.data.message}`;
                alert(message);
                onRefresh(); // Call the refresh function to update the table
            }
            onClose();
        } catch (error) {
            console.error("Error importing graduates", error);
            const message = error.response && error.response.data ? error.response.data.message : error.message;
            onErrors([message]);
        } finally {
            setLoading(false); // Set loading to false after import process
        }
    };

    return show ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Import Graduates</h2>
                <input type="file" onChange={handleFileChange} accept=".xlsx,.xls" className="mb-4" />
                <div className="flex justify-end">
                    <button
                        onClick={handleImport}
                        className={`bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition duration-300 mr-2 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? 'Importing...' : 'Import'}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition duration-300"
                        disabled={loading} // Disable the button while loading
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default AddGraduate;
