import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const photos = [
  { src: '/showroom1.jpg', label: 'Vue principale' },
  { src: '/showroom2.jpg', label: 'Espace matelas' },
  { src: '/showroom3.jpg', label: 'Collection premium' },
  { src: '/showroom4.jpg', label: 'Détail produit' },
  { src: '/showroom5.jpg', label: 'Ambiance showroom' },
  { src: '/showroom6.jpg', label: 'Espace accueil' },
];

const values = [
  { icon: "🇹🇳", title: "Qualité Tunisienne", desc: "Tous nos matelas sont conçus avec des matériaux locaux de premier choix." },
  { icon: "🔬", title: "Innovation", desc: "Nous utilisons la science du sommeil pour créer des produits ergonomiques." },
  { icon: "🛡️", title: "Engagement", desc: "10 ans de garantie sur nos gammes Medico et Soft Plus." },
];

const About = () => {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const autoRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const N = photos.length;

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".ssn-fade").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const goTo = useCallback((index) => {
    setCurrent(((index % N) + N) % N);
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setCurrent((c) => (c + 1) % N), 3500);
  }, [N]);

  useEffect(() => {
    autoRef.current = setInterval(() => setCurrent((c) => (c + 1) % N), 3500);
    return () => clearInterval(autoRef.current);
  }, [N]);

  function getCardStyle(i) {
    let offset = ((i - current) % N + N) % N;
    if (offset > N / 2) offset -= N;
    const angle = offset * 60;
    const rad = (angle * Math.PI) / 180;
    const radius = 300;
    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius - radius;
    const scale = 0.55 + 0.45 * ((Math.cos(rad) + 1) / 2);
    const opacity = 0.3 + 0.7 * ((Math.cos(rad) + 1) / 2);
    return {
      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
      opacity,
      zIndex: Math.round(scale * 100),
    };
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ssn-page { background: #ffffff; font-family: 'DM Sans', sans-serif; color: #2a2a3d; }

        .ssn-fade { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .ssn-fade.visible { opacity: 1; transform: translateY(0); }
        .ssn-fade:nth-child(2) { transition-delay: 0.1s; }
        .ssn-fade:nth-child(3) { transition-delay: 0.2s; }

        /* ── HERO ── */
        .ssn-about-hero {
          text-align: center;
          padding: 110px 40px 90px;
          border-bottom: 1px solid #ebebf5;
        }
        .ssn-about-hero-inner { max-width: 760px; margin: 0 auto; }
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
          letter-spacing: -0.5px; margin-bottom: 22px;
        }
        .ssn-hero-title em { color: #4a4ade; font-style: italic; }
        .ssn-hero-desc { font-size: 16px; line-height: 1.75; color: #60607a; max-width: 640px; margin: 0 auto; }

        /* ── VALUES ── */
        .ssn-section-values {
          background: #f8f8fd;
          border-bottom: 1px solid #ebebf5;
          padding: 80px 40px;
        }
        .ssn-container { max-width: 1100px; margin: 0 auto; }
        .ssn-section-header { text-align: center; margin-bottom: 52px; }
        .ssn-section-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700; color: #1a1a2e; margin-bottom: 10px; letter-spacing: -0.3px;
        }
        .ssn-section-header p { font-size: 15px; color: #9090b0; }

        .ssn-values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        .ssn-value-card {
          background: #fff; border: 1px solid #ebebf5; border-radius: 18px;
          padding: 36px 28px; text-align: center;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .ssn-value-card:hover { box-shadow: 0 12px 40px rgba(26,26,46,0.08); transform: translateY(-4px); }
        .ssn-value-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: #f3f3fb; display: flex; align-items: center;
          justify-content: center; margin: 0 auto 18px; font-size: 22px;
        }
        .ssn-value-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem; font-weight: 600; color: #1a1a2e; margin-bottom: 10px;
        }
        .ssn-value-card p { font-size: 13.5px; color: #9090b0; line-height: 1.6; }

        /* ── GALLERY CAROUSEL ── */
        .ssn-section-gallery {
          padding: 80px 0 90px;
          overflow: hidden;
          background: #fff;
          border-bottom: 1px solid #ebebf5;
        }
        .ssn-gallery-head { text-align: center; margin-bottom: 52px; padding: 0 24px; }
        .ssn-gallery-head h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700; color: #1a1a2e; margin-bottom: 10px; letter-spacing: -0.3px;
        }
        .ssn-gallery-head h2 em { color: #4a4ade; font-style: italic; }
        .ssn-gallery-head p { font-size: 15px; color: #9090b0; }

        .ssn-stage { perspective: 1200px; width: 100%; height: 420px; position: relative; }
        .ssn-track { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; }

        .ssn-gal-card {
          position: absolute; top: 50%; left: 50%;
          width: 280px; height: 360px;
          margin-top: -180px; margin-left: -140px;
          border-radius: 20px; overflow: hidden; cursor: pointer;
          transition: transform 0.7s cubic-bezier(.4,0,.2,1), opacity 0.7s ease, box-shadow 0.3s;
          border: 1px solid #ebebf5; background: #f3f3fb;
        }
        .ssn-gal-card.active { box-shadow: 0 24px 60px rgba(26,26,46,0.14); }
        .ssn-gal-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .ssn-gal-card:hover img { transform: scale(1.04); }
        .ssn-card-label {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 32px 20px 20px;
          background: linear-gradient(to top, rgba(26,26,46,0.72) 0%, transparent 100%);
          color: #fff; font-size: 13px; font-weight: 500; letter-spacing: 0.2px;
          opacity: 0; transition: opacity 0.3s;
        }
        .ssn-gal-card.active .ssn-card-label { opacity: 1; }
        .ssn-card-placeholder {
          width: 100%; height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px;
          color: #b0b0c8; font-size: 12px; background: #f3f3fb;
        }
        .ssn-gal-controls { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 32px; }
        .ssn-gal-btn {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid #ddddf0; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 18px; color: #1a1a2e;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .ssn-gal-btn:hover { border-color: #4a4ade; color: #4a4ade; transform: scale(1.08); }
        .ssn-gal-label { font-size: 14px; font-weight: 600; color: #1a1a2e; text-align: center; min-width: 180px; }
        .ssn-gal-sub { font-size: 12px; color: #9090b0; text-align: center; margin-top: 3px; }
        .ssn-gal-dots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
        .ssn-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ddddf0; cursor: pointer;
          transition: all 0.3s ease; display: inline-block; border: none; padding: 0;
        }
        .ssn-dot.active { width: 24px; border-radius: 4px; background: #4a4ade; }
        .ssn-progress { width: 120px; height: 2px; background: #ebebf5; border-radius: 2px; margin: 16px auto 0; overflow: hidden; }
        .ssn-progress-bar { height: 100%; background: #4a4ade; border-radius: 2px; transition: width 0.4s ease; }

        /* ── VISION ── */
        .ssn-section-vision { padding: 80px 40px; background: #f8f8fd; border-bottom: 1px solid #ebebf5; }
        .ssn-vision-inner {
          display: flex; flex-wrap: wrap; align-items: flex-start;
          gap: 56px; max-width: 1100px; margin: 0 auto;
        }
        .ssn-vision-img { flex: 1; min-width: 260px; max-width: 400px; }
        .ssn-vision-img img {
          width: 100%; border-radius: 20px;
          box-shadow: 0 20px 60px rgba(26,26,46,0.1); object-fit: cover;
        }
        .ssn-vision-content { flex: 1.5; min-width: 260px; }
        .ssn-vision-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.7rem, 3vw, 2.3rem);
          font-weight: 700; color: #1a1a2e; line-height: 1.2;
          margin-bottom: 20px; letter-spacing: -0.3px;
        }
        .ssn-vision-content p { font-size: 15px; color: #60607a; line-height: 1.75; margin-bottom: 28px; }
        .ssn-vision-content strong { color: #1a1a2e; font-weight: 600; }
        .ssn-vision-content em { color: #4a4ade; font-style: italic; }

        /* ── AWARD BADGE ── */
        .ssn-award-badge {
          display: inline-flex; align-items: center; gap: 14px;
          background: #fffbf0; border: 1.5px solid #f0d080;
          border-radius: 16px; padding: 14px 20px; margin-bottom: 28px;
          animation: ssn-pulse 3s ease-in-out infinite;
        }
        @keyframes ssn-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(240,208,128,0.0); }
          50%       { box-shadow: 0 0 0 6px rgba(240,208,128,0.18); }
        }
        .ssn-award-icon { font-size: 30px; line-height: 1; flex-shrink: 0; }
        .ssn-award-title { font-size: 13.5px; font-weight: 700; color: #7a5c00; letter-spacing: 0.1px; }
        .ssn-award-sub { font-size: 12px; color: #a07a10; margin-top: 3px; font-weight: 500; }

        /* ── VISION QUOTE ── */
        .ssn-vision-quote {
          display: flex; align-items: flex-start; gap: 8px;
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem; font-style: italic; color: #4a4ade;
          line-height: 1.55; margin-bottom: 20px;
        }
        .ssn-quote-mark { font-size: 3rem; line-height: 0.75; color: #d0d0f0; font-style: normal; flex-shrink: 0; }

        /* ── VISION THANKS ── */
        .ssn-vision-thanks {
          font-size: 13.5px; color: #9090b0; line-height: 1.75;
          margin-bottom: 32px; border-left: 3px solid #ddddf0;
          padding-left: 16px;
        }
        .ssn-vision-thanks em { color: #4a4ade; font-style: normal; font-weight: 600; }

        /* ── STATS ── */
        .ssn-stats {
          display: flex; align-items: center;
          background: #fff; border: 1px solid #ebebf5;
          border-radius: 14px; padding: 18px 28px; width: fit-content;
        }
        .ssn-stat { display: flex; flex-direction: column; align-items: center; padding: 0 24px; text-align: center; }
        .ssn-stat:first-child { padding-left: 0; }
        .ssn-stat:last-child { padding-right: 0; }
        .ssn-stat strong { font-size: 17px; font-weight: 700; color: #1a1a2e; display: block; margin-bottom: 2px; }
        .ssn-stat span { font-size: 12.5px; color: #9090b0; }
        .ssn-stat-divider { width: 1px; height: 36px; background: #ddddf0; flex-shrink: 0; }

        /* ── CTA ── */
        .ssn-section-cta { padding: 80px 40px; text-align: center; background: #fff; }
        .ssn-cta-inner { max-width: 600px; margin: 0 auto; }
        .ssn-cta-inner h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.7rem, 3vw, 2.2rem); font-weight: 700;
          color: #1a1a2e; margin-bottom: 14px; letter-spacing: -0.3px;
        }
        .ssn-cta-inner p { font-size: 15px; color: #60607a; line-height: 1.7; margin-bottom: 28px; }
        .ssn-btn-primary {
          background: #1a1a2e; color: #fff; border: none;
          padding: 14px 28px; border-radius: 11px; font-size: 14.5px;
          font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .ssn-btn-primary:hover {
          background: #4a4ade; transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(74,74,222,0.25);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .ssn-about-hero { padding: 80px 24px 60px; }
          .ssn-section-values,
          .ssn-section-vision,
          .ssn-section-cta { padding: 60px 24px; }
          .ssn-stage { height: 320px; }
          .ssn-gal-card { width: 220px; height: 280px; margin-top: -140px; margin-left: -110px; }
          .ssn-stats { flex-wrap: wrap; gap: 16px; padding: 16px 20px; }
          .ssn-stat-divider { display: none; }
          .ssn-stat { padding: 0 12px; }
          .ssn-vision-img { max-width: 100%; }
          .ssn-award-badge { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>

      <div className="ssn-page">
        <NavBar />

        {/* ── HERO ── */}
        <section className="ssn-about-hero">
          <div className="ssn-about-hero-inner ssn-fade">
            <div className="ssn-badge">✦ Notre histoire</div>
            <h1 className="ssn-hero-title">
              Bienvenue chez<br />
              <em>Star Mousse Showroom</em>
            </h1>
            <p className="ssn-hero-desc">
              Depuis notre showroom, nous redéfinissons le sommeil en Tunisie.
              Plus qu'une boutique, Star Mousse est le fruit d'une passion pour le repos
              bien mérité et le design ergonomique.
            </p>
          </div>
        </section>
 {/* ── VISION ── */}
        <section className="ssn-section-vision">
          <div className="ssn-vision-inner ssn-fade">

            <div className="ssn-vision-img">
              <img src="/relax_eluproduit.jpg" alt="Super Siesta Relax+ Produit de l'Année 2026" />
            </div>

            <div className="ssn-vision-content">

              {/* Badge Award animé */}
              <div className="ssn-award-badge">
                <span className="ssn-award-icon">🏆</span>
                <div>
                  <div className="ssn-award-title">Produit de l'Année 2026</div>
                  <div className="ssn-award-sub">الجراية رقم 1 في تونس</div>
                </div>
              </div>

              <h2>Notre vision pour 2026</h2>

              {/* Citation */}
              <div className="ssn-vision-quote">
                <span className="ssn-quote-mark">"</span>
                Quand le confort parle… les résultats suivent.
              </div>

              <p>
                Le <strong>Super Siesta Relax+</strong> a été élu{" "}
                <em>Produit de l'Année 2026</em> — une distinction qui récompense
                notre exigence en matière de confort, d'innovation et de qualité.
                L'année 2026 marque également un tournant avec la digitalisation
                de notre showroom, pour offrir à chaque foyer tunisien le matelas
                parfaitement adapté à sa morphologie.
              </p>

              {/* Remerciements */}
              <div className="ssn-vision-thanks">
                Merci à tous nos clients pour leur confiance continue.<br />
                <em>Super Siesta Relax+ — Le confort qui fait la différence.</em>
              </div>

              {/* Stats */}
              <div className="ssn-stats">
                <div className="ssn-stat">
                  <strong>+5 000</strong>
                  <span>Clients</span>
                </div>
                <div className="ssn-stat-divider" />
                <div className="ssn-stat">
                  <strong>10 ans</strong>
                  <span>Garantie</span>
                </div>
                <div className="ssn-stat-divider" />
                <div className="ssn-stat">
                  <strong>24/7</strong>
                  <span>Support</span>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* ── VALEURS ── */}
        <section className="ssn-section-values">
          <div className="ssn-container">
            <header className="ssn-section-header ssn-fade">
              <h2>Nos valeurs</h2>
              <p>Ce qui nous définit au quotidien</p>
            </header>
            <div className="ssn-values-grid">
              {values.map((val, i) => (
                <div className="ssn-value-card ssn-fade" key={i}>
                  <div className="ssn-value-icon">{val.icon}</div>
                  <h3>{val.title}</h3>
                  <p>{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALERIE 3D CAROUSEL ── */}
        <section className="ssn-section-gallery">
          <div className="ssn-gallery-head ssn-fade">
            <h2>Notre <em>showroom</em></h2>
            <p>Venez vivre l'expérience — chaque détail est pensé pour vous</p>
          </div>

          <div className="ssn-stage">
            <div className="ssn-track">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className={`ssn-gal-card${i === current ? ' active' : ''}`}
                  style={getCardStyle(i)}
                  onClick={() => goTo(i)}
                >
                  <img
                    src={photo.src}
                    alt={photo.label}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="ssn-card-placeholder" style={{ display: 'none' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b0b0c8" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span>{photo.src}</span>
                  </div>
                  <div className="ssn-card-label">{photo.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ssn-gal-controls">
            <button className="ssn-gal-btn" onClick={() => goTo(current - 1)}>←</button>
            <div>
              <div className="ssn-gal-label">{photos[current].label}</div>
              <div className="ssn-gal-sub">{current + 1} / {N}</div>
            </div>
            <button className="ssn-gal-btn" onClick={() => goTo(current + 1)}>→</button>
          </div>

          <div className="ssn-gal-dots">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`ssn-dot${i === current ? ' active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <div className="ssn-progress">
            <div
              className="ssn-progress-bar"
              style={{ width: `${((current + 1) / N) * 100}%` }}
            />
          </div>
        </section>

       

        {/* ── CTA ── */}
        <section className="ssn-section-cta">
          <div className="ssn-cta-inner ssn-fade">
            <h2>Prêt à trouver votre matelas idéal ?</h2>
            <p>
              Faites notre quiz sommeil en 3 questions et découvrez le modèle
              parfaitement adapté à votre morphologie et votre budget.
            </p>
            <button className="ssn-btn-primary" onClick={() => navigate('/quiz')}>
              Lancer le quiz →
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;