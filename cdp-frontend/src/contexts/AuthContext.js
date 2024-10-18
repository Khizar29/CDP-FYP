import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getCookies = () => {
      const pairs = document.cookie.split(';');
      const cookies = {};
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        cookies[key.trim()] = value;
      }
      return cookies;
    };

    const cookies = getCookies();
    if (cookies.accessToken) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/current-user`, {
        withCredentials: true,
      })
      .then(response => {
        if (response.data.status === 200) {
          const fetchedUser = response.data.data;
          setUser(fetchedUser);
          setIsLoggedIn(true);
          setIsAdmin(fetchedUser.role === 'admin');
        }
      })
      .catch(error => {
        console.error("Error fetching current user", error);
        setIsLoggedIn(false);
      });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setIsAdmin(userData.role === 'admin');
    // Optionally store user info in local storage or cookies
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    // Clear cookies or local storage if needed
    axios.post("http://localhost:8000/api/v1/users/logout", {}, { withCredentials: true })
      .then(() => {
        // Logout successful
        console.log("Logged out successfully");
      })
      .catch(error => {
        console.error("Error during logout", error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
