// src/pages/private/MapPage.jsx
import React from 'react';
import Header from '../../components/Header';
import PopulationMap from '../../components/PopulationMap';
import { useNavigate } from 'react-router-dom';

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Changed max-w-7xl to max-w-full or removed it, and adjusted padding */}
      <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Population Map</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>
        <PopulationMap />
      </div>
      <footer className="w-full bg-white border-t border-gray-200 py-4 px-6 flex justify-between items-center text-xs text-gray-500 mt-auto">
        <div>
          &copy; 2025 Smoothire.{" "}
          <a href="#" className="underline">
            Terms & Privacy
          </a>
        </div>
        <div>
          Powered By{" "}
          <a href="#" className="underline">
            Logic Source
          </a>
        </div>
      </footer>
    </div>
  );
};

export default MapPage;
