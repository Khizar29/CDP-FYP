// src/components/admin/manage/Newsfeeds/ViewNews.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewsDetail from '../Newsfeeds/NewsDetail';
const FacultyViewNews = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col mx-auto items-center">
      {/* Render the NewsDetail component for admin view */}
      <NewsDetail />
      
      {/* Container to center the button */}
      <div className="flex justify-center mt-6">
        <button 
          onClick={() => navigate('/faculty/newsfeed')}
          className="bg-blue-500 text-white py-2 px-6 rounded"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default FacultyViewNews;
