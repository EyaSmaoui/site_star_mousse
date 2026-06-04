import { useState } from 'react';

export const useSuccessAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Success!');

  const showSuccess = (msg = 'Opération réussie!', modalTitle = 'Success!') => {
    setTitle(modalTitle);
    setMessage(msg);
    setIsOpen(true);
  };

  const closeSuccess = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    message,
    title,
    showSuccess,
    closeSuccess,
  };
};
