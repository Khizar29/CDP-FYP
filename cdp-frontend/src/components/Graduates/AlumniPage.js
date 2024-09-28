// src/components/Graduates/AlumniPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import AlumniCard from './AlumniCard';
import Pagination from './Pagination';
import SearchBar from '../SearchBar';

const AlumniPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [alumniData, setAlumniData] = useState([]); // Initialize as an empty array
  const [totalPages, setTotalPages] = useState(1);
  const [alumniPerPage] = useState(10); // Number of cards per page
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        setError(null);
        setLoading(true);

        // Fetch data from the backend API
        const response = await axios.get('http://localhost:8000/api/v1/graduates');

        if (response.data && Array.isArray(response.data.data)) {
          setAlumniData(response.data.data); // Access the 'data' field in response
          setTotalPages(Math.ceil(response.data.data.length / alumniPerPage)); // Calculate total pages
        } else {
          throw new Error('Unexpected response format from server');
        }
      } catch (error) {
        setError(error.message || 'Error fetching alumni data');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, []);

  // Pagination logic
  const indexOfLastAlumni = currentPage * alumniPerPage;
  const indexOfFirstAlumni = indexOfLastAlumni - alumniPerPage;
  const currentAlumni = alumniData.slice(indexOfFirstAlumni, indexOfLastAlumni);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Handle card click
  const handleCardClick = (nuId) => {
    navigate(`/profile/${nuId}`); // Navigate to profile page
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', padding: 0, margin: 0, overflowX: 'hidden' }}>
      <Box
        sx={{
          position: 'relative',
          backgroundImage: 'url(https://via.placeholder.com/1500x500)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 300,
          borderRadius: 0,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          },
        }}
      >
        <Typography variant="h2" align="center" sx={{ position: 'relative', zIndex: 2 }}>
          Graduates Directory
        </Typography>
      </Box>
      <Box sx={{ maxWidth: '100%', px: 3 }}>
        <SearchBar onSearch={() => {}} /> {/* Implement search as needed */}
      </Box>
      <Box sx={{ mt: 4, mb: 2, px: 3 }}>
        <Typography variant="h6" component="div" sx={{ textAlign: 'center', color: 'gray' }}>
          Alumni Showcase
        </Typography>
      </Box>
      <Grid container spacing={4} mt={2} sx={{ px: 3 }}>
        {currentAlumni.map((alumni) => (
          <Grid item key={alumni.nuId} xs={12} sm={6} md={2.4}>
            <AlumniCard
              name={`${alumni.firstName} ${alumni.lastName}`}
              title={alumni.discipline}
              image={alumni.profilePic || 'https://via.placeholder.com/150'}
              classOf={alumni.yearOfGraduation}
              onClick={() => handleCardClick(alumni.nuId)}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default AlumniPage;
