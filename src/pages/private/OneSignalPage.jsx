// src/pages/private/OneSignalPage.jsx
import React, { useState, useCallback } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { enablePushNotifications, setEmailSubscription, logoutEmailSubscription } from '../../utils/oneSignalHelpers';
import toast from 'react-hot-toast'; 

const OneSignalPage = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  
  const [showEmailSection, setShowEmailSection] = useState(false);

  const handleEnablePush = useCallback(() => {
    enablePushNotifications();
    setShowEmailSection(true); 
    toast.success("Push notifications enabled! You can now subscribe to email notifications.");
  }, []);

  const handleEmailSubscribe = useCallback(async () => {
    if (emailInput) {
      await setEmailSubscription(emailInput);
      setEmailInput('');
      toast.success('Email subscribed successfully!');
    } else {
      toast.error("Please enter an email address to subscribe.");
    }
  }, [emailInput]);

  const handleEmailUnsubscribe = useCallback(async () => {
    await logoutEmailSubscription();
    setEmailInput('');
    toast.success('Email unsubscribed successfully!');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">One Signal Settings</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Push Notifications Section - Always visible */}
        <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-white">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Push Notifications</h4>
          <button
            onClick={handleEnablePush}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Enable Push Notifications
          </button>
        </div>

        {/* Email Subscription Section - Conditionally rendered */}
        {showEmailSection && (
          <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-white">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Email Notifications</h4>
            <input
              type="email"
              placeholder="Enter your email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleEmailSubscribe}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Subscribe Email
              </button>
              <button
                onClick={handleEmailUnsubscribe}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Unsubscribe Email
              </button>
            </div>
          </div>
        )}

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
}

export default OneSignalPage;
