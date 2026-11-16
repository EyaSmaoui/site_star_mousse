import React, { useEffect, useState } from "react";

const STORAGE_KEY = "starMousse-cookie-preferences";

const CookiesModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = window.setTimeout(() => setIsOpen(true), 600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const savePreferences = (accepted) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accepted, analytics: accepted, timestamp: Date.now() })
    );
    window.dispatchEvent(new CustomEvent("cookie-preferences-saved", { detail: { analytics: accepted } }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} role="presentation">
      <div style={styles.modal} role="dialog" aria-modal="true" aria-labelledby="cookie-title" onClick={(event) => event.stopPropagation()}>
        <div style={styles.content}>
          <div style={styles.badge}>Cookies</div>
          <h3 id="cookie-title" style={styles.title}>Nous utilisons des cookies</h3>
          <p style={styles.text}>
            Nous utilisons des cookies pour améliorer votre expérience, analyser
            l&apos;usage du site et personnaliser les recommandations.
          </p>
          <a href="/privacy-policy" style={styles.privacyLink}>Lire la politique de confidentialité</a>
          <div style={styles.actions}>
            <button style={styles.secondary} onClick={() => savePreferences(false)}>
              Essentiels uniquement
            </button>
            <button style={styles.primary} onClick={() => savePreferences(true)}>
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(10, 10, 10, 0.52)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 9999,
    padding: "18px",
  },
  modal: {
    width: "min(560px, 100%)",
    maxHeight: "calc(100dvh - 36px)",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: "18px 18px 12px 12px",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.18)",
    border: "1px solid rgba(15, 79, 67, 0.08)",
  },
  content: {
    padding: "22px 22px 18px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "28px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "var(--sm-primary, #b85c38)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  title: {
    margin: 0,
    fontSize: "1.45rem",
    color: "#0a0a0a",
    fontWeight: 800,
  },
  text: {
    margin: "12px 0 20px",
    color: "#5f6763",
    lineHeight: 1.6,
    fontSize: "0.97rem",
  },
  privacyLink: {
    display: "inline-block",
    marginBottom: "18px",
    color: "#8f4028",
    textDecoration: "underline",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  primary: {
    border: "none",
    background: "var(--sm-primary, #b85c38)",
    color: "#ffffff",
    borderRadius: "999px",
    minHeight: "44px",
    padding: "0 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondary: {
    border: "1px solid #dfe5e2",
    background: "#ffffff",
    color: "#0a0a0a",
    borderRadius: "999px",
    minHeight: "44px",
    padding: "0 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
};

export default CookiesModal;
