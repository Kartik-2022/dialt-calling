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



export const RegexConfig = {
  name: /^[A-Za-z\s.'-]+$/, 
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
  phone: /^\+?[0-9\s-()]{7,20}$/, 
  linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i, 
  
};


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


export const DUMMY_API_DELAY_MS = 500; 
export const GOOGLE_MAPS_API_KEY = "AIzaSyBh1L-uMjj_IvmDwGKkfUL5pMpaIxyu1t0";


export const CITIES_DATA = [
  { id: 'mumbai', name: 'Mumbai', population: 3085411, lat: 19.0760, lng: 72.8777, malePopulation: 1684608, femalePopulation: 1400803 }, 
  { id: 'delhi', name: 'Delhi', population: 22277000, lat: 28.7041, lng: 77.1025, malePopulation: 11835000, femalePopulation: 10442000 }, 
  { id: 'kolkata', name: 'Kolkata', population: 4496694, lat: 22.5726, lng: 88.3639, malePopulation: 2356766, femalePopulation: 2139928 }, 
  { id: 'chennai', name: 'Chennai', population: 4646732, lat: 13.0827, lng: 80.2707, malePopulation: 2335844, femalePopulation: 2310888 }, 
  { id: 'bangalore', name: 'Bengaluru', population: 9621551, lat: 12.9716, lng: 77.5946, malePopulation: 5022661, femalePopulation: 4598890 }, 
];