// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext, useAuth } from './authContext';

const ProtectedRoute = ({ element }) => {
  const { authState } = useAuth();

  return authState.isAuthenticated ? element : <Navigate to="/signup" replace={true} />;
};

export default ProtectedRoute;
