import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch news items from the backend
    axios.get('http://localhost:8000/api/v1/newsfeeds?isPublic=true')
      .then(response => {
        setNewsItems(response.data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the news items!", error);
      });
  }, []);

  const openNewsDetail = (newsId) => {
    // Navigate to the news details in the same tab
    navigate(`/news/${newsId}`);
  };

  return (
    <Box sx={{ width: '100%', padding: '2rem', backgroundColor: '#F8F8F8' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Latest News and Updates
      </Typography>
      <Grid container spacing={4}>
        {newsItems.map((newsItem) => (
          <Grid item key={newsItem._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'scale(1.03)' } }}
              onClick={() => openNewsDetail(newsItem._id)}
            >
              <CardMedia
                component="img"
                height="180"
                image={newsItem.image} // This should directly use the URL from the backend
                alt={newsItem.title}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {newsItem.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {newsItem.description.length > 100 
                    ? `${newsItem.description.substring(0, 100)}...` 
                    : newsItem.description
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography variant="body2" color="primary" onClick={() => navigate('/news')}>
          View All
        </Typography>
      </Box>
    </Box>
  );
};

export default NewsFeed;
