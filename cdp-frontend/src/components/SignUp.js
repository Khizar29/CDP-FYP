// src/components/SignUp.js
import React, { useState, useContext } from 'react';
import { Avatar, Button, CssBaseline, TextField, Radio, RadioGroup, FormControlLabel, Typography, Container, Box, Link } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const defaultTheme = createTheme();

export default function SignUp() {
  const [userType, setUserType] = useState('student');
  const [fullName, setFullName] = useState('');
  const [nuEmail, setNuEmail] = useState('');
  const [nuid, setNuid] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Handle form submission for Student registration
  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/register`, {
        fullName,
        email: nuEmail,
        nuId: nuid,
      });
      setUser(response.data.data); // Updated to access user data structure
      alert("Student registered successfully.");
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register student.");
    }
  };

  // Handle Graduate check for masked email
  const handleGraduateCheck = async () => {
    setError('');
    setMaskedEmail('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/check-graduate`, { nuId: nuid });
      setMaskedEmail(response.data.data.maskedEmail); // Store masked email for confirmation display
    } catch (err) {
      setError(err.response?.data?.message || "Graduate not found or already registered.");
    }
  };

  // Register Graduate after confirmation
  const handleGraduateRegister = async () => {
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/register-graduate`, { nuId: nuid });
      setUser(response.data.data); // Updated to access user data structure
      alert("Graduate registered successfully.");
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register graduate.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Sign Up</Typography>

          {/* User Type Selector */}
          <RadioGroup
            row
            value={userType}
            onChange={(e) => { setUserType(e.target.value); setMaskedEmail(''); setError(''); }}
            sx={{ mt: 2, mb: 1 }}
          >
            <FormControlLabel value="student" control={<Radio />} label="Student" />
            <FormControlLabel value="graduate" control={<Radio />} label="Graduate" />
          </RadioGroup>

          {/* Student Registration Form */}
          {userType === 'student' && (
            <Box component="form" noValidate onSubmit={handleStudentSubmit} sx={{ mt: 1 }}>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                required
                fullWidth
                id="nuEmail"
                label="NU Email"
                name="nuEmail"
                autoComplete="email"
                value={nuEmail}
                onChange={(e) => setNuEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                required
                fullWidth
                id="studentNuid" // unique ID for student form
                label="NU ID"
                name="studentNuid"
                value={nuid}
                onChange={(e) => setNuid(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
              {error && <Typography color="error" align="center" sx={{ mt: 1 }}>{error}</Typography>}
            </Box>
          )}

          {/* Graduate Registration Flow */}
          {userType === 'graduate' && (
            <Box sx={{ mt: 1 }}>
              <TextField
                required
                fullWidth
                id="graduateNuid" // unique ID for graduate form
                label="NU ID"
                name="graduateNuid"
                value={nuid}
                onChange={(e) => setNuid(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button onClick={handleGraduateCheck} fullWidth variant="contained" sx={{ mb: 2 }}>Check</Button>

              {/* Show masked email and register button if graduate is found */}
              {maskedEmail && (
                <>
                  <Typography align="center" sx={{ mt: 1 }}>Graduate found. Confirmed email: {maskedEmail}</Typography>
                  <Button onClick={handleGraduateRegister} fullWidth variant="contained" sx={{ mt: 2 }}>Register</Button>
                </>
              )}

              {error && (
                <Typography color="error" align="center" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          )}

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account? <Link href="/signin">Sign in</Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
