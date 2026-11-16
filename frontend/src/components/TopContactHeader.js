import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiClock, FiPhone } from "react-icons/fi";
import { CONTACT, SOCIAL, buildWhatsappUrl } from "../data/siteLinks";

function TopContactHeader() {
  const whatsappUrl = buildWhatsappUrl();

  return (
    <div className="ssn-top-header">
      <style>{`
        .ssn-top-header {
          position: relative;
          z-index: 5001;
          background: linear-gradient(180deg, #1f3741 0%, #2d494e 100%);
          color: #ffffff;
          border-bottom: 1px solid rgba(255,255,255,0.14);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: none;
        }
        .ssn-top-header-inner {
          width: 100%;
          max-width: 1440px;
          min-height: 36px;
          margin: 0 auto;
          padding: 7px 28px 8px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
        }
        .ssn-top-header-section {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ssn-contact-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,0.92);
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.18s ease, opacity 0.18s ease;
        }
        .ssn-contact-link:hover {
          color: #f4c77d;
        }
        .ssn-contact-link svg,
        .ssn-social-link svg {
          width: 13px;
          height: 13px;
          flex-shrink: 0;
        }
        .ssn-top-header-separator {
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.22);
          flex: 0 0 auto;
        }
        .ssn-top-header-socials {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }
        .ssn-social-link {
          width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #fff;
          background: rgba(255,255,255,0.08);
          text-decoration: none;
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ssn-social-link:hover {
          background: #f4c77d;
          color: #0c1117;
          transform: translateY(-1px);
          box-shadow: 0 10px 18px rgba(244,199,125,0.2);
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
            font-size: 10px;
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
            font-size: 9px;
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
            href={`tel:${CONTACT.phoneTel}`}
            title="Appeler Star Mousse"
            onClick={() => {
              if (window.trackPhoneCall) {
                window.trackPhoneCall(CONTACT.phoneTel);
              }
            }}
          >
            <FiPhone /> <span>(+216) {CONTACT.phoneShort.replace(/\s/g, "")}</span>
          </a>
          <span className="ssn-top-header-separator" aria-hidden="true"></span>
          <span className="ssn-contact-link" title="Horaire">
            <FiClock /> <span>Lun - Sam 8h00 - 19h00 · Dim 8h00 - 14h00</span>
          </span>
        </div>

        <div className="ssn-top-header-socials" aria-label="Reseaux sociaux">
          {SOCIAL.facebook && <a
            className="ssn-social-link"
            href={SOCIAL.facebook}
            target="_blank"
            rel="nofollow noreferrer"
            title="Facebook"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>}
          {SOCIAL.instagram && <a
            className="ssn-social-link"
            href={SOCIAL.instagram}
            target="_blank"
            rel="nofollow noreferrer"
            title="Instagram"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>}
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
