// src/components/AddEntryModal.jsx
import React from 'react';
import Modal from './Modal'; // Import the generic Modal component from the same directory
import NewEntryForm from '../pages/private/NewEntryForm'; // Correct path to NewEntryForm within private folder

export default function AddEntryModal({ isOpen, toggle, onSuccess }) {
  const handleSuccessfulSubmission = () => {
    onSuccess(); 
    toggle();   
  };

  return (
    <Modal isOpen={isOpen} onClose={toggle} title="Add New Entry">
      <NewEntryForm onSuccessfulSubmission={handleSuccessfulSubmission} />
    </Modal>
  );
}
