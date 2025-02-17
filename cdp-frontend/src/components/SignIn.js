import React, { useState, useContext } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Box,
  Link,
  IconButton,
  InputAdornment,
  Alert
} from "@mui/material";
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import ForgotPasswordModal from "./ForgotPassword";

const defaultTheme = createTheme();

export default function SignIn({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const success = await login({ email, password });
      if (success) {
        if (onClose) onClose();
        navigate("/");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Link href="#" variant="body2" onClick={() => setOpenForgotPassword(true)}>
                Forgot password?
              </Link>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Box>
        <ForgotPasswordModal open={openForgotPassword} handleClose={() => setOpenForgotPassword(false)} />
      </Container>
    </ThemeProvider>
  );
}
