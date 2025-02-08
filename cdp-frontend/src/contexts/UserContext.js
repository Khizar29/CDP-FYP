import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true, 
  });

  // Fetch current user (ONLY IF NOT FETCHING)
  const fetchCurrentUser = async () => {
    if (isFetching) return; // 🛑 Prevent duplicate calls

    try {
      setIsFetching(true);
      
      const response = await api.get("/api/v1/users/current-user");

      if (response.data.data) {
        
        setUser(response.data.data);
      } else {
        console.warn("No user found, setting user to null.");
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Unauthorized request. Checking if refresh is needed...");

        const hasSession = await checkSessionExists();
        if (!hasSession) {
          console.warn("No valid session. Skipping refresh & fetch.");
          setUser(null);
          return;
        }

        const refreshed = await refreshAccessToken();
        if (refreshed) {
          
          return fetchCurrentUser();
        }

        console.warn("Refresh failed. No user session.");
        setUser(null);
      }
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  // Check if session exists BEFORE calling fetch
  const checkSessionExists = async () => {
    try {
     
      const response = await api.get("/api/v1/users/check-session"); 
      return response.data.sessionActive; 
    } catch (error) {
      return false;
    }
  };

  // Refresh token (ONLY if backend confirms session exists)
  const refreshAccessToken = async () => {
    try {
      console.log("Attempting to refresh access token...");
      const response = await api.post("/api/v1/users/refresh-token");

      if (response.data.data) {
        console.log("Token refreshed successfully.");
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // Initialize Authentication ONCE
  useEffect(() => {
    const initAuth = async () => {
      try {
        
        const hasSession = await checkSessionExists(); 

        if (hasSession) {
          
          await fetchCurrentUser();
        } else {
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
      }
    };

    initAuth();
  }, []);

  // Axios interceptor (Prevent infinite refresh loop)
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && user) {
          originalRequest._retry = true;
          console.warn("401 Unauthorized. Attempting token refresh...");

          const refreshed = await refreshAccessToken();
          if (refreshed) {
            console.log("Token refreshed, retrying original request...");
            return api(originalRequest);
          }

          console.warn("Token refresh failed. Logging out.");
          setUser(null);
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [user]);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await api.post("/api/v1/users/login", credentials);
      if (response.data.data.user) {
        setUser(response.data.data.user);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/api/v1/users/logout");
      setUser(null);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
