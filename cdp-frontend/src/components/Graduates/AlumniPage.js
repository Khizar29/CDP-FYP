// src/components/AlumniPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid, Box } from '@mui/material';
import SearchBar from './SearchBar';
import AlumniCard from './AlumniCard';
import Pagination from './Pagination';

const alumniData = [
  { id: 1, name: 'Mohammad Ahsan', title: 'BSc Social Development & Policy', image: 'https://via.placeholder.com/150', classOf: 2018 },
  { id: 2, name: 'Syed Ahsan Ahmed', title: 'BS Computer Science', image: 'https://via.placeholder.com/150', classOf: 2020 },
  { id: 3, name: 'Ali Raza', title: 'BBA', image: 'https://via.placeholder.com/150', classOf: 2019 },
  { id: 4, name: 'Fatima Zahra', title: 'BS Accounting', image: 'https://via.placeholder.com/150', classOf: 2021 },
  { id: 5, name: 'Usman Tariq', title: 'BS Computer Engineering', image: 'https://via.placeholder.com/150', classOf: 2017 },
  { id: 6, name: 'Sara Khan', title: 'BSc Psychology', image: 'https://via.placeholder.com/150', classOf: 2016 },
  { id: 7, name: 'Ahmed Ali', title: 'BS Civil Engineering', image: 'https://via.placeholder.com/150', classOf: 2020 },
  { id: 8, name: 'Zainab Fatima', title: 'BS Chemical Engineering', image: 'https://via.placeholder.com/150', classOf: 2018 },
  { id: 9, name: 'Hassan Raza', title: 'BS Mechanical Engineering', image: 'https://via.placeholder.com/150', classOf: 2019 },
  { id: 10, name: 'Ayesha Siddiqui', title: 'BBA Marketing', image: 'https://via.placeholder.com/150', classOf: 2021 },
  { id: 11, name: 'Muhammad Ali', title: 'BSc Mathematics', image: 'https://via.placeholder.com/150', classOf: 2020 },
  { id: 12, name: 'Mariam Nawaz', title: 'BS Physics', image: 'https://via.placeholder.com/150', classOf: 2017 },
  // Add more alumni data items here if needed
];

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const AlumniPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [alumniPerPage] = useState(10); // 2 rows * 5 cards per row
  const [shuffledData, setShuffledData] = useState([]);

  useEffect(() => {
    // Shuffle the data and limit to 50 entries for 5 pages
    const shuffled = shuffleArray(alumniData).slice(0, 50);
    setShuffledData(shuffled);
  }, []);

  // Pagination logic
  const indexOfLastAlumni = currentPage * alumniPerPage;
  const indexOfFirstAlumni = indexOfLastAlumni - alumniPerPage;
  const currentAlumni = shuffledData.slice(indexOfFirstAlumni, indexOfLastAlumni);
  const totalPages = 5; // Fixed at 5 pages

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Box
      sx={{
        width: '100%', // Full width of the screen
        padding: 0,
        margin: 0,
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundImage: 'url(https://via.placeholder.com/1500x500)', // Replace with your banner image
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
          <Grid item key={alumni.id} xs={12} sm={6} md={2.4}>
            <AlumniCard
              name={alumni.name}
              title={alumni.title}
              image={alumni.image}
              classOf={alumni.classOf}
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
