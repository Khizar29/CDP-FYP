// src/components/NewsFeed/NewsDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify'; // Import DOMPurify
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds/${id}`)
      .then(response => {
        setNewsItem(response.data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the news details!", error);
      });

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds?isPublic=true`)
      .then(response => {
        setNewsList(response.data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the news list!", error);
      });
  }, [id]);

  if (!newsItem) return <Typography>Loading...</Typography>;

  const currentIndex = newsList.findIndex(item => item._id === id);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/news/${newsList[currentIndex - 1]._id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < newsList.length - 1) {
      navigate(`/news/${newsList[currentIndex + 1]._id}`);
    }
  };

  // Sanitize the description content
  const sanitizedDescription = DOMPurify.sanitize(newsItem.description);

  return (
    <Box sx={{ 
      padding: '2rem', 
      maxWidth: { xs: '95%', sm: '90%', md: '80%', lg: '70%' }, 
      margin: '0 auto',
      transition: 'max-width 0.3s ease-in-out' 
    }}>
      <Paper elevation={3} sx={{ 
        padding: '2rem', 
        borderRadius: '12px', 
        backgroundColor: '#f7f9fc', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
      }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            color: '#1e88e5', 
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            marginBottom: '1.5rem',
            fontSize: { xs: '2rem', md: '2.5rem' } 
          }}
        >
          {newsItem.title}
        </Typography>
        
        <Box sx={{ 
          width: '100%', 
          maxHeight: '500px', 
          overflow: 'hidden', 
          borderRadius: '12px', 
          marginBottom: '1.5rem' 
        }}>
          <img 
            src={newsItem.image} 
            alt={newsItem.title} 
            style={{ 
              width: '100%', 
              height: 'auto', 
              objectFit: 'contain' 
            }} 
          />
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.8', 
            color: '#333', 
            fontFamily: 'Arial, sans-serif', 
            textAlign: 'justify'
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }} // Render sanitized HTML
        />
        
        <Typography 
          variant="caption" 
          display="block" 
          sx={{ 
            textAlign: 'right', 
            color: '#888', 
            fontStyle: 'italic', 
            marginTop: '1rem',
            fontSize: '0.9rem'
          }}
        >
          Published on: {new Date(newsItem.date).toLocaleDateString()}
        </Typography>

        <Grid container spacing={2} justifyContent="center" mt={4}>
          <Grid item xs={12} sm={4}>
            <Button 
              onClick={() => navigate('/news')}
              variant="outlined"
              color="primary"
              fullWidth
            >
              Back to Newsfeed
            </Button>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Button 
              onClick={handlePrevious} 
              variant="contained" 
              color="primary" 
              disabled={currentIndex === 0}
              fullWidth
            >
              Previous
            </Button>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Button 
              onClick={handleNext} 
              variant="contained" 
              color="primary" 
              disabled={currentIndex === newsList.length - 1}
              fullWidth
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default NewsDetail;
