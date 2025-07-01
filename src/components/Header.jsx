// src/components/Header.jsx
import React from 'react';
import { LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Import Link

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold text-gray-800">SMOOTHIRE</span>
      </div>
      <div className="flex items-center space-x-4">
  
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
