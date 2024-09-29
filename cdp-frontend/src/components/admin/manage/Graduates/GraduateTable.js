import React, { useEffect, useState } from 'react';
import GraduateRow from './GraduateRow';
import axios from 'axios';

const GraduateTable = () => {
    const [graduates, setGraduates] = useState([]);

    const fetchGraduates = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // Ensure token is present
            const response = await axios.get('http://localhost:8000/api/v1/graduates', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGraduates(response.data.data);
        } catch (error) {
            console.error("Error fetching graduates", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchGraduates();
    }, []);

    // Function to handle deletion of a graduate and update the state
    const handleDelete = (nuId) => {
        setGraduates(graduates.filter(graduate => graduate.nuId !== nuId));
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600">#</th>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600">Full Name</th>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600">NU ID</th>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600">Discipline</th>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600">Year of Graduation</th>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {graduates.length > 0 ? (
                        graduates.map((graduate, index) => (
                            <GraduateRow
                                key={graduate.nuId}
                                index={index + 1}
                                graduate={graduate}
                                onDelete={handleDelete} // Pass the handleDelete function
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                No graduates found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GraduateTable;
