// src/components/Graduates/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid } from '@mui/material';

const ProfilePage = () => {
  const { id } = useParams(); // Get the nuId from the URL
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch alumni details from the backend using ID
    const fetchAlumniDetails = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/v1/graduates/${id}`);
        setAlumni(response.data.data); // Access the data field directly
      } catch (error) {
        setError(error.message || 'Error fetching alumni details');
      } finally {
        setLoading(false);
      }
    };
    fetchAlumniDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!alumni) {
    return <div>No alumni data available</div>;
  }

  return (
    <Box className="container mx-auto px-4 py-8">
      <Box className="bg-gray-100 shadow-lg rounded-lg p-8 mb-8 flex flex-wrap md:flex-nowrap">
        {/* Profile Image */}
        <Box className="flex-shrink-0 w-full md:w-1/3 mb-4 md:mb-0 text-center md:text-left">
          <img
            src={alumni.profilePic || 'https://via.placeholder.com/300'}
            alt={`${alumni.firstName} ${alumni.lastName} profile`}
            className="w-64 h-64 object-cover rounded-full mx-auto md:mx-0"
          />
        </Box>

        {/* Profile Information */}
        <Box className="md:flex-grow md:ml-8">
          <Typography variant="h3" component="h1" className="text-3xl font-bold">
            {alumni.firstName} {alumni.lastName}
          </Typography>
          <Typography variant="h6" component="h2" className="text-xl font-semibold mt-2">
            {alumni.discipline} {/* Displaying discipline as the degree */}
          </Typography>
          <Typography variant="body1" className="mt-4">
            {alumni.tagline || 'Aspiring professional seeking opportunities to make a positive impact.'}
          </Typography>

          {/* Contact Information */}
          <Box className="mt-6">
            <Typography variant="h5" component="h3" className="text-lg font-bold mb-2">
              Contact
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {alumni.nuEmail}
            </Typography>
            <Typography variant="body1">
              <strong>Personal Email:</strong> {alumni.personalEmail || 'Not Available'}
            </Typography>
            <Typography variant="body1">
              <strong>Phone Number:</strong> {alumni.contact || 'Not Available'}
            </Typography>
            {alumni.linkedin && (
              <Typography variant="body1">
                <strong>LinkedIn:</strong>{' '}
                <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  {alumni.linkedin}
                </a>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Education and Skills */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          {/* Education */}
          <Box className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Typography variant="h5" component="h3" className="text-lg font-bold mb-4">
              Education
            </Typography>
            <Typography variant="body1">
              <strong>Degree:</strong> {alumni.discipline} {/* Using discipline field as Degree */}
            </Typography>
            <Typography variant="body1">
              <strong>Year of Graduation:</strong> {alumni.yearOfGraduation}
            </Typography>
            <Typography variant="body1">
              <strong>CGPA:</strong> {alumni.cgpa}
            </Typography>
          </Box>

          {/* Skills */}
          <Box className="bg-white p-6 rounded-lg shadow-md">
            <Typography variant="h5" component="h3" className="text-lg font-bold mb-4">
              Skills
            </Typography>
            <Typography variant="body1" className="mt-2">
              {alumni.skills ? alumni.skills.join(', ') : 'No skills listed.'}
            </Typography>
          </Box>
        </Grid>

        {/* Work Experience, FYP, and Certifications */}
        <Grid item xs={12} md={8}>
          {/* Work Experience (Using Personal Experience) */}
          <Box className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Typography variant="h5" component="h3" className="text-lg font-bold mb-4">
              Work Experience
            </Typography>
            {alumni.personalExperience ? (
              <ul>
                {alumni.personalExperience.split(',').map((item, index) => (
                  <li key={index}>
                    <Typography variant="body1">• {item.trim()}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1">No work experience listed.</Typography>
            )}
          </Box>

          {/* Final Year Project (FYP) Section */}
          <Box className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Typography variant="h5" component="h3" className="text-lg font-bold mb-4">
              Final Year Project (FYP)
            </Typography>
            {alumni.fyp ? (
              <Typography variant="body1">{alumni.fyp}</Typography>
            ) : (
              <Typography variant="body1">No FYP details available.</Typography>
            )}
          </Box>

          {/* Certifications */}
          <Box className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Typography variant="h5" component="h3" className="text-lg font-bold mb-4">
              Certifications
            </Typography>
            {alumni.certificate ? (
              <ul>
                {alumni.certificate.split(',').map((certification, index) => (
                  <li key={index}>
                    <Typography variant="body1">• {certification.trim()}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1">No certifications listed.</Typography>
            )}
          </Box>

          {/* Projects */}
          <Box className="bg-white p-6 rounded-lg shadow-md">
            <Typography variant="h5" component="h3" className="text-lg font-bold mb-4">
              Projects
            </Typography>
            {alumni.projects && alumni.projects.length > 0 ? (
              alumni.projects.map((project, index) => (
                <Box key={index} className="mb-4">
                  <Typography variant="h6" component="h4" className="font-semibold">
                    {project.name}
                  </Typography>
                  <Typography variant="body1">{project.description}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1">No projects listed.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
