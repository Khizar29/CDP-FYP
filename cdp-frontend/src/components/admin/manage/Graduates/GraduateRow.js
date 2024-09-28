import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GraduateRow = ({ index, graduate, onDelete }) => {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            await axios.delete(`http://localhost:8000/api/v1/graduates/${graduate.nuId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Graduate deleted successfully');
            onDelete(graduate.nuId); // Call the onDelete function to update the parent state
        } catch (error) {
            console.error("Error deleting graduate", error);
            alert(`Failed to delete graduate: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    return (
        <tr>
            <td className="py-2 px-4 border-b text-center">{index}</td>
            <td className="py-2 px-4 border-b">{graduate.firstName} {graduate.lastName}</td>
            <td className="py-2 px-4 border-b">{graduate.nuId}</td>
            <td className="py-2 px-4 border-b">{graduate.discipline}</td>
            <td className="py-2 px-4 border-b text-center">{graduate.yearOfGraduation}</td>
            <td className="py-2 px-4 border-b text-center">
                <Link to={`/admin/graduates/view/${graduate.nuId}`} className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition duration-300 mr-2">View</Link>
                <Link to={`/admin/graduates/edit/${graduate.nuId}`} className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition duration-300 mr-2">Edit</Link>
                <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition duration-300">Delete</button>
            </td>
        </tr>
    );
};

export default GraduateRow;
