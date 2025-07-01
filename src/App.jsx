// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute'; // Still needed for protection

// All page components are now imported from their correct private/public folders
import LoginPage from './pages/public/LoginPage';
import DashboardPage from './pages/private/DashboardPage';
// NewEntryForm is no longer a direct route, it's a modal within DashboardPage
// import NewEntryForm from './pages/private/NewEntryForm'; // REMOVE THIS LINE

// FIX: Corrected AuthContext import path based on your clarification
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route for Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes - PrivateRoute directly wraps the content */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* The /add-entry route is removed as it's now a modal */}
            {/* If you had a route like this, remove it: */}
            {/* <Route path="/add-entry" element={<NewEntryForm onSuccessfulSubmission={() => {
                console.log("New entry created successfully! Navigating back to dashboard.");
            }} />} /> */}
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* 404 Not Found */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
