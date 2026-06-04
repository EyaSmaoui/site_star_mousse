import React from "react";

function Footer() {
  const whatsappUrl =
    "https://wa.me/21622900207?text=Bonjour%20Star%20Mousse%2C%20je%20voudrais%20des%20informations%20sur%20vos%20matelas.";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

        .ssn-footer {
          font-family: 'DM Sans', sans-serif;
          background: #151522;
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
          height: 42px;
          object-fit: contain;
          display: block;
          margin-bottom: 16px;
        }
        .ssn-footer-desc {
          font-size: 13.5px;
          line-height: 1.75;
          color: #d9d7d2;
          max-width: 320px;
          margin-bottom: 24px;
        }
        .ssn-social {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ssn-social a {
          min-width: 40px;
          height: 40px;
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
          width: 20px;
          height: 20px;
          font-size: 18px;
          line-height: 1;
        }
        .ssn-social a:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.18);
          border-color: transparent;
        }
        .ssn-social a.wa:hover { background: #25D366; }
        .ssn-social a.call:hover { background: #b52f2f; }
        .ssn-social a.fb:hover { background: #1877F2; }
        .ssn-social a.ig:hover { background: #E1306C; }
        .ssn-social a.yt:hover { background: #FF0000; }
        .ssn-footer-col h4 {
          font-size: 12px;
          font-weight: 700;
          color: #f4c84f;
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
          color: #d9d7d2;
          display: inline-flex;
          align-items: center;
          transition: color 0.18s;
        }
        .ssn-footer-col ul a::before {
          content: '';
          width: 0;
          height: 1.5px;
          background: #f4c84f;
          transition: width 0.2s, margin-right 0.2s;
          display: inline-block;
        }
        .ssn-footer-col ul a:hover { color: #f4c84f; }
        .ssn-footer-col ul a:hover::before {
          width: 10px;
          margin-right: 7px;
        }
        .ssn-footer-bottom-wrap {
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.18);
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
          color: #b8b6c0;
          margin: 0;
        }
        .ssn-footer-bottom p span { color: #f4c84f; font-weight: 700; }
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
        <div className="ssn-footer-main">
          <div className="ssn-footer-col">
            <div className="ssn-footer-logo">
              <img src="/logo-star-mousse.png" alt="Star Mousse" />
            </div>
            <p className="ssn-footer-desc">
              Expert tunisien du sommeil. Matelas orthopediques, oreillers et literie premium
              avec conseil showroom, livraison en Tunisie et paiement a la livraison.
            </p>
            <div className="ssn-social">
              <a href={whatsappUrl} className="wa" aria-label="Contacter Star Mousse sur WhatsApp">
                <span className="ssn-social-icon ti ti-brand-whatsapp" aria-hidden="true"></span>
                WhatsApp
              </a>
              <a href="tel:+21622900131" className="call" aria-label="Appeler Star Mousse">
                <span className="ssn-social-icon ti ti-phone" aria-hidden="true"></span>
                Appeler
              </a>
              <a href="https://www.facebook.com/SuperSiestaBorjChakir/" className="fb" target="_blank" rel="noreferrer" aria-label="Facebook Super Siesta Borj Chakir" title="Facebook">
                <span className="ssn-social-icon ti ti-brand-facebook" aria-hidden="true"></span>
              </a>
              <a href="https://www.instagram.com/super_siesta_tunis/" className="ig" target="_blank" rel="noreferrer" aria-label="Instagram Super Siesta Tunis" title="Instagram">
                <span className="ssn-social-icon ti ti-brand-instagram" aria-hidden="true"></span>
              </a>
              <a href="https://www.youtube.com/@StarMousseTunisie" className="yt" target="_blank" rel="noreferrer" aria-label="YouTube Star Mousse" title="YouTube">
                <span className="ssn-social-icon ti ti-brand-youtube" aria-hidden="true"></span>
              </a>
            </div>
          </div>

          <div className="ssn-footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/products">Nos produits</a></li>
              <li><a href="/nos-matelas">Nos matelas</a></li>
              <li><a href="/promos">Promotions</a></li>
              <li><a href="/about">Notre histoire</a></li>
            </ul>
          </div>

          <div className="ssn-footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Livraison & retours</a></li>
              <li><a href="/help">Garantie</a></li>
              <li><a href="/nos-matelas">Guide des tailles</a></li>
              <li><a href={whatsappUrl}>Contactez-nous</a></li>
            </ul>
          </div>

          <div className="ssn-footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+21622900131">+216 22 900 131</a></li>
              <li><a href={whatsappUrl}>WhatsApp +216 22 900 207</a></li>
              <li><a href="/contact">Formulaire de contact</a></li>
              <li><a href="https://www.google.com/maps/search/?api=1&query=Borj%20Chakir%20Tunisie">Borj Chakir, Tunisie</a></li>
              <li><a href="/help">Lun-Sam : 8h-18h</a></li>
            </ul>
          </div>
        </div>

        <div className="ssn-footer-bottom-wrap">
          <div className="ssn-footer-bottom">
            <p>© 2026 <span>Star Mousse</span> - Fabrique avec passion en Tunisie.</p>
            <div className="ssn-legal">
              <a href="/legal-terms">Mentions légales</a>
              <div className="ssn-legal-dot"></div>
              <a href="/privacy-policy">Confidentialité</a>
              <div className="ssn-legal-dot"></div>
              <a href="/legal-terms">CGV</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
