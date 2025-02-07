import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // If still loading, you can show a loading indicator or nothing
  if (loading) {
    return <div>Loading...</div>; // Or just return null to prevent rendering anything while loading
  }

  // If user is not logged in or not an admin, redirect to signin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/signin" replace />;
  }

  // Otherwise, render the children (protected component)
  return children;
};

export default ProtectedRoute;
