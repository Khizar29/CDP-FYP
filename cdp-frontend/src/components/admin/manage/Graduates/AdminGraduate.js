import React, { useState, useEffect, useContext} from 'react';
import GraduateTable from './GraduateTable';
import AddGraduate from './AddGraduate';
import axios from 'axios';
import Pagination from './Pagination';
import { UserContext } from '../../../../contexts/UserContext';

const AdminGraduates = () => {
    const [showModal, setShowModal] = useState(false);
    const [errorLogs, setErrorLogs] = useState([]);
    const [graduates, setGraduates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterDiscipline, setFilterDiscipline] = useState('');
    const graduatesPerPage = 10;

    const { user } = useContext(UserContext);

    const fetchGraduates = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates`, {
                      headers: {
          Authorization: `Bearer ${token}`,
        },
                params: {
                    page,
                    limit: graduatesPerPage,
                    searchTerm,
                    filterYear,
                    filterDiscipline,
                },
            });
            setGraduates(response.data.data);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching graduates:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraduates(currentPage);
    }, [currentPage, searchTerm, filterYear, filterDiscipline]);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleShowModal = () => setShowModal(true);
    const handleHideModal = () => setShowModal(false);

    return (
        <div className="p-6 mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-900">Manage Graduates</h1>
                <button onClick={handleShowModal} className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                    Import Graduates
                </button>
            </div>

            {/* Add Graduate Search and Filters */}
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Search by Name or NU ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                    <option value="">Select Year of Graduation</option>
                    {/* Add year options */}
                    {Array.from({ length: 6 }, (_, i) => (
                        <option key={i} value={2020 + i}>{2020 + i}</option>
                    ))}
                </select>
                <select
                    value={filterDiscipline}
                    onChange={(e) => setFilterDiscipline(e.target.value)}
                    className="py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                    <option value="">Select Discipline</option>
                    {/* Populate this with discipline options */}
                    <option value="BS(CS)">Computer Science</option>
                    <option value="BS(AI and Data Science)">Artificial Intelligence</option>
                    <option value="BS(AI and Data Science)">Data Science</option>
                    <option value="BS(SE)">Software Engineering</option>
                    <option value="BS(CY)">Cyber Security</option>
                    <option value="BS(EE)">Electrical Engineering</option>
                    <option value="Business Analytics">Business Analytics</option>
                    <option value="Financial Technology">Financial Technology</option>
                    {/* Add more disciplines as needed */}
                </select>
            </div>

            <AddGraduate show={showModal} onClose={handleHideModal} onRefresh={() => fetchGraduates(currentPage)} />

            {errorLogs.length > 0 && (
                <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                    <h2 className="font-bold mb-2">Import Errors:</h2>
                    <ul>{errorLogs.map((error, index) => <li key={index}>{error}</li>)}</ul>
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">Loading graduates...</div>
            ) : (
                <>
                    <GraduateTable graduates={graduates} onDelete={(nuId) => setGraduates(graduates.filter(grad => grad.nuId !== nuId))} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default AdminGraduates;
