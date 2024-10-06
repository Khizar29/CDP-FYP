import React from 'react';
import GraduateRow from './GraduateRow';

const GraduateTable = ({ graduates, onDelete }) => { // Added onDelete prop
    return (
        <div className="flex justify-center mt-8"> {/* Flex container to center horizontally */}
            <div className="w-full max-w-6xl"> {/* Limit the maximum width of the table */}
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
                                    onDelete={onDelete} // Pass the onDelete function to GraduateRow
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
        </div>
    );
};

export default GraduateTable;
