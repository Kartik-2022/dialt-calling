// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

/**
 * PrivateRoute component ensures that only authenticated users can access its child routes.
 * If the user is not authenticated, they are redirected to the login page.
 */
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status from AuthContext

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // 'replace' prop ensures navigation replaces the current entry in history stack
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
