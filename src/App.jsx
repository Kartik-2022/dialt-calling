// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import PrivateRoute from './routes/PrivateRoute'; // Import PrivateRoute
import PublicOnlyRoute from './routes/PublicOnlyRoute'; // Import PublicOnlyRoute
import LoginPage from './pages/LoginPage'; // Import LoginPage
import DashboardPage from './pages/DashboardPage'; // Import DashboardPage



function App() {
  return (
    <Router>
      <AuthProvider> 
        <Routes>
         
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            
          </Route>

          
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            <Route path="/" element={<DashboardPage />} />
          </Route>

          
          <Route path="*" element={<p className="text-center mt-20 text-xl">404: Page Not Found</p>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
