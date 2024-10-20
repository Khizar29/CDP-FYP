// src/components/PaginatedNewsFeed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaginatedNewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9; // Limit for user view
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/newsfeeds?isPublic=true&page=${page}&limit=${itemsPerPage}`)
      .then(response => {
        setNewsItems(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      })
      .catch(error => {
        console.error("There was an error fetching the news items!", error);
      });
  }, [page]);

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#F8F8F8' }}>
      <Typography variant="h3" align="center" color="primary" gutterBottom>
        Latest News and Updates
      </Typography>
      <Grid container spacing={4}>
        {newsItems.map((newsItem) => (
          <Grid item key={newsItem._id} xs={12} sm={6} md={4}>
            <Card
              sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'scale(1.03)' } }}
              onClick={() => navigate(`/news/${newsItem._id}`)}
            >
              <CardMedia
                component="img"
                height="140"
                image={newsItem.image}
                alt={newsItem.title}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {newsItem.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default PaginatedNewsFeed;
