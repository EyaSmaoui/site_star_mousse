import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const faqs = [
  {
    q: "Comment choisir le bon matelas ?",
    hint: "Conseil personnalisé",
    a: "Utilisez notre Quiz Sommeil sur la page d'accueil. Il analyse votre morphologie pour vous recommander la gamme Medico ou Soft Plus.",
    accent: "#7F77DD",
    accentLight: "#EEEDFE",
    num: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 10h20" />
        <path d="M7 16h2M11 16h6" />
      </svg>
    ),
  },
  {
    q: "Délais de livraison en Tunisie ?",
    hint: "Expédition & logistique",
    a: "Nous livrons sous 48h à 72h dans tout le pays. La livraison est offerte dès 199 DT d'achat.",
    accent: "#1D9E75",
    accentLight: "#E1F5EE",
    num: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 5v4h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    q: "Facilités de paiement disponibles ?",
    hint: "Paiement & financement",
    a: "Dans notre showroom, vous pouvez payer par chèque ou par traite jusqu'à 4 fois sans frais.",
    accent: "#D85A30",
    accentLight: "#FAECE7",
    num: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#D85A30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="1" y="4" width="22" height="16" rx="3" />
        <path d="M1 10h22" />
        <path d="M6 15h4M16 15h2" />
      </svg>
    ),
  },
  {
    q: "Quelle est la durée de garantie ?",
    hint: "Garantie & SAV",
    a: "Tous nos matelas orthopédiques bénéficient d'une garantie d'usine de 10 ans contre tout affaissement.",
    accent: "#BA7517",
    accentLight: "#FAEEDA",
    num: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const Help = () => {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    // Animation supprimée pour simplifier
  }, []);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ssn-page { background: #ffffff; font-family: 'DM Sans', sans-serif; color: #2a2a3d; }

        .ssn-fade { opacity: 1; transform: none; }

        /* ── HERO ── */
        .ssn-help-hero {
          text-align: center; padding: 110px 40px 90px;
          border-bottom: 1px solid #ebebf5;
        }
        .ssn-help-hero-inner { max-width: 680px; margin: 0 auto; }
        .ssn-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: #f3f3fb; color: #4a4ade; border: 1px solid #ddddf0;
          font-size: 13px; font-weight: 500; padding: 7px 15px;
          border-radius: 50px; margin-bottom: 28px; letter-spacing: 0.1px;
        }
        .ssn-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 700; color: #1a1a2e; line-height: 1.18;
          letter-spacing: -0.5px; margin-bottom: 20px;
        }
        .ssn-hero-title em { color: #4a4ade; font-style: italic; }
        .ssn-hero-desc { font-size: 16px; line-height: 1.75; color: #60607a; max-width: 520px; margin: 0 auto; }

        /* ── FAQ SECTION ── */
        .ssn-section-faq {
          background: #f8f8fd; border-bottom: 1px solid #ebebf5; padding: 80px 40px;
        }
        .ssn-container { max-width: 1100px; margin: 0 auto; }
        .ssn-section-header { text-align: center; margin-bottom: 52px; }
        .ssn-section-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700; color: #1a1a2e; margin-bottom: 10px; letter-spacing: -0.3px;
        }
        .ssn-section-header p { font-size: 15px; color: #9090b0; }

        .ssn-faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px; max-width: 900px; margin: 0 auto;
        }

        /* ── FAQ CARD ── */
        .ssn-faq-card {
          background: #fff;
          border: 1px solid #ebebf5;
          border-radius: 20px;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          margin-bottom: 16px;
        }

        /* top content area */
        .ssn-faq-top { padding: 22px 20px 16px; display: flex; flex-direction: column; gap: 14px; }

        /* icon + meta + toggle row */
        .ssn-faq-head { display: flex; align-items: center; gap: 12px; }

        .ssn-faq-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--faq-accent-light);
        }

        .ssn-faq-meta { flex: 1; min-width: 0; }
        .ssn-faq-hint {
          font-size: 10.5px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.09em; color: var(--faq-accent); margin-bottom: 4px;
        }
        .ssn-faq-q {
          font-size: 14px; font-weight: 600; color: #1a1a2e; line-height: 1.4;
        }

        /* toggle button */
        .ssn-faq-toggle {
          width: 26px; height: 26px; border-radius: 50%;
          border: 1px solid #e0e0f0; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #9090b0;
        }
        .ssn-faq-toggle svg { width: 12px; height: 12px; }

        /* answer - simple show/hide */
        .ssn-faq-answer-wrap {
          border-top: 1px solid #f0f0f8;
        }
        .ssn-faq-answer {
          margin: 0 20px;
          padding: 14px 0 20px;
          font-size: 13.5px; color: #333; line-height: 1.75;
          background: #f9f9f9;
          border-radius: 8px;
          padding: 16px;
          margin: 16px;
          border-left: 4px solid var(--faq-accent);
        }

        /* ── CONTACT ── */
        .ssn-section-contact { padding: 80px 40px; background: #fff; }
        .ssn-contact-card {
          max-width: 860px; margin: 0 auto;
          background: #f8f8fd; border: 1px solid #ebebf5;
          border-radius: 24px; padding: 52px 60px;
          display: flex; flex-wrap: wrap; align-items: center;
          gap: 36px; position: relative; overflow: hidden;
        }
        .ssn-contact-card::before {
          content: ''; position: absolute; top: -60px; right: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, #eeeeff 0%, transparent 70%);
          pointer-events: none;
        }
        .ssn-contact-text { flex: 1; min-width: 240px; position: relative; z-index: 1; }
        .ssn-contact-text h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; font-weight: 700; color: #1a1a2e;
          margin-bottom: 10px; letter-spacing: -0.2px;
        }
        .ssn-contact-text p { font-size: 14px; color: #9090b0; line-height: 1.6; }
        .ssn-contact-hours {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff; border: 1px solid #ebebf5;
          border-radius: 8px; padding: 6px 12px;
          font-size: 12.5px; color: #60607a; margin-top: 12px;
        }
        .ssn-contact-hours span { color: #4a4ade; font-weight: 600; }
        .ssn-contact-actions { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }

        .ssn-btn-secondary {
          background: #fff; color: #2a2a3d; border: 1.5px solid #ddddf0;
          padding: 13px 24px; border-radius: 11px; font-size: 14px;
          font-weight: 500; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .ssn-btn-secondary:hover { border-color: #4a4ade; color: #4a4ade; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .ssn-help-hero { padding: 80px 24px 60px; }
          .ssn-section-faq, .ssn-section-contact { padding: 60px 24px; }
          .ssn-faq-grid { grid-template-columns: 1fr; }
          .ssn-contact-card { padding: 36px 28px; }
          .ssn-contact-actions { width: 100%; }
          .ssn-btn-secondary { width: 100%; text-align: center; }
        }
      `}</style>

      <div className="ssn-page">
        <NavBar />

        {/* ── HERO ── */}
        <section className="ssn-help-hero">
          <div className="ssn-help-hero-inner ssn-fade">
            <div className="ssn-badge">💬 Centre d'aide</div>
            <h1 className="ssn-hero-title">
              Besoin d'<em>assistance</em> ?
            </h1>
            <p className="ssn-hero-desc">
              Retrouvez les réponses à vos questions les plus fréquentes
              sur nos produits et services.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="ssn-section-faq">
          <div className="ssn-container">
            <header className="ssn-section-header ssn-fade">
              <h2>Questions fréquentes</h2>
              <p>Cliquez sur une carte pour découvrir la réponse</p>
            </header>

            <div className="ssn-faq-grid">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="ssn-faq-card"
                  style={{
                    "--faq-accent": faq.accent,
                    "--faq-accent-light": faq.accentLight,
                  }}
                  onClick={() => toggle(i)}
                >
                  {/* Top area */}
                  <div className="ssn-faq-top">
                    <div className="ssn-faq-head">
                      <div className="ssn-faq-icon-wrap">{faq.icon}</div>
                      <div className="ssn-faq-meta">
                        <div className="ssn-faq-hint">{faq.hint}</div>
                        <div className="ssn-faq-q">{faq.q}</div>
                      </div>
                      <div className="ssn-faq-toggle">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="6" y1="1" x2="6" y2="11" />
                          <line x1="1" y1="6" x2="11" y2="6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {openIndex === i && (
                    <div className="ssn-faq-answer-wrap">
                      <div className="ssn-faq-answer">{faq.a}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="ssn-section-contact">
          <div className="ssn-contact-card ssn-fade">
            <div className="ssn-contact-text">
              <h3>Vous ne trouvez pas votre réponse ?</h3>
              <p>
                Notre équipe est là pour vous aider. Contactez-nous directement
                ou faites le quiz pour trouver votre matelas idéal.
              </p>
              <div className="ssn-contact-hours">
                🕐 Disponible <span>lun – sam</span> · 8h à 18h
              </div>
            </div>
            <div className="ssn-contact-actions">
              <button className="ssn-btn-secondary" onClick={() => navigate("/quiz")}>
                Faire le quiz sommeil →
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Help;
