// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Import existing token management functions from token-interceptor.js
import { getToken, setToken, removeToken } from '../http/token-interceptor';

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider component manages the authentication state (isAuthenticated, login/logout).
 * It uses the existing getToken, setToken, and removeToken from token-interceptor.js.
 *
 * @param {object} { children } - React children to be rendered within the provider's scope.
 */
export const AuthProvider = ({ children }) => {
  // State to determine if the user is authenticated. Initialize from current token presence.
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Logs in a user by setting authentication status and navigating.
   * Note: The actual token setting in localStorage happens in http-calls.js's login function.
   * This function only updates the AuthContext state.
   */
  const login = () => { // Simplified: does not need newToken param if http-calls already sets it
    setIsAuthenticated(true);
    navigate('/dashboard'); // Navigate to the dashboard after successful login
  };

  /**
   * Logs out a user by removing the token and updating authentication status, then navigates.
   */
  const logout = () => {
    removeToken(); // Use the existing removeToken function
    setIsAuthenticated(false);
    navigate('/login'); // Navigate to the login page after logout
  };

  // Effect to re-evaluate authentication status if local storage token changes externally
  // This helps keep state in sync if a token is manually deleted from browser storage.
  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = getToken();
      if (!!currentToken !== isAuthenticated) {
        setIsAuthenticated(!!currentToken);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]); // Only re-run if isAuthenticated state itself changes

  // Context value to be provided to consumers
  const contextValue = {
    isAuthenticated,
    login, // This is the AuthContext's login function
    logout,
    getToken, // Expose getToken from token-interceptor.js for direct use if needed (e.g., DashboardPage)
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the authentication context.
 * Throws an error if used outside of an AuthProvider.
 * @returns {object} The authentication context value (isAuthenticated, login, logout, getToken).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
