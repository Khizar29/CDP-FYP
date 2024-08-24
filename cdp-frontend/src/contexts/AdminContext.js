import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

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
      axios.get('http://localhost:8000/api/v1/users/current-user', {
        withCredentials: true,
      })
      .then(response => {
        if (response.data.status === 200) {
          setAdmin(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching current admin", error);
      });
    }
  }, []);

  const logout = () => {
    setAdmin(null);
    // Additional logout logic (e.g., clearing cookies) can go here.
  };

  return (
    <AdminContext.Provider value={{ admin, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
