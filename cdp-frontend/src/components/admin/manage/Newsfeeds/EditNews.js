import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditNews = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    image: null,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/v1/newsfeeds/${id}`)
      .then(response => {
        const { title, category, description, date } = response.data.data;
        setFormData({ title, category, description, date, image: null });
      })
      .catch(error => {
        console.error('Error fetching news item:', error);
        setError('Failed to load news details');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Authorization token is missing. Please log in again.');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('date', formData.date);
      if (formData.image) data.append('image', formData.image);

      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds/${id}`, data, config);
      navigate('/admin/newsfeeds');
    } catch (error) {
      console.error('Error updating news:', error);
      setError(`Error updating news: ${error.response?.data?.message || error.message}`);
    }
  };

  const toolbarOptions = [
    [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'image', 'video'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ];

  return (
    <div className="container mx-auto p-8">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Edit News/Event</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">{error}</div>}

        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
          <select
            id="category"
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

        <div className="mb-12">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            className="bg-white"
            modules={{ toolbar: toolbarOptions }}
            style={{ height: '250px', marginBottom: '30px' }} // Adjust margin-bottom here
          />
        </div>

        <div className="mb-6 pt-10"> {/* Increase top margin to prevent overlap */}
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date.split('T')[0]}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
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
            Save Changes
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

export default EditNews;
