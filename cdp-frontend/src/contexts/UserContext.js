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
      axios.get('http://localhost:8000/api/v1/users/current-user', {
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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
