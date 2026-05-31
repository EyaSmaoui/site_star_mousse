import React, { useState, useEffect } from 'react';

const CookiesModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookiesAccepted', 'all');
    setIsOpen(false);
  };

  const handleSettings = () => {
    localStorage.setItem('cookiesAccepted', 'settings');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={handleSettings}>✕</button>

        <div style={styles.header}>
          <h1 style={styles.logo}>🌟 Star Mousse</h1>
        </div>

        <h2 style={styles.title}>Paramètres de confidentialité</h2>

        <div style={styles.content}>
          <p style={styles.text}>
            Nous utilisons des cookies et des technologies similaires nécessaires au fonctionnement du site web.
            Des cookies tiers supplémentaires sont utilisés pour améliorer notre service et vous fournir du contenu et
            des publicités personnalisées avec votre consentement.
          </p>

          <div style={styles.links}>
            <a href="#" style={styles.link}>Politique de confidentialité et de cookie</a>
            <span style={styles.separator}>•</span>
            <a href="#" style={styles.link}>Empreinte</a>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.buttonSecondary}
            onClick={handleSettings}
          >
            Paramétrer
          </button>
          <button
            style={styles.buttonPrimary}
            onClick={handleAcceptAll}
          >
            Tout Accepter
          </button>
        </div>
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
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '520px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'slideUp 0.3s ease',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#9ca3af',
    transition: 'color 0.2s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f97316',
    margin: 0,
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 16px 0',
  },
  content: {
    marginBottom: '24px',
  },
  text: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    flexWrap: 'wrap',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  separator: {
    color: '#d1d5db',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  buttonPrimary: {
    padding: '12px 24px',
    background: '#f97316',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonSecondary: {
    padding: '12px 24px',
    background: '#fff',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default CookiesModal;
