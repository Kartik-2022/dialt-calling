// src/components/AddEntryModal.jsx
import React from 'react';
import Modal from './Modal'; // Import the generic Modal component from the same directory
import NewEntryForm from '../pages/private/NewEntryForm'; // Correct path to NewEntryForm within private folder

/**
 * A specific modal component for adding new entries.
 * It uses the generic Modal component and renders the NewEntryForm inside it.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the visibility of this modal.
 * @param {function} props.toggle - Function to call to close this modal.
 * @param {function} props.onSuccess - Function to call after a successful form submission.
 */
export default function AddEntryModal({ isOpen, toggle, onSuccess }) {
  // The onSuccessfulSubmission prop for NewEntryForm will now also close the modal
  const handleSuccessfulSubmission = () => {
    onSuccess(); // Call the parent's success handler (e.g., to refresh dashboard data)
    toggle();    // Close the modal
  };

  return (
    <Modal isOpen={isOpen} onClose={toggle} title="Add New Entry">
      {/* Render the NewEntryForm inside the modal */}
      <NewEntryForm onSuccessfulSubmission={handleSuccessfulSubmission} />
    </Modal>
  );
}
