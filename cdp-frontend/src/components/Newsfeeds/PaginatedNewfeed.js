
// src/components/PaginatedNewsFeed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Pagination, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ArticleIcon from '@mui/icons-material/Article';

const PaginatedNewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
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

  const getCategoryIcon = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'event':
        return <EventIcon fontSize="small" />;
      case 'announcement':
        return <AnnouncementIcon fontSize="small" />;
      case 'news':
      default:
        return <ArticleIcon fontSize="small" />;
    }
  };

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #f1f9ff 100%)',
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
            mb: 8,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Latest <span style={{ color: '#f59e0b' }}>News</span> & <span style={{ color: '#3b82f6' }}>Events</span>
        </Typography>
      </motion.div>

      {/* News Grid */}
      <Grid container spacing={6}>
        {newsItems.map((newsItem, index) => (
          <Grid item xs={12} sm={6} md={4} key={newsItem._id}>
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
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: 6,
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 10,
                  },
                }}
                onClick={() => navigate(`/news/${newsItem._id}`)}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={newsItem.image}
                  alt={newsItem.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 3 }}>
                  {/* Category Chip */}
                  {newsItem.category && (
                    <Chip
                      icon={getCategoryIcon(newsItem.category)}
                      label={capitalize(newsItem.category)}
                      sx={{
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        mb: 2,
                        fontWeight: 'bold',
                        borderRadius: '10px',
                      }}
                    />
                  )}
                  {/* Title */}
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 'bold', color: '#1e3a8a', mb: 1 }}
                  >
                    {newsItem.title}
                  </Typography>

                  {/* Date */}
                  <Box display="flex" alignItems="center" mt={1}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                    <Typography variant="body2" color="text.secondary">
                      Posted on {new Date(newsItem.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Box display="flex" justifyContent="center" mt={8}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default PaginatedNewsFeed;
