// src/components/Login.jsx
import React, { useState } from 'react';
import { Card } from './ui/Card'; // Assuming these UI components exist
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { login as apiLogin } from '../http/http-calls'; // Your API login function

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    try {
      // Assuming your apiLogin expects { handle: email, password }
      const response = await apiLogin({ handle: email, password });

      if (response && response.error === false) {
        onLoginSuccess(); // Call the success handler passed from App.jsx
      } else {
        setError(response.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error("Login API call failed:", err);
      // err.reason for custom error handling from your http-service/http-calls if any
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
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
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

export default Login;
