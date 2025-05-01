
// src/components/NewsFeed/NewsFeed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EventIcon from '@mui/icons-material/Event';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds?isPublic=true&limit=4`)
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setNewsItems(response.data.data);
        } else {
          console.error("Unexpected data format", response.data);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the news items!", error);
      });
  }, []);

  const openNewsDetail = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  const getIcon = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'event':
        return <EventIcon />;
      case 'announcement':
        return <AnnouncementIcon />;
      case 'news':
      default:
        return <ArticleIcon />;
    }
  };

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #cfe9f9, #f1f9ff)',
        borderRadius: '20px',
      }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#1e40af',
            mb: 6,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Latest <span style={{ color: '#f59e0b' }}>News</span> & <span style={{ color: '#3b82f6' }}>Events</span>
        </Typography>
      </motion.div>

      {/* News Grid */}
      <Grid container spacing={6}>
        {newsItems && newsItems.length > 0 ? (
          newsItems.map((newsItem, index) => (
            <Grid item key={newsItem._id} xs={12} sm={6} md={4} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 6,
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 10,
                    },
                  }}
                  onClick={() => openNewsDetail(newsItem._id)}
                >
                  {/* Upgraded Image */}
                  <CardMedia
                    component="img"
                    image={newsItem.image}
                    alt={newsItem.title}
                    sx={{
                      width: '100%',
                      height: 220,
                      objectFit: 'cover',
                      borderBottom: '1px solid #eee',
                    }}
                  />

                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', padding: 3 }}>
                    {/* Category Chip */}
                    {newsItem.category && (
                      <Chip
                        label={capitalize(newsItem.category)}
                        icon={getIcon(newsItem.category)}
                        sx={{
                          backgroundColor: '#3b82f6',
                          color: '#fff',
                          fontWeight: 'bold',
                          mb: 2,
                          borderRadius: '10px',
                          '.MuiChip-icon': { color: '#fff' },
                        }}
                      />
                    )}

                    {/* Title */}
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ color: '#1e3a8a', fontWeight: 'bold', mb: 1 }}
                    >
                      {newsItem.title}
                    </Typography>

                    {/* Date */}
                    <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'gray' }} />
                      <Typography variant="body2" color="text.secondary">
                        Posted on {new Date(newsItem.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ width: '100%' }}>
            No news items available or still loading...
          </Typography>
        )}
      </Grid>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Box display="flex" justifyContent="center" mt={6}>
          <Button
            variant="contained"
            onClick={() => navigate('/news')}
            sx={{
              backgroundColor: '#2563eb',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              padding: '0.75rem 2rem',
              borderRadius: '30px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            View All News
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default NewsFeed;
