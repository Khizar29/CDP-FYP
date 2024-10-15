// src/components/admin/manage/Newsfeeds/ViewNews.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewNews = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/v1/newsfeeds/${id}`)
      .then(response => setNews(response.data.data))
      .catch(error => console.error('Error fetching news:', error));
  }, [id]);

  if (!news) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{news.title}</h2>
      <p><strong>Category:</strong> {news.category}</p>
      <p><strong>Description:</strong> {news.description}</p>
      <p><strong>Date:</strong> {new Date(news.date).toLocaleDateString()}</p>
      <button onClick={() => navigate('/admin/newsfeeds')} className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Back to List</button>
    </div>
  );
};

export default ViewNews;
