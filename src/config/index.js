// src/config/index.js


export const BASE_URL = "https://api-dev.smoothire.com/api/v1";


export const STATIC_USERS_OPTIONS = [
    {label: "All", value: "All"},
    {label: "Alex Sharma", value: "5f327acb6aba6010978bd1b2"},
    {label: "Pratik 10, 11", value: "64e737912cb1267fcd1dd92f"},
    {label: "Avi Kapoor", value: "681c7340048c6ced83e9509b"},
    {label: "Abhinav Kumar", value: "6628bc970dc56350944e6906"},
];

export const STATIC_JOB_FUNCTIONS_OPTIONS = [
    {label: "All", value: "All"},
    {label: "Actuarial", value: "651d1392be1d01530699bf65"},
    {label: "Art", value: "65f9762acd85af49308a481c"},
    {label: "Content Writer", value: "66d1b247adbc8a65d8df6f41"},
    {label: "Data Science", value: "66d1b241adbc8a65d8df6f3b"},
    {label: "Audit And IT Roles", value: "6523f30eacb0666ba1d169c7"},
];

export const STATIC_TAGS_OPTIONS = [
    {label: "All", value: "All"},
    {label: "CALL LATER", value: "CALL LATER"},
    {label: "JD Shared/CV Pending", value: "JD Shared/CV Pending"},
    {label: "Shared To Client", value: "Shared To Client"},
    {label: "Out Of India", value: "Out Of India"},
];


// Placeholder Regex Configurations (You will provide the final regex)
export const RegexConfig = {
  name: /^[A-Za-z\s.'-]+$/, // Allows letters, spaces, dots, apostrophes, hyphens
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email format
  phone: /^\+?[0-9\s-()]{7,20}$/, // Basic international phone format (adjust as needed)
  linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i, // Basic LinkedIn URL
  // Add more regex as needed for other fields like location, etc.
};

// UI Messages for form validation and submission
export const UI_MESSAGES = {
  REQUIRED_FIELD: (fieldName) => `${fieldName} is required.`,
  INVALID_FORMAT: (fieldName) => `Invalid ${fieldName} format.`,
  EMAIL_INVALID: "Please enter a valid email address.",
  PHONE_INVALID: "Please enter a valid phone number.",
  LINKEDIN_INVALID: "Please enter a valid LinkedIn profile URL.",
  NAME_INVALID: "Name can only contain letters, spaces, dots, apostrophes, and hyphens.",
  API_ERROR: "An unexpected error occurred. Please try again.",
  SUBMIT_SUCCESS: "Entry created successfully!",
  SUBMIT_ERROR: "Failed to create entry. Please check your inputs and try again.",
  FORM_INVALID: "Please fill out all required fields correctly.",
};

// DUMMY API DELAY (for simulating network latency in development)
export const DUMMY_API_DELAY_MS = 500; // 0.5 seconds
