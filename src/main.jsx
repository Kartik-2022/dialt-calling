// src/main.jsx (Reverted)
import React from 'react';
import ReactDOM from 'react-dom/client'; // Keep react-dom/client if your package.json has React 18
import App from './App';
import './index.css'; // Your global CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
