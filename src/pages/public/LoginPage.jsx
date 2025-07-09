// src/pages/public/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { setToken } from "../../http/token-interceptor";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useLogin } from "../../hooks/useAuthQuery";

const LoginPage = () => {
  const [handle, setHandle] = useState(""); // Changed from email to handle
  const [password, setPassword] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useLogin();

  useEffect(() => {
    logout();
  }, [logout]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Pass 'handle' instead of 'email' to the mutation
    loginMutation.mutate({ handle, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Smoothire
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="handle" // Changed htmlFor to handle
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Handle
            </label>
            <input
              type="text" // Changed type to text, as handle might not be an email format
              id="handle" // Changed id to handle
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your handle" // Changed placeholder
              value={handle}
              onChange={(e) => setHandle(e.target.value)} // Changed setEmail to setHandle
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginMutation.isError && (
            <p className="text-red-500 text-xs italic mb-4">
              {loginMutation.error.message}
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                loginMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
