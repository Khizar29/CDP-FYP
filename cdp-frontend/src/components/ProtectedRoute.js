import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;
