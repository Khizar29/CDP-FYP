import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../Graduates/Pagination';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const AdminNewsfeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = () => {
    const token = localStorage.getItem("accessToken");
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds?isPublic=true&page=${currentPage}&limit=${itemsPerPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setNewsItems(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      })
      .catch(error => console.error('Error fetching news items:', error));
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this news/event?");
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewsItems(newsItems.filter(news => news._id !== id));
      alert('News/Event Deleted Successfully');
    } catch (error) {
      console.error('Error deleting news/event:', error.response?.data || error.message);
      alert(`Error deleting news/event: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 md:mb-0">Manage News and Events</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate('/admin/newsfeeds/add')}
              className="w-full md:w-auto inline-flex items-center justify-center bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              <FaPlus className="mr-2" /> New
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md mb-6">
            <thead>
              <tr>
                <th className="py-2 px-3 text-center bg-blue-100 border-b">#</th>
                <th className="py-2 px-3 text-left bg-blue-100 border-b">Title</th>
                <th className="py-2 px-3 text-left bg-blue-100 border-b">Category</th>
                <th className="py-2 px-3 text-left bg-blue-100 border-b">Date</th>
                <th className="py-2 px-3 text-center bg-blue-100 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsItems.length > 0 ? (
                newsItems.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-100 transition duration-300">
                    <td className="py-2 px-3 text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td className="py-2 px-3">{item.title}</td>
                    <td className="py-2 px-3">{item.category}</td>
                    <td className="py-2 px-3">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-2 px-3 text-center flex flex-col md:flex-row justify-center items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/newsfeeds/view/${item._id}`)}
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/newsfeeds/edit/${item._id}`)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">No News or Events Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};

export default AdminNewsfeed;