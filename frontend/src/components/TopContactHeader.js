import React from "react";
import { FiPhone, FiMessageCircle, FiMail, FiMapPin } from "react-icons/fi";

function TopContactHeader() {
  const whatsappUrl =
    "https://wa.me/21622900207?text=Bonjour%20Star%20Mousse%2C%20je%20voudrais%20des%20informations%20sur%20vos%20matelas.";

  return (
    <div className="ssn-top-header">
      <style>{`
        .ssn-top-header {
          background: linear-gradient(135deg, #b52f2f 0%, #8f2424 100%);
          color: #ffffff;
          padding: 12px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          font-size: 13px;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
          position: sticky;
          top: 0;
          z-index: 5001;
        }
        .ssn-top-header-section {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ssn-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.15);
          border: none;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.2s ease;
          text-decoration: none;
          white-space: normal;
          min-width: 0;
          overflow-wrap: break-word;
        }
        .ssn-contact-btn:hover {
          background: rgba(255,255,255,0.25);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        .ssn-contact-btn svg,
        .ssn-top-header-location svg {
          width: 14px;
          height: 14px;
        }
        .ssn-top-header-location {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.95;
        }
        
        .contact-text {
          display: inline;
          word-break: break-word;
        }
        
        .contact-email {
          max-width: 150px;
        }
        
        @media (max-width: 768px) {
          .ssn-top-header {
            padding: 8px 12px;
            font-size: 11px;
            gap: 8px;
            flex-direction: column;
            align-items: stretch;
          }
          .ssn-top-header-section {
            gap: 6px;
            flex-direction: column;
            align-items: stretch;
          }
          .ssn-contact-btn {
            padding: 4px 8px;
            font-size: 10px;
            justify-content: center;
            flex-basis: 100%;
          }
          .ssn-top-header-location {
            font-size: 10px;
            justify-content: center;
            gap: 4px;
          }
          .ssn-top-header-location svg {
            width: 12px;
            height: 12px;
          }
        }
        
        @media (max-width: 480px) {
          .ssn-top-header {
            padding: 6px 8px;
            font-size: 9px;
            gap: 4px;
          }
          .ssn-top-header-section {
            gap: 4px;
          }
          .ssn-contact-btn {
            padding: 3px 6px;
            font-size: 9px;
          }
          .ssn-contact-btn svg {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>

      <div className="ssn-top-header-section">
        <a 
          className="ssn-contact-btn" 
          href="tel:+21622900131" 
          title="Appeler Star Mousse"
          onClick={() => {
            if (window.trackPhoneCall) {
              window.trackPhoneCall('+21622900131');
            }
          }}
        >
          <FiPhone /> <span className="contact-text">22.900.131</span>
        </a>
        <a 
          className="ssn-contact-btn" 
          href={whatsappUrl} 
          title="WhatsApp Star Mousse"
          onClick={() => {
            if (window.trackWhatsApp) {
              window.trackWhatsApp('general-inquiry', 'TopContactHeader');
            }
          }}
        >
          <FiMessageCircle /> <span className="contact-text">22.900.207</span>
        </a>
        <a 
          className="ssn-contact-btn" 
          href="/contact" 
          title="Email Star Mousse"
          onClick={() => {
            if (window.trackWhatsApp) {
              window.trackWhatsApp('email-inquiry', 'TopContactHeader');
            }
          }}
        >
          <FiMail /> <span className="contact-text contact-email">Email</span>
        </a>
        <a 
          className="ssn-contact-btn" 
          href="/contact" 
          title="Page Contact"
          onClick={() => {
            if (window.trackContactForm) {
              window.trackContactForm('page-contact-link');
            }
          }}
        >
          ✉️ Contact
        </a>
      </div>

      <a
        className="ssn-top-header-location"
        href="https://www.google.com/maps/search/?api=1&query=Borj%20Chakir%20Tunisie"
        style={{ color: "#ffffff", textDecoration: "none" }}
        onClick={() => {
          if (window.trackMapClick) {
            window.trackMapClick('Borj Chakir');
          }
        }}
      >
        <FiMapPin />
        <span>Borj Chakir, Tunisie</span>
      </a>
    </div>
  );
}

export default TopContactHeader;
