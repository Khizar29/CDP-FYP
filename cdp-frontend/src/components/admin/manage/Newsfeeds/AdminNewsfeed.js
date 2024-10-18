// src/components/admin/manage/Newsfeeds/AdminNewsfeed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../Graduates/Pagination';
import { useNavigate } from 'react-router-dom';

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
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds?isPublic=true&page=${currentPage}&limit=${itemsPerPage}`)
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
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds/${id}`, config);
      setNewsItems(newsItems.filter(news => news._id !== id));
      alert('News/Event Deleted Successfully');
    } catch (error) {
      console.error('Error deleting news/event:', error.response?.data || error.message);
      alert(`Error deleting news/event: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage News and Events</h2>
      <button onClick={() => navigate('/admin/newsfeeds/add')} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">Add News/Event</button>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsItems.map((item, index) => (
            <tr key={item._id}>
              <td className="px-4 py-2 border">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td className="px-4 py-2 border">{item.title}</td>
              <td className="px-4 py-2 border">{item.category}</td>
              <td className="px-4 py-2 border">{new Date(item.date).toLocaleDateString()}</td>
              <td className="px-4 py-2 border flex gap-2">
                <button onClick={() => navigate(`/admin/newsfeeds/view/${item._id}`)} className="bg-blue-500 text-white px-2 py-1 rounded">View</button>
                <button onClick={() => navigate(`/admin/newsfeeds/edit/${item._id}`)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default AdminNewsfeed;
