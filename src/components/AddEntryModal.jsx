// src/components/AddEntryModal.jsx
import React from 'react';
import Modal from './Modal';
import NewEntryForm from '../pages/private/NewEntryForm';

export default function AddEntryModal({ isOpen, toggle, onSuccess }) {
  return (
    <Modal isOpen={isOpen} onClose={toggle} title="Add New Entry">
      <NewEntryForm onSuccess={onSuccess} toggle={toggle} />
    </Modal>
  );
}
