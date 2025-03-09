import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  let isRefreshing = false;

  // Refresh Token Function
  const refreshAccessToken = async () => {
    if (isRefreshing) return false;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/refresh-token`,
        {},
        { withCredentials: true }
      );

      isRefreshing = false;
      return !!response.data.data;
    } catch {
      isRefreshing = false;
      return false;
    }
  };

  // Fetch Current User
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/current-user`,
        { withCredentials: true }
      );
      setUser(response.data.data || null);
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return fetchCurrentUser();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check Session Exists
  const checkSessionExists = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/check-session`,
        { withCredentials: true }
      );
      return response.data.sessionActive;
    } catch {
      return false;
    }
  };

  // Global Axios Interceptor for Handling Expired Tokens
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshed = await refreshAccessToken();
          if (refreshed) return axios(originalRequest);
          setUser(null);
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Initialize Authentication on Mount
  useEffect(() => {
    const initAuth = async () => {
      if (await checkSessionExists()) await fetchCurrentUser();
      else setLoading(false);
    };

    initAuth();
  }, []);

  // Login Function
  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/login`,
        credentials,
        { withCredentials: true }
      );
      setUser(response.data.data.user || null);
      return !!response.data.data.user;
    } catch {
      return false;
    }
  };

  // Logout Function
  const logout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
