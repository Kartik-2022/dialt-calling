// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './components/Login'; // Your main login component
import Dashboard from './features/dashboard/Dashboard'; // Your main dashboard
import { getToken, removeToken } from './http/token-interceptor'; // For direct token check

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To check initial token presence

  useEffect(() => {
    const checkInitialAuth = async () => {
      const token = await getToken();
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    checkInitialAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // You might want to reload or redirect here if Login component doesn't handle it
    // window.location.hash = '#/dashboard'; // Example explicit redirect if not handled
  };

  const handleLogout = () => {
    removeToken(); // Remove token from local storage
    setIsLoggedIn(false);
    // window.location.hash = '#/login'; // Example explicit redirect if not handled
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading application...</p>
      </div>
    );
  }

  // Simple conditional rendering based on login status
  return (
    <div className="App">
      {true ? (
        <Dashboard onLogout={handleLogout} /> // Pass logout prop to Dashboard
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} /> // Pass login success prop to Login
      )}
    </div>
  );
}

export default App;
