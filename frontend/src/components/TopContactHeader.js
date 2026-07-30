import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiClock, FiPhone } from "react-icons/fi";

function TopContactHeader() {
  const phoneNumber = "+21622900131";
  const whatsappUrl = "https://wa.me/21622900131";

  return (
    <div className="ssn-top-header">
      <style>{`
        .ssn-top-header {
          background: #0a0a0a;
          color: #ffffff;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          font-size: 13px;
          font-weight: 700;
          position: relative;
          z-index: 5001;
        }
        .ssn-top-header-inner {
          width: 100%;
          max-width: 1440px;
          min-height: 38px;
          margin: 0 auto;
          padding: 7px 40px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
        }
        .ssn-top-header-section {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ssn-contact-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #ffffff;
          opacity: 0.94;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.18s ease, opacity 0.18s ease;
        }
        .ssn-contact-link:hover {
          color: #f5d78e;
          opacity: 1;
        }
        .ssn-contact-link svg,
        .ssn-social-link svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .ssn-top-header-separator {
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.28);
          flex: 0 0 auto;
        }
        .ssn-top-header-socials {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }
        .ssn-social-link {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #ffffff;
          background: rgba(255,255,255,0.1);
          text-decoration: none;
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
        }
        .ssn-social-link:hover {
          background: #ffffff;
          color: #0a0a0a;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .ssn-top-header-inner {
            grid-template-columns: 1fr;
            justify-items: center;
            padding: 8px 12px;
            gap: 6px;
          }
          .ssn-top-header-section {
            justify-content: center;
            gap: 8px;
          }
          .ssn-contact-link {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .ssn-top-header-inner {
            padding: 7px 8px;
          }
          .ssn-top-header-section {
            gap: 7px;
          }
          .ssn-contact-link {
            font-size: 10.5px;
          }
          .ssn-top-header-separator {
            display: none;
          }
        }
      `}</style>

      <div className="ssn-top-header-inner">
        <div className="ssn-top-header-section">
          <a
            className="ssn-contact-link"
            href={`tel:${phoneNumber}`}
            title="Appeler Star Mousse"
            onClick={() => {
              if (window.trackPhoneCall) {
                window.trackPhoneCall(phoneNumber);
              }
            }}
          >
            <FiPhone /> <span>(+216) 22900131</span>
          </a>
          <span className="ssn-top-header-separator" aria-hidden="true"></span>
          <span className="ssn-contact-link" title="Horaire">
            <FiClock /> <span>Lun - Sam 8h00 - 19h00</span>
          </span>
        </div>

        <div className="ssn-top-header-socials" aria-label="Reseaux sociaux">
          <a
            className="ssn-social-link"
            href="https://www.facebook.com/superstar.mousse"
            target="_blank"
            rel="nofollow noreferrer"
            title="Facebook"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            className="ssn-social-link"
            href="https://www.instagram.com/superstar.mousse/"
            target="_blank"
            rel="nofollow noreferrer"
            title="Instagram"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            className="ssn-social-link"
            href={whatsappUrl}
            target="_blank"
            rel="nofollow noreferrer"
            title="Whatsapp"
            aria-label="Whatsapp"
            onClick={() => {
              if (window.trackWhatsApp) {
                window.trackWhatsApp("general-inquiry", "TopContactHeader");
              }
            }}
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopContactHeader;
