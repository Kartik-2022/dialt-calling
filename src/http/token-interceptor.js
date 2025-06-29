// src/http/token-interceptor.js

// The consistent key to use for storing and retrieving the token
const TOKEN_STORAGE_KEY = 'recruitechUserToken';

// Function to set the authentication token in localStorage
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    console.log("Token stored in localStorage with key:", TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Error storing token in localStorage:", error);
  }
};

// Function to get the authentication token from localStorage
export const getToken = () => {
  return new Promise((resolve, reject) => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        resolve(token);
      } else {
        resolve(null);
      }
    } catch (error) {
      console.error("Error retrieving token from localStorage:", error);
      reject(error); // Reject the promise on error
    }
  });
};

// Function to remove the authentication token from localStorage
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    console.log("Token removed from localStorage with key:", TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};
