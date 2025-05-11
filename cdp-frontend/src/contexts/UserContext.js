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

    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/refresh-token`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      // Store new tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      isRefreshing = false;
      return true;
    } catch {
      isRefreshing = false;
      return false;
    }
  };


  // Fetch Current User
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/current-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the access token in the Authorization header
          },
        }
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
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/check-session`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

        // If the response is a 401 (Unauthorized) and the request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshed = await refreshAccessToken();
          if (refreshed) return axios(originalRequest); // Retry the original request
          setUser(null); // If refreshing failed, logout the user
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
        credentials
      );
      const { accessToken, refreshToken } = response.data.data;

      // Store JWT tokens in localStorage or sessionStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(response.data.data.user || null);
      return !!response.data.data.user;
    } catch {
      return false;
    }
  };


  // Logout Function
  const logout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
