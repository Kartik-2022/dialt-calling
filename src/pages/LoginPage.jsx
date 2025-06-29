// src/pages/LoginPage.jsx
import React, { useState } from 'react';
// Adjusted import paths for UI components
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// --- IMPORTANT CHANGE: Import 'login' directly as it's exported from http-calls.js ---
import { login as apiLogin } from '../http/http-calls'; // Alias to avoid name conflict with context's login
// -----------------------------------------------------------------------------------

// Import the useAuth hook from your new AuthContext
import { useAuth } from '../context/AuthContext';


const LoginPage = () => { 
  // Destructure the `login` function from the AuthContext.
  // Renamed to `authContextLogin` to clearly differentiate from the API's `login` function.
  const { login: authContextLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    try {
      // Call your API login function from http-calls.js.
      // This function internally calls `setToken` from `token-interceptor.js`.
      const response = await apiLogin({ handle: email, password }); // Pass an object as expected by your `login` function
      
      if (response && response.token) { 
        // After apiLogin has successfully stored the token,
        // inform AuthContext to update its `isAuthenticated` state and navigate.
        authContextLogin(); // No need to pass token here, AuthContext will re-read from localStorage
      } else {
        setError(response.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error("Login API call failed:", err);
      setError(err.message || 'An unexpected error occurred during login. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={isAuthenticating}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="sr-only">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              disabled={isAuthenticating}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={isAuthenticating}>
            {isAuthenticating ? 'Logging In...' : 'Log In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
