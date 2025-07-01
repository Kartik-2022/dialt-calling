// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';

import LoginPage from './pages/public/LoginPage';
import DashboardPage from './pages/private/DashboardPage';
import NewEntryForm from './pages/private/NewEntryForm';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />

          
          <Route element={<PrivateRoute />}>
            
            <Route path="/dashboard" element={<DashboardPage />} />
            
            <Route path="/add-entry" element={<NewEntryForm onSuccessfulSubmission={() => {
            }} />} />
          </Route>

         
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
