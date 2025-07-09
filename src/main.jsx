// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      refetchOnWindowFocus: true, 
      refetchOnMount: true, 
      refetchOnReconnect: true, 
      retry: 3, 
    },
  },
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
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
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
