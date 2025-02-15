import React, { useState, useContext } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Container,
  Box,
  Link
} from "@mui/material";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

const defaultTheme = createTheme();

export default function SignUp() {
  const [userType, setUserType] = useState("student");
  const [fullName, setFullName] = useState("");
  const [nuEmail, setNuEmail] = useState("");
  const [nuid, setNuid] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Validate NU ID Format (Used for both Students & Graduates)
  const validateNuId = (id) => {
    const nuIdRegex = /^\d{2}[A-Z]-\d{4}$/; // Matches format: 21K-3329
    return nuIdRegex.test(id);
  };

  // Validate NU Email Format & Match with NU ID
  const validateFields = () => {
    let errors = {};

    // Validate NU Email Format
    const emailRegex = /^([A-Z])(\d{2})(\d{4})@nu\.edu\.pk$/i;
    const match = nuEmail.match(emailRegex);
    if (!match) {
      errors.nuEmail = "Invalid email format. Example: K213329@nu.edu.pk (CampusCode + BatchYear + ID)";
    }

    if (match) {
      const campusCode = match[1].toUpperCase(); // A-Z (Campus Code)
      const batchYear = match[2]; // 21 (Batch Year)
      const studentNumber = match[3]; // 3329
      const expectedNuId = `${batchYear}${campusCode}-${studentNumber}`;

      // Validate NU ID Format
      if (nuid !== expectedNuId) {
        errors.nuid = `NU ID must match email pattern. Expected: ${expectedNuId}`;
      }
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // NU ID Input Handler (Real-time Validation & Formatting)
  const handleNuIdChange = (e) => {
    let value = e.target.value.toUpperCase(); // Convert to uppercase
    value = value.replace(/[^0-9A-Z-]/g, ""); // Allow only numbers, letters, and '-'

    // Ensure the first two characters are numbers (Batch Year)
    if (value.length >= 1 && !/^\d{0,2}$/.test(value.slice(0, 2))) {
      return;
    }

    // Ensure the third character is an uppercase letter (Campus Code)
    if (value.length >= 3 && !/^\d{2}[A-Z]?$/.test(value.slice(0, 3))) {
      return;
    }

    // Automatically insert "-" after third character
    if (value.length === 3 && !value.includes("-")) {
      value = value + "-";
    }

    // Ensure only four digits appear after "-"
    if (value.length >= 5 && !/^\d{2}[A-Z]-\d{0,4}$/.test(value)) {
      return;
    }

    setNuid(value);
  };

  // Handle form submission for Student registration
  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    setError({});

    if (!validateFields()) return; // Stop if validation fails

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/register`, {
        fullName,
        email: nuEmail,
        nuId: nuid,
      });
      setUser(response.data.data);
      alert("Student registered successfully.");
      navigate("/signin");
    } catch (err) {
      setError({ api: err.response?.data?.message || "Failed to register student." });
    }
  };

  // Handle Graduate NU ID Validation & API Check
  const handleGraduateCheck = async () => {
    setError({});
    setMaskedEmail("");

    if (!validateNuId(nuid)) {
      setError({ nuid: "Invalid NU ID format. Example: 21K-3329" });
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/check-graduate`, { nuId: nuid });
      setMaskedEmail(response.data.data.maskedEmail);
    } catch (err) {
      setError({ api: err.response?.data?.message || "Graduate not found or already registered." });
    }
  };

  // Register Graduate after confirmation
  const handleGraduateRegister = async () => {
    setError({});
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/register-graduate`, { nuId: nuid });
      setUser(response.data.data);
      alert("Graduate registered successfully.");
      navigate("/signin");
    } catch (err) {
      setError({ api: err.response?.data?.message || "Failed to register graduate." });
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
            Sign Up
          </Typography>

          {/* User Type Selector */}
          <RadioGroup
            row
            value={userType}
            onChange={(e) => {
              setUserType(e.target.value);
              setMaskedEmail("");
              setError({});
            }}
            sx={{ mt: 2, mb: 1 }}
          >
            <FormControlLabel value="student" control={<Radio />} label="Student" />
            <FormControlLabel value="graduate" control={<Radio />} label="Graduate" />
          </RadioGroup>

          {/* Student Registration Form */}
          {userType === "student" && (
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
                label="NU Email (e.g., K213329@nu.edu.pk)"
                name="nuEmail"
                autoComplete="email"
                value={nuEmail}
                onChange={(e) => setNuEmail(e.target.value)}
                error={!!error.nuEmail}
                helperText={error.nuEmail}
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                id="studentNuid"
                label="NU ID (e.g., 21K-3329)"
                name="studentNuid"
                value={nuid}
                onChange={handleNuIdChange}
                error={!!error.nuid}
                helperText={error.nuid}
                sx={{ mb: 2 }}
              />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
            </Box>
          )}

          {/* Graduate Registration Flow */}
          {userType === "graduate" && (
            <Box sx={{ mt: 1 }}>
              <TextField
                required
                fullWidth
                id="graduateNuid"
                label="NU ID (e.g., 21K-3329)"
                name="graduateNuid"
                value={nuid}
                onChange={handleNuIdChange}
                error={!!error.nuid}
                helperText={error.nuid}
                sx={{ mb: 2 }}
              />
              <Button onClick={handleGraduateCheck} fullWidth variant="contained" sx={{ mb: 2 }}>
                Check
              </Button>

              {maskedEmail && (
                <>
                  <Typography align="center" sx={{ mt: 1 }}>Graduate found. Confirmed email: {maskedEmail}</Typography>
                  <Button onClick={handleGraduateRegister} fullWidth variant="contained" sx={{ mt: 2 }}>Register</Button>
                </>
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
