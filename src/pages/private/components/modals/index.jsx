// src/components/Modal.jsx
import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 py-8"> {/* Added py-8 for vertical spacing */}
      
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative mx-4 max-h-[90vh] overflow-y-auto"> {/* Adjusted max-w, added max-h and overflow */}
       
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close modal" 
        >
          &times; 
        </button>

        
        {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}

        
        <div>{children}</div>
      </div>
    </div>
  );
}
