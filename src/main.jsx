// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right" 
      reverseOrder={false} 
      toastOptions={{
        duration: 3000, 
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          style: {
            background: '#4CAF50', 
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#F44336', 
            color: '#fff',
          },
        },
      }}
    />
  </React.StrictMode>,
);
