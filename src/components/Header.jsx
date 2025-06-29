// src/components/Header.jsx
import React from 'react';
import { Filter, LogOut } from 'lucide-react'; // Import LogOut icon
import { Button } from './ui/Button';

const Header = ({ onLogout }) => { // Accept onLogout prop
  return (
    <header className="flex h-16 items-center justify-between border-b px-6 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-semibold text-gray-800">SMOOTHIRE</div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#" className="text-gray-600 hover:text-gray-900">Candidates</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Clients</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Openings</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Daily Tasks</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Queues</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Saved Searches</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Activity</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Emails</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Users</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Reporting</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Engagement Hub</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Filter className="h-5 w-5" />
        </Button>
        {onLogout && ( // Conditionally render logout button if onLogout prop is provided
          <Button variant="ghost" size="icon" onClick={onLogout} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
