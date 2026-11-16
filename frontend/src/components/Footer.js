import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { CONTACT, MAPS, ROUTES, SOCIAL, WHATSAPP_DEFAULT } from "../data/siteLinks";

function Footer() {
  const whatsappUrl = WHATSAPP_DEFAULT;

  return (
    <>
      <style>{`
        .ssn-footer {
          font-family: var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #153c37;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: #ffffff;
        }
        .ssn-footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 68px 40px 56px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
        }
        .ssn-footer-logo img {
          height: 44px;
          object-fit: contain;
          display: block;
          margin-bottom: 16px;
        }
        .ssn-footer-desc {
          font-size: 13.5px;
          line-height: 1.75;
          color: #f3e9dc;
          max-width: 320px;
          margin-bottom: 24px;
        }
        .ssn-social {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ssn-social a {
          min-width: 44px;
          min-height: 44px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s, background 0.18s;
        }
        .ssn-social a .ssn-social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          font-size: 16px;
          line-height: 1;
        }
        .ssn-social a.icon-only {
          width: 44px;
          padding: 0;
        }
        .ssn-social a:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.18);
          border-color: transparent;
        }
        .ssn-social a.wa:hover { background: #25D366; }
        .ssn-social a.call:hover { background: #c89b5b; color: #1f2d35; }
        .ssn-social a.fb:hover { background: #1877F2; }
        .ssn-social a.ig:hover { background: #E1306C; }
        .ssn-social a.yt:hover { background: #FF0000; }
        .ssn-footer-col h3 {
          font-size: 12px;
          font-weight: 700;
          color: #e4bf82;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 20px;
        }
        .ssn-footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ssn-footer-col ul a {
          text-decoration: none;
          font-size: 14px;
          color: #f3e9dc;
          display: inline-flex;
          align-items: center;
          transition: color 0.18s;
        }
        .ssn-footer-col ul a::before {
          content: '';
          width: 0;
          height: 1.5px;
          background: #e7c58f;
          transition: width 0.2s, margin-right 0.2s;
          display: inline-block;
        }
        .ssn-footer-col ul a:hover { color: #e7c58f; }
        .ssn-footer-col ul a:hover::before {
          width: 10px;
          margin-right: 7px;
        }
        .ssn-footer-bottom-wrap {
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.16);
        }
        .ssn-footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 18px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ssn-footer-bottom p {
          font-size: 13px;
          color: #d9eee5;
          margin: 0;
        }
        .ssn-footer-bottom p span { color: #e7c58f; font-weight: 700; }
        .ssn-legal {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .ssn-legal a {
          font-size: 13px;
          color: #b8b6c0;
          text-decoration: none;
          transition: color 0.18s;
        }
        .ssn-legal a:hover { color: #ffffff; }
        .ssn-legal-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.24);
        }
        @media (max-width: 960px) {
          .ssn-footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            padding: 40px 24px 32px;
          }
          .ssn-footer-bottom { padding: 16px 24px; }
        }
        @media (max-width: 560px) {
          .ssn-footer-main { grid-template-columns: 1fr; }
          .ssn-footer-desc { max-width: 100%; }
          .ssn-legal { gap: 10px; }
        }
      `}</style>

      <footer className="ssn-footer">
        <div className="ssn-footer-main container">
          <div className="ssn-footer-col">
            <div className="ssn-footer-logo">
              <img src="/logo-star-mousse.png" alt="Star Mousse" width="153" height="42" loading="lazy" decoding="async" />
            </div>
            <p className="ssn-footer-desc">
              Expert tunisien du sommeil. Matelas orthopediques, oreillers et literie premium
              avec conseil showroom, livraison en Tunisie et paiement a la livraison.
            </p>
            <div className="ssn-social">
              <a href={whatsappUrl} className="wa" aria-label="Contacter Star Mousse sur WhatsApp">
                <span className="ssn-social-icon" aria-hidden="true"><FaWhatsapp /></span>
                WhatsApp
              </a>
              <a href={`tel:${CONTACT.phoneTel}`} className="call" aria-label="Appeler Star Mousse">
                <span className="ssn-social-icon" aria-hidden="true"><FaPhoneAlt /></span>
                Appeler
              </a>
              {SOCIAL.facebook && <a href={SOCIAL.facebook} className="fb icon-only" target="_blank" rel="noreferrer" aria-label="Facebook Star Mousse" title="Facebook">
                <span className="ssn-social-icon" aria-hidden="true"><FaFacebookF /></span>
              </a>}
              {SOCIAL.instagram && <a href={SOCIAL.instagram} className="ig icon-only" target="_blank" rel="noreferrer" aria-label="Instagram Star Mousse" title="Instagram">
                <span className="ssn-social-icon" aria-hidden="true"><FaInstagram /></span>
              </a>}
              <a href={SOCIAL.youtube} className="yt icon-only" target="_blank" rel="noreferrer" aria-label="YouTube Star Mousse" title="YouTube">
                <span className="ssn-social-icon" aria-hidden="true"><FaYoutube /></span>
              </a>
            </div>
          </div>

          <div className="ssn-footer-col">
            <h3>Navigation</h3>
            <ul>
              <li><Link to={ROUTES.products}>Nos produits</Link></li>
              <li><Link to={ROUTES.matelas}>Nos matelas</Link></li>
              <li><Link to={ROUTES.promos}>Promotions</Link></li>
              <li><Link to={ROUTES.about}>Notre histoire</Link></li>
            </ul>
          </div>

          <div className="ssn-footer-col">
            <h3>Support</h3>
            <ul>
              <li><Link to={ROUTES.help}>Livraison & retours</Link></li>
              <li><Link to={ROUTES.help}>Garantie</Link></li>
              <li><a href={whatsappUrl}>Contactez-nous</a></li>
            </ul>
          </div>

          <div className="ssn-footer-col">
            <h3>Contact</h3>
            <ul>
              <li><a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a></li>
              <li><a href={whatsappUrl}>WhatsApp {CONTACT.whatsappDisplay}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><Link to={ROUTES.contact}>Formulaire de contact</Link></li>
              <li><a href={MAPS.showroomSearch}>Showroom Star Mousse, Borj Chakir, Tunis, Tunisie</a></li>
              <li><Link to={ROUTES.help}>Lun-Sam : 8h00-19h00</Link></li>
              <li><Link to={ROUTES.help}>Dimanche : 8h00-14h00</Link></li>
            </ul>
          </div>
        </div>

        <div className="ssn-footer-bottom-wrap">
          <div className="ssn-footer-bottom">
            <p>© 2026 <span>Star Mousse</span> - Fabrique avec passion en Tunisie.</p>
            <div className="ssn-legal">
              <Link to={ROUTES.legal}>Mentions légales</Link>
              <div className="ssn-legal-dot"></div>
              <Link to={ROUTES.privacy}>Confidentialité</Link>
              <div className="ssn-legal-dot"></div>
              <Link to={ROUTES.legal}>CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
