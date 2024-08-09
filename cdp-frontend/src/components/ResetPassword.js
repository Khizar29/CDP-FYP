// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

export default function ResetPassword() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
       alert("Passwords don't match");
       return;
    }
    try {
       const response = await axios.post(`http://localhost:8000/api/v1/users/reset-password/${id}/${token}`, { password });
       alert(response.data.message);
       navigate('/signin'); // Use navigate instead of history.push
    } catch (error) {
       alert(error.response?.data?.message || 'Something went wrong');
    }
 };
 

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Reset Password</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          required
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>Reset Password</Button>
      </Box>
    </Box>
  );
}
