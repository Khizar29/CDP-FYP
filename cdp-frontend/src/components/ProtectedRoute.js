import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If user exists but role is not allowed, show an Unauthorized message
  if (!allowedRoles.includes(user.role)) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to view this page.</p>
    </div>;
  }

  return children;
};

export default ProtectedRoute;
