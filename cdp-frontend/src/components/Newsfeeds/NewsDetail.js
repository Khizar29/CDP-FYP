// src/components/NewsFeed/NewsDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);

  useEffect(() => {
    // Fetch a single news item based on ID
    axios.get(`http://localhost:8000/api/v1/newsfeeds/${id}`)
      .then(response => {
        setNewsItem(response.data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the news details!", error);
      });
  }, [id]);

  if (!newsItem) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h3" gutterBottom>{newsItem.title}</Typography>
      {/* Make sure the image src is set correctly */}
      <img 
        src={newsItem.image} // Use the image URL directly
        alt={newsItem.title} 
        style={{ width: '20%', height: 'auto', marginBottom: '2rem' }} 
      />
      <Typography variant="body1">{newsItem.description}</Typography>
      <Typography variant="caption" color="text.secondary" display="block" mt={2}>
        Published on: {new Date(newsItem.date).toLocaleDateString()}
      </Typography>
    </Box>
  );
};

export default NewsDetail;
