// src/App.jsx

import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute'; 
import LoginPage from './pages/public/LoginPage';
import DashboardPage from './pages/private/DashboardPage';
import { AuthProvider } from "./context/AuthContext";
import { initializeOneSignal } from './utils/oneSignalHelpers';

function App() {

  useEffect(() => {
    initializeOneSignal("979a3a7a-e572-40e7-b81b-ec81b1061fbf", true); 
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


