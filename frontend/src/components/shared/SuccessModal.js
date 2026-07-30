import React from 'react';

const SuccessModal = ({ isOpen, title = "Success!", message = "Your data has been saved. Thank you!", onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Checkmark Circle */}
        <div style={styles.iconContainer}>
          <div style={styles.circle}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="3" />
              <path
                d="M20 30L27 37L40 24"
                stroke="#4CAF50"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 style={styles.title}>{title}</h2>

        {/* Message */}
        <p style={styles.message}>{message}</p>

        {/* OK Button */}
        <button style={styles.okButton} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px 32px',
    maxWidth: '420px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  },
  iconContainer: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'center',
  },
  circle: {
    width: '90px',
    height: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: '0 0 12px',
    fontFamily: "'Syne', sans-serif",
  },
  message: {
    fontSize: '14px',
    color: '#666666',
    margin: '0 0 28px',
    lineHeight: '1.6',
    fontFamily: "'DM Sans', sans-serif",
  },
  okButton: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 32px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
};

export default SuccessModal;
