// src/http/token-interceptor.js
// This file manages localStorage operations for the authentication token.

export const TOKEN_STORAGE_KEY = 'recruitechUserToken'; // Consistent key definition

export const BASE_URL = "https://api-dev.smoothire.com/api/v1"; // IMPORTANT: Replace with your actual backend URL

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string | null} The stored token or null if not found.
 */
export const getToken = () => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    return token;
  } catch (error) {
    console.error("Error retrieving token from localStorage:", error);
    return null;
  }
};

/**
 * Stores the authentication token in localStorage.
 * @param {string} token - The JWT token to store.
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    console.log("Token saved to localStorage with key:", TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Error saving token to localStorage:", error);
  }
};

/**
 * Removes the authentication token from localStorage.
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    console.log("Token removed from localStorage with key:", TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};
