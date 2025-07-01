// src/components/Modal.jsx
import React from "react";

/**
 * A generic modal component that can wrap any content.
 * It provides a backdrop, a centered container, and a close button.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal needs to be closed.
 * @param {string} [props.title] - Optional title to display at the top of the modal.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // If the modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  return (
    // Fixed overlay that covers the entire screen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 py-8"> {/* Added py-8 for vertical spacing */}
      {/* Modal content container */}
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative mx-4 max-h-[90vh] overflow-y-auto"> {/* Adjusted max-w, added max-h and overflow */}
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close modal" // Added for accessibility
        >
          &times; {/* HTML entity for a multiplication sign, commonly used as a close icon */}
        </button>

        {/* Optional Title */}
        {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}

        {/* Modal Body: This is where your NewEntryForm will be rendered */}
        <div>{children}</div>
      </div>
    </div>
  );
}
