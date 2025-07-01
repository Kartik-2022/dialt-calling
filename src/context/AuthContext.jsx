// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken, removeToken } from '../http/token-interceptor';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    try {
      
      const payload = {
        handle: email, 
        password: password,
        deviceDetails: {
        
          ipAddress: "127.0.0.1", 
          name: "Web Browser", 
        }
      };


      const response = await fetch('https://api-dev.smoothire.com/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        if (textResponse.trim().startsWith('<') && textResponse.trim().endsWith('>')) {
          data = { message: 'An unexpected server error occurred during login. Please try again later.' };
        } else {
          data = { message: textResponse || `Server responded with status ${response.status} ${response.statusText}` };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `Login failed with status: ${response.status}.`);
      }

      const { token } = data;
      if (token) {
        setToken(token);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        throw new Error('Login successful, but no token received in response.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      removeToken();
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

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
  }, [isAuthenticated]);

  const contextValue = React.useMemo(() => ({
    isAuthenticated,
    login,
    logout,
    getToken,
  }), [isAuthenticated, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
