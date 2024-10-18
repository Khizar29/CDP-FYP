// src/components/ForgotPasswordModal.js
import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ForgotPasswordModal({ open, handleClose }) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/forgot-password`, { email });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="forgot-password-modal-title" aria-describedby="forgot-password-modal-description">
      <Box sx={style}>
        <Typography id="forgot-password-modal-title" variant="h6" component="h2">Forgotten Password?</Typography>
        <Typography id="forgot-password-modal-description" sx={{ mt: 2 }}>
          Enter your registered email. We will send a reset link to your email.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            required
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button type="submit" variant="contained" color="primary">Request</Button>
            <Button onClick={handleClose} variant="contained" color="secondary">Cancel</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
