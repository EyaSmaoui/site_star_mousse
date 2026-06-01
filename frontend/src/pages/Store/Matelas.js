import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { FiCheckCircle, FiTruck, FiPhone, FiMessageCircle } from 'react-icons/fi';

function Matelas() {
  const navigate = useNavigate();

  const contactWhatsApp = () => {
    window.open('https://wa.me/21622900207?text=Bonjour%2C%20je%20suis%20intéressé%20par%20le%20Relax%20Plus', '_blank');
  };

  const contactPhone = () => {
    window.location.href = 'tel:+21622900131';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Playfair+Display:wght@600;700&display=swap');

        * { box-sizing: border-box; }

        .matelas-page {
          background: #fbfaf8;
          font-family: 'DM Sans', sans-serif;
          color: #242436;
        }

        .matelas-hero {
          background: linear-gradient(135deg, rgba(181,47,47,0.08) 0%, rgba(255,255,255,0.5) 100%);
          padding: 60px 40px;
          margin: 0 auto;
          max-width: 1280px;
        }

        .matelas-intro {
          text-align: center;
          margin-bottom: 50px;
        }

        .matelas-intro h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          color: #151522;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .matelas-intro .accent {
          color: #b52f2f;
          font-weight: 700;
        }

        .matelas-intro p {
          font-size: 16px;
          color: #555568;
          max-width: 680px;
          margin: 0 auto 12px;
          line-height: 1.7;
        }

        .matelas-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px;
        }

        .matelas-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 60px;
        }

        .matelas-image {
          position: relative;
        }

        .matelas-image img {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 28px 80px rgba(21,21,34,0.18);
          object-fit: cover;
        }

        .matelas-info h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          color: #151522;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .matelas-info p {
          font-size: 15px;
          color: #555568;
          margin-bottom: 24px;
          line-height: 1.8;
        }

        .matelas-features {
          margin-bottom: 32px;
        }

        .matelas-feature {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(255,255,255,0.6);
          border-radius: 8px;
          border: 1px solid rgba(181,47,47,0.1);
        }

        .matelas-feature svg {
          width: 20px;
          height: 20px;
          color: #b52f2f;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .matelas-feature strong {
          display: block;
          color: #151522;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .matelas-feature span {
          font-size: 13px;
          color: #6f7180;
        }

        .matelas-cta {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn-primary, .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
        }

        .btn-primary {
          background: #b52f2f;
          color: #fff;
        }

        .btn-primary:hover {
          background: #8f2424;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(181,47,47,0.3);
        }

        .btn-secondary {
          background: rgba(181,47,47,0.1);
          color: #b52f2f;
          border: 2px solid #b52f2f;
        }

        .btn-secondary:hover {
          background: rgba(181,47,47,0.2);
          transform: translateY(-2px);
        }

        .matelas-guarantee {
          background: linear-gradient(135deg, rgba(181,47,47,0.08) 0%, rgba(255,255,255,0.5) 100%);
          padding: 40px;
          border-radius: 16px;
          margin-bottom: 40px;
          border: 1px solid rgba(181,47,47,0.15);
        }

        .matelas-guarantee h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: #151522;
          margin-bottom: 20px;
        }

        .guarantee-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .guarantee-item svg {
          width: 24px;
          height: 24px;
          color: #b52f2f;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .guarantee-item strong {
          display: block;
          color: #151522;
          margin-bottom: 4px;
        }

        .guarantee-item span {
          font-size: 14px;
          color: #555568;
          line-height: 1.6;
        }

        .matelas-contact-card {
          background: #151522;
          color: #fff;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          margin-bottom: 60px;
        }

        .matelas-contact-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          margin-bottom: 20px;
        }

        .matelas-contact-card p {
          color: #d9d7d2;
          margin-bottom: 28px;
          font-size: 15px;
        }

        .contact-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .contact-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .contact-btn-whatsapp {
          background: #25D366;
          color: #fff;
        }

        .contact-btn-whatsapp:hover {
          background: #1fb851;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37,211,102,0.3);
        }

        .contact-btn-phone {
          background: #ff6b6b;
          color: #fff;
        }

        .contact-btn-phone:hover {
          background: #ff5252;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255,107,107,0.3);
        }

        @media (max-width: 768px) {
          .matelas-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .matelas-hero {
            padding: 40px 20px;
          }

          .matelas-container {
            padding: 24px;
          }

          .matelas-intro h1 {
            font-size: 2rem;
          }

          .matelas-info h2 {
            font-size: 1.6rem;
          }

          .matelas-cta {
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .contact-buttons {
            flex-direction: column;
          }

          .contact-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="matelas-page">
        <NavBar />

        {/* HERO */}
        <section className="matelas-hero">
          <div className="matelas-intro">
            <h1>Matelas Ergonomique <span className="accent">Relax Plus</span></h1>
            <p>Une expérience de sommeil premium conçue pour le bien-être et la santé</p>
          </div>
        </section>

        {/* CONTENU PRINCIPAL */}
        <div className="matelas-container">
          <div className="matelas-grid">
            <div className="matelas-image">
              <img src="/relax_eluproduit.jpg" alt="Matelas Relax Plus" />
            </div>

            <div className="matelas-info">
              <h2>Le Confort Que Vous Méritez</h2>
              <p>
                Le Matelas ergonomique Relax Plus n'est pas simplement un matelas ; 
                c'est une expérience de sommeil conçue pour offrir confort, soutien et tranquillité d'esprit.
              </p>

              <div className="matelas-features">
                <div className="matelas-feature">
                  <FiCheckCircle />
                  <div>
                    <strong>Soutien Ergonomique</strong>
                    <span>Maintien optimal de la colonne vertébrale</span>
                  </div>
                </div>
                <div className="matelas-feature">
                  <FiCheckCircle />
                  <div>
                    <strong>Mousse Haute Densité</strong>
                    <span>Confort durable et respirabilité renforcée</span>
                  </div>
                </div>
                <div className="matelas-feature">
                  <FiCheckCircle />
                  <div>
                    <strong>Adapté au Climat Tunisien</strong>
                    <span>Fabrication locale avec savoir-faire</span>
                  </div>
                </div>
                <div className="matelas-feature">
                  <FiCheckCircle />
                  <div>
                    <strong>Sommeil Profond</strong>
                    <span>Expérience de bien-être garantie</span>
                  </div>
                </div>
              </div>

              <div className="matelas-cta">
                <button className="btn-primary" onClick={contactWhatsApp}>
                  <FiMessageCircle /> WhatsApp: 22.900.207
                </button>
                <button className="btn-secondary" onClick={contactPhone}>
                  <FiPhone /> Appeler: 22.900.131
                </button>
              </div>
            </div>
          </div>

          {/* GARANTIE */}
          <div className="matelas-guarantee">
            <h3>🛡️ Garantie & Qualité</h3>
            <div className="guarantee-item">
              <FiCheckCircle />
              <div>
                <strong>Garantie 10 ans</strong>
                <span>Protection complète sur tous les matériaux et la structure</span>
              </div>
            </div>
            <div className="guarantee-item">
              <FiCheckCircle />
              <div>
                <strong>Paiement à la Livraison</strong>
                <span>Commandez en toute confiance, payez après réception</span>
              </div>
            </div>
            <div className="guarantee-item">
              <FiCheckCircle />
              <div>
                <strong>Livraison Gratuite</strong>
                <span>Service de livraison à domicile partout en Tunisie</span>
              </div>
            </div>
          </div>

          {/* CONTACT CTA */}
          <div className="matelas-contact-card">
            <h3>Prêt à transformer votre sommeil?</h3>
            <p>Contactez-nous dès maintenant pour en savoir plus ou passer votre commande</p>
            <div className="contact-buttons">
              <button className="contact-button contact-btn-whatsapp" onClick={contactWhatsApp}>
                <FiMessageCircle /> WhatsApp
              </button>
              <button className="contact-button contact-btn-phone" onClick={contactPhone}>
                <FiPhone /> Téléphone
              </button>
              <a href="mailto:SUPERSIESTA3@GMAIL.COM" className="contact-button" style={{backgroundColor: '#667eea'}}>
                📧 Email
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Matelas;
