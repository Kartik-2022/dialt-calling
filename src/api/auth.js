// src/api/auth.js
import { login as originalLogin } from "../http/http-calls"; 

export const loginUser = async (credentials) => {
  try {
    const response = await originalLogin(credentials);

    if (response && response.token) {
      return response;
    } else {
      throw new Error(response?.message || "Login failed. Invalid credentials or missing token.");
    }
  } catch (error) {
    console.error("API Error during login:", error);
    throw new Error(error.message || "An unexpected error occurred during login.");
  }
};
