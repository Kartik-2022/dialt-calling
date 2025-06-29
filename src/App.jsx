// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import PrivateRoute from './routes/PrivateRoute'; // Import PrivateRoute
import PublicOnlyRoute from './routes/PublicOnlyRoute'; // Import PublicOnlyRoute
import LoginPage from './pages/LoginPage'; // Import LoginPage
import DashboardPage from './pages/DashboardPage'; // Import DashboardPage

// Ensure your global CSS imports are correct, e.g.:
// import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the entire application with AuthProvider */}
        <Routes>
          {/* Public routes (accessible only if not authenticated) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            {/* You can add other public-only routes here, e.g., /register */}
          </Route>

          {/* Protected routes (accessible only if authenticated) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Add more protected routes here as needed */}
            {/* Define a default protected route if user goes to root and is logged in */}
            <Route path="/" element={<DashboardPage />} />
          </Route>

          {/* Fallback for unmatched routes - could be a 404 page */}
          <Route path="*" element={<p className="text-center mt-20 text-xl">404: Page Not Found</p>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
