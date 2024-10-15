// src/components/admin/manage/Newsfeeds/AddNews.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddNews = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    image: null,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message before submission

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Authorization token is missing. Please log in again.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('date', formData.date);
      if (formData.image) data.append('image', formData.image);

      await axios.post('http://localhost:8000/api/v1/newsfeeds', data, config);
      navigate('/admin/newsfeeds');
    } catch (err) {
      setError(`Error saving news: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Add News/Event</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">{error}</div>}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Category</option>
            <option value="news">News</option>
            <option value="event">Event</option>
            <option value="announcement">Announcement</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows="4"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
            accept="image/*"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-900 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/newsfeeds')}
            className="bg-gray-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-gray-500 transition duration-200"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNews;
