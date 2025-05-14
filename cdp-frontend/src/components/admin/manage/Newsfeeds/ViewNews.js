// src/components/admin/manage/Newsfeeds/ViewNews.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewsDetail from '../../../Newsfeeds/NewsDetail';

const ViewNews = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col mx-auto items-center">
      {/* Render the NewsDetail component for admin view */}
      <NewsDetail isAdminView={true} />
    </div>
  );
};

export default ViewNews;