import React, { useState, useEffect } from 'react';

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const promoSeen = localStorage.getItem('promoSeen');
    const lastPromoTime = localStorage.getItem('lastPromoTime');
    const now = Date.now();

    if (!promoSeen || (lastPromoTime && now - parseInt(lastPromoTime) > 24 * 60 * 60 * 1000)) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('promoSeen', 'true');
    localStorage.setItem('lastPromoTime', Date.now().toString());
    setIsOpen(false);
  };

  const handleCategoryClick = (category) => {
    handleClose();
    window.location.href = `/products?category=${category}`;
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={handleClose}>✕</button>

        <div style={styles.imageContainer}>
          <div style={styles.imagePlaceholder}>
            🛏️ Produits Star Mousse
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.logo}>Star Mousse</div>

          <h2 style={styles.promoTitle}>
            Jusqu'à -50% + -10% en plus :
          </h2>
          <h3 style={styles.promoSubtitle}>
            Promos des Beaux Jours
          </h3>

          <p style={styles.description}>
            Dites-nous ce dont vous avez besoin pour passer une nuit parfaite :
          </p>

          <div style={styles.categories}>
            <button
              style={styles.categoryBtn}
              onClick={() => handleCategoryClick('matelas')}
            >
              🛏️ Matelas
            </button>
            <button
              style={styles.categoryBtn}
              onClick={() => handleCategoryClick('ensembles')}
            >
              📦 Ensembles et packs
            </button>
            <button
              style={styles.categoryBtn}
              onClick={() => handleCategoryClick('lits')}
            >
              🪑 Lits
            </button>
            <button
              style={styles.categoryBtn}
              onClick={() => handleCategoryClick('accessoires')}
            >
              ✨ Accessoires
            </button>
          </div>
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
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9998,
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    maxWidth: '480px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
    animation: 'slideUp 0.3s ease',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '36px',
    height: '36px',
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  imageContainer: {
    width: '100%',
    height: '240px',
    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imagePlaceholder: {
    color: '#fff',
    fontSize: '48px',
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    padding: '32px 24px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#f97316',
    margin: '0 0 16px 0',
  },
  promoTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0',
    lineHeight: '1.3',
  },
  promoSubtitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f97316',
    margin: '0 0 16px 0',
  },
  description: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 24px 0',
    lineHeight: '1.5',
  },
  categories: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },
  categoryBtn: {
    padding: '16px 20px',
    background: '#f97316',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

export default PromoModal;
