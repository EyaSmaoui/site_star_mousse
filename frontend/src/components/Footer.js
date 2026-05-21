import React from "react";

function Footer() {
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

        /* ── MAIN ── */
        .ssn-footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 68px 40px 56px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
        }

        /* Brand */
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
          max-width: 290px;
          margin-bottom: 24px;
        }

        /* Social icons */
        .ssn-social {
          display: flex;
          gap: 10px;
        }
        .ssn-social a {
          width: 40px; height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s, background 0.18s;
        }
        .ssn-social a:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.12);
          border-color: transparent;
        }
        .ssn-social a.fb:hover { background: #1877F2; }
        .ssn-social a.fb:hover path { fill: #fff; }
        .ssn-social a.ig:hover { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); }
        .ssn-social a.ig:hover path { fill: #fff; }
        .ssn-social a.tt:hover { background: #010101; }
        .ssn-social a.tt:hover path { fill: #fff; }
        .ssn-social a.wa:hover { background: #25D366; }
        .ssn-social a.wa:hover path { fill: #fff; }

        /* Columns */
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
          padding: 0; margin: 0;
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

        /* ── BOTTOM ── */
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
        }
        .ssn-footer-bottom p span { color: #f4c84f; font-weight: 700; }
        .ssn-legal {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .ssn-legal a {
          font-size: 13px;
          color: #b8b6c0;
          text-decoration: none;
          transition: color 0.18s;
        }
        .ssn-legal a:hover { color: #ffffff; }
        .ssn-legal-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.24);
        }

        /* ── RESPONSIVE ── */
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
        }
      `}</style>

      <footer className="ssn-footer">
        <div className="ssn-footer-main">

          {/* Brand */}
          <div className="ssn-footer-col">
            <div className="ssn-footer-logo">
              <img src="/logo-star-mousse.png" alt="Star Mousse" />
            </div>
            <p className="ssn-footer-desc">
              Expert tunisien du sommeil depuis des générations. Nous concevons des matelas
              qui allient technologie de pointe et confort traditionnel.
            </p>
            <div className="ssn-social">
              {/* Facebook */}
              <a href="#" className="fb" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="ig" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#E1306C"/></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="tt" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" fill="#010101"/></svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="wa" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="ssn-footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/products">Nos Matelas</a></li>
              <li><a href="/about">Notre Histoire</a></li>
              <li><a href="/help">Aide & SAV</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="ssn-footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Livraison & Retours</a></li>
              <li><a href="#">Garantie 10 ans</a></li>
              <li><a href="#">Guide des tailles</a></li>
              <li><a href="#">Contactez-nous</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="ssn-footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+21622900131">+216 22 900 131</a></li>
              <li><a href="mailto:starmousse@gmail.com">starmousse@gmail.com</a></li>
              <li><a href="#">Borj Chakir, Tunisie</a></li>
              <li><a href="#">Lun-Sam : 8h-18h</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="ssn-footer-bottom-wrap">
          <div className="ssn-footer-bottom">
            <p>© 2026 <span>Star Mousse</span> - Fabriqué avec passion en Tunisie.</p>
            <div className="ssn-legal">
              <a href="#">Mentions Légales</a>
              <div className="ssn-legal-dot"></div>
              <a href="#">Confidentialité</a>
              <div className="ssn-legal-dot"></div>
              <a href="#">CGV</a>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}

export default Footer;
