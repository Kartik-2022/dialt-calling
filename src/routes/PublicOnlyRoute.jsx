// src/routes/PublicOnlyRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

/**
 * PublicOnlyRoute component ensures that authenticated users are redirected away
 * from public-only routes (e.g., login, signup) to the dashboard.
 * If the user is not authenticated, they can proceed to the public route.
 */
const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status from AuthContext

  // If authenticated, redirect to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />; // 'replace' prop ensures navigation replaces the current entry in history stack
  }

  // If not authenticated, render the child routes (e.g., login page)
  return <Outlet />;
};

export default PublicOnlyRoute;
