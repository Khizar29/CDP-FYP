// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
          console.log('User fetched:', response.data.data);
          setUser(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching current user", error);
      });
    }
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
