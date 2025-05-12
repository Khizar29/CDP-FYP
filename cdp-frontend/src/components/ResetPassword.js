// // src/components/ResetPassword.js
// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Box, Typography, TextField, Button } from '@mui/material';
// import axios from 'axios';

// export default function ResetPassword() {
//   const { id, token } = useParams();
//   const navigate = useNavigate();
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (password !== confirmPassword) {
//        alert("Passwords don't match");
//        return;
//     }
//     try {
//        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/reset-password/${id}/${token}`, { password });
//        alert(response.data.message);
//        navigate('/signin'); // Use navigate instead of history.push
//     } catch (error) {
//        alert(error.response?.data?.message || 'Something went wrong');
//     }
//  };
 

//   return (
//     <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>Reset Password</Typography>
//       <Box component="form" onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           required
//           label="New Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           fullWidth
//           required
//           label="Confirm New Password"
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <Button type="submit" variant="contained" color="primary" fullWidth>Reset Password</Button>
//       </Box>
//     </Box>
//   );
// }
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

export default function ResetPassword() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/reset-password/${id}/${token}`,
        { password }
      );
      setMessage(response.data.message || 'Password reset successfully');

      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow justify-center items-center bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-8 md:py-16">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full md:max-w-md lg:max-w-lg border border-gray-200">
          <h1 className="text-2xl md:text-3xl font-extrabold text-center text-blue-900 mb-6">
            Reset Your Password
          </h1>

          {message && (
            <p
              className={`text-center mb-4 ${
                message.toLowerCase().includes('success') ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6 relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
