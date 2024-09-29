import React, { useState, useContext } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Alert,
  Paper
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import ForgotPasswordModal from './ForgotPassword';

const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage(''); 
      const response = await axios.post('http://localhost:8000/api/v1/users/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });

      console.log('User logged in:', response.data);
      setUser(response.data.data.user);
      localStorage.setItem('accessToken', response.data.data.accessToken);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('The password you entered is incorrect.');
      } else {
        setErrorMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
      }
    }
  };

  const handleOpenForgotPassword = () => setOpenForgotPassword(true);
  const handleCloseForgotPassword = () => setOpenForgotPassword(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          className="mt-8 flex flex-col items-center px-1 py-1 sm:px-1 sm:py-1 md:px-4 md:py-1 bg-white rounded-lg shadow-lg"
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="font-bold text-center text-gray-800">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} className="w-full space-y-4">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 rounded-md"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 rounded-md"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 text-lg transition duration-300"
            >
              Sign In
            </Button>

            {/* Error message display */}
            {errorMessage && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <Alert severity="error">{errorMessage}</Alert>
              </Box>
            )}

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={handleOpenForgotPassword}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <ForgotPasswordModal open={openForgotPassword} handleClose={handleCloseForgotPassword} />
        <Copyright sx={{ mt: 2, mb: 0.5 }} />
      </Container>
    </ThemeProvider>
  );
}
