// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { LogOut, LayoutDashboard } from 'lucide-react'; // Example icons
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation

const Header = () => {
  const { logout } = useAuth(); // Get the logout function from AuthContext

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-50 rounded-b-xl">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold text-gray-800">SMOOTHIRE</div>
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-gray-600 hover:text-indigo-600 flex items-center space-x-1 ${isActive ? 'font-semibold text-indigo-600' : ''}`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Logout Button */}
        <button
          onClick={logout} // Use the logout function from AuthContext
          className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-medium px-3 py-2 rounded-md transition duration-150 ease-in-out bg-red-50 hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
