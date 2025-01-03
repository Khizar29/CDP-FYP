// src/components/NewsFeed/NewsFeed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]); // Initialize state as an empty array
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds?isPublic=true&limit=4`)
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setNewsItems(response.data.data); // Set data only if it's an array
        } else {
          console.error("Unexpected data format", response.data); // Log if unexpected format
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
    switch (category.toLowerCase()) {
      case 'event':
        return <EventIcon />;
      case 'announcement':
        return <AnnouncementIcon />;
      case 'news':
      default:
        return <ArticleIcon />;
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Box sx={{ width: '100%', padding: '2rem', borderRadius: '10px' }}>
      <Typography variant="h3" align="center" color="#000" gutterBottom>
        Latest <span className='text-yellow-500 font-bold'>News </span>
        and <span className='text-blue-400 font-bold'>Events</span>
      </Typography>
      <Grid container spacing={4}>
        {newsItems && Array.isArray(newsItems) && newsItems.length > 0 ? (
          newsItems.map((newsItem) => (
            <Grid item key={newsItem._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  maxWidth: 345,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 3,
                  borderRadius: 3,
                  border: '3px solid #41d4e5',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
                  overflow: 'hidden',
                }}
                onClick={() => openNewsDetail(newsItem._id)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={newsItem.image}
                  alt={newsItem.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={capitalize(newsItem.category)}
                      icon={getIcon(newsItem.category)}
                      sx={{
                        backgroundColor: '#50acff',
                        padding: 1,
                        color: '#fff', // Text color inside the Chip
                        fontWeight: 'bold',
                        '.MuiChip-icon': {
                          color: '#fff' // Icon color inside the Chip
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="h6" component="div" color="primary" gutterBottom>
                    {newsItem.title}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'gray' }} />
                    <Typography variant="body2" color="text.secondary">
                      Posted on {new Date(newsItem.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="#fff">
            No news items available or still loading...
          </Typography>
        )}
      </Grid>
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          onClick={() => navigate('/news')}
          sx={{
            backgroundColor: '#5b92e5',
            color: '#fff',
            borderRadius: 20,
            padding: '0.5rem 1.5rem',
            '&:hover': { backgroundColor: '#4b82d4' },
          }}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default NewsFeed;
