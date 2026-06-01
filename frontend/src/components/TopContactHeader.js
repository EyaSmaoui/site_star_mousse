import React from 'react';
import { FiPhone, FiMessageCircle, FiMail, FiMapPin } from 'react-icons/fi';

function TopContactHeader() {
  const contactWhatsApp = () => {
    window.open('https://wa.me/21622900207', '_blank');
  };

  const contactPhone = () => {
    window.location.href = 'tel:+21622900131';
  };

  const contactEmail = () => {
    window.location.href = 'mailto:SUPERSIESTA3@GMAIL.COM';
  };

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
          white-space: nowrap;
        }

        .ssn-contact-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }

        .ssn-contact-btn svg {
          width: 14px;
          height: 14px;
        }

        .ssn-top-header-location {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.95;
        }

        .ssn-top-header-location svg {
          width: 14px;
          height: 14px;
        }

        @media (max-width: 768px) {
          .ssn-top-header {
            padding: 10px 16px;
            font-size: 12px;
            gap: 12px;
          }

          .ssn-top-header-section {
            gap: 8px;
          }

          .ssn-contact-btn {
            padding: 5px 10px;
            font-size: 11px;
          }

          .ssn-top-header-location {
            gap: 4px;
          }
        }
      `}</style>

      <div className="ssn-top-header-section">
        <button className="ssn-contact-btn" onClick={contactPhone} title="Appeler">
          <FiPhone /> 22.900.131
        </button>
        <button className="ssn-contact-btn" onClick={contactWhatsApp} title="WhatsApp">
          <FiMessageCircle /> WhatsApp: 22.900.207
        </button>
        <button className="ssn-contact-btn" onClick={contactEmail} title="Email">
          <FiMail /> SUPERSIESTA3@GMAIL.COM
        </button>
      </div>

      <div className="ssn-top-header-location">
        <FiMapPin />
        <span>📍 Borj Chakir, Tunisie</span>
      </div>
    </div>
  );
}

export default TopContactHeader;
