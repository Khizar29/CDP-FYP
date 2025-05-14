// src/components/NewsFeed/NewsDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CardMedia
} from '@mui/material';
import { motion } from 'framer-motion';

const NewsDetail = ({ isAdminView = false }) => {
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

  if (!newsItem) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" color="primary">Loading news...</Typography>
      </Box>
    );
  }

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

  const sanitizedDescription = DOMPurify.sanitize(newsItem.description);

  return (
    <Box
      sx={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #f1f9ff 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '900px' }}
      >
        <Paper elevation={6} sx={{ padding: '3rem', borderRadius: '24px', backgroundColor: '#ffffff' }}>
          {/* Title */}
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#1e3a8a',
              mb: 4,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: 'Georgia, serif',
            }}
          >
            {newsItem.title}
          </Typography>

          {/* IMAGE */}
          <Box
            sx={{
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 4,
              mb: 4,
            }}
          >
            <CardMedia
              component="img"
              image={newsItem.image}
              alt={newsItem.title}
              sx={{
                width: '100%',
                height: { xs: 240, sm: 320, md: 400 },
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* DESCRIPTION */}
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#333',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'justify',
              mb: 3
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

          {/* DATE */}
          <Typography
            variant="caption"
            display="block"
            sx={{
              textAlign: 'right',
              color: '#888',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              mb: 4
            }}
          >
            Published on: {new Date(newsItem.date).toLocaleDateString()}
          </Typography>

          {/* NAVIGATION BUTTONS */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button
                onClick={() => navigate(isAdminView ? '/admin/newsfeeds' : '/news')}
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                }}
              >
                Back to {isAdminView ? 'Admin List' : 'Newsfeed'}
              </Button>
            </Grid>

            {!isAdminView && (
              <>
                <Grid item xs={6} sm={4}>
                  <Button
                    onClick={handlePrevious}
                    variant="contained"
                    color="primary"
                    disabled={currentIndex === 0}
                    fullWidth
                    sx={{
                      fontWeight: 'bold',
                      borderRadius: '30px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                    }}
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
                    sx={{
                      fontWeight: 'bold',
                      borderRadius: '30px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                    }}
                  >
                    Next
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default NewsDetail;