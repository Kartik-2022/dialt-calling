// src/components/Header.jsx
import React from "react";
import { useAuth } from "../context/AuthContext"; 

const Header = ({ onEnablePushNotifications, onViewMap, onGoToAddressSearch }) => {
  const { logout } = useAuth(); 

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 mr-8">SMOOTHIRE</h1>

        
        <div className="flex space-x-4">
          <button
            onClick={onEnablePushNotifications}
            className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            One Signal
          </button>
          <button
            onClick={onViewMap}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
             Map
          </button>
          <button
            onClick={onGoToAddressSearch}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Address Search
          </button>
        </div>
      </div>

      
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
