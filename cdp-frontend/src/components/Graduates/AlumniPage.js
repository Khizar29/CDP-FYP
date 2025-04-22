import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import AlumniCard from './AlumniCard';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import placeholder from '../../Images/placeholder.png';
import GradPic from '../../Images/SK__1166.JPG';

const AlumniPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [alumniData, setAlumniData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    filterYear: '',
    filterDiscipline: '',
  });
  const alumniPerPage = 12; // Set to 12 for user view
  const navigate = useNavigate();

  // Fetch graduates from the server based on filters and pagination
  const fetchAlumniData = async () => {
    try {
      setError(null);
      setLoading(true);

      // Make API call to fetch graduates with search, discipline, and year filters
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/graduates`, {
        params: {
          page: currentPage,
          limit: alumniPerPage,
          searchTerm: searchFilters.searchTerm,
          filterYear: searchFilters.filterYear,
          filterDiscipline: searchFilters.filterDiscipline,
        },
      });

      setAlumniData(response.data.data); // Populate alumni data
      setTotalPages(response.data.totalPages); // Set total pages
    } catch (error) {
      setError(error.message || 'Error fetching alumni data');
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetch when filters or pagination change
  useEffect(() => {
    fetchAlumniData();
  }, [currentPage, searchFilters]);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Handle card click
  const handleCardClick = (nuId) => {
    navigate(`/profile/${nuId}`); // Navigate to profile page
  };

  // Handle search input and filter changes from SearchBar
  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1); // Reset to page 1 when searching or filtering
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
      {/* Banner Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${GradPic})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: 200, sm: 250, md: 300 }, // Responsive height
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
        <Typography variant="h3" align="center" sx={{ position: 'relative', zIndex: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
          Graduates Directory
        </Typography>
      </Box>

      {/* Search Bar and Filters */}
      <Box sx={{ maxWidth: '100%', px: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      {/* Alumni Cards Grid */}
      <Grid container spacing={4} mt={2} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {alumniData.map((alumni) => (
          <Grid item key={alumni.nuId} xs={12} sm={6} md={4} lg={3}>
            <AlumniCard
              name={`${alumni.fullName}`}
              title={alumni.discipline}
              image={
                alumni.profilePic
                  ? alumni.profilePic
                  : `${placeholder}`
              }
              classOf={alumni.yearOfGraduation}
              onClick={() => handleCardClick(alumni.nuId)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination Component */}
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
