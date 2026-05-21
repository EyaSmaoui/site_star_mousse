import React, { useEffect, useRef } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const Promos = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    // Force fond blanc sur body et root
    document.body.style.background = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";
    const root = document.getElementById("root");
    if (root) root.style.background = "#ffffff";

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".ssn-fade").forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const promoItems = [
    {
      id: 1,
      name: "Matelas Relax Plus (élu produit de l'année 2026)",
      discount: "-40%",
      oldPrice: "550,00 د.ت",
      newPrice: "330,00 د.ت",
      img: "/relax1.png",
      timeLeft: "Plus que 2 jours",
      tag: "VENTE FLASH",
      tagColor: "#b52f2f",
    },
    {
      id: 2,
      name: "Oreiller à Mémoire de Forme",
      discount: "-50%",
      oldPrice: "90,00 د.ت",
      newPrice: "75,00 د.ت",
      img: "/oreiller_gel_pillow.jpg",
      timeLeft: "Vente Flash",
      tag: "VENTE FLASH",
      tagColor: "#b52f2f",
    },
  ];

  const packs = [
    {
      id: "pack-mariage",
      badge: "💍 PACK MARIAGE",
      badgeColor: "#c9963a",
      title: "Pack Mariage",
      subtitle: "Le duo parfait pour bien commencer votre vie à deux",
      discount: "-25%",
      oldPrice: "1 200,00 د.ت",
      newPrice: "900,00 د.ت",
      img: "/relax1.png",
      items: [
        { icon: "🛏️", label: "Matelas Relax Plus", desc: "Confort ergonomique pour deux" },
        { icon: "🪶", label: "Oreiller Médical x2", desc: "Soutien optimal de la nuque" },
        { icon: "🛡️", label: "Protège-matelas", desc: "Protection imperméable premium" },
      ],
      cta: "Choisir ce pack",
      highlight: true,
    },
    {
      id: "pack-extra-confort",
      badge: "✨ PACK EXTRA CONFORT",
      badgeColor: "#4a4ade",
      title: "Pack Extra Confort",
      subtitle: "L'expérience sommeil ultime pour un repos absolu",
      discount: "-30%",
      oldPrice: "1 550,00 د.ت",
      newPrice: "1 085,00 د.ت",
      img: "/tendresse.jpg",
      items: [
        { icon: "🛏️", label: "Matelas Tendresse", desc: "Douceur et maintien parfait" },
        { icon: "🌿", label: "Oreiller Aroma Menthe", desc: "Aromathérapie pour un sommeil frais" },
        { icon: "💧", label: "Oreiller Gel Pillow", desc: "Régulation thermique avancée" },
        { icon: "🛡️", label: "Protège-matelas", desc: "Protection imperméable premium" },
      ],
      cta: "Choisir ce pack",
      highlight: false,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Playfair+Display:wght@600;700&display=swap');

        html, body, #root {
          background: #ffffff !important;
          background-color: #ffffff !important;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ssn-page {
          background: #ffffff !important;
          background-color: #ffffff !important;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: #2a2a3d;
        }

        /* ── FADE ── */
        .ssn-fade {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .ssn-fade.visible { opacity: 1; transform: translateY(0); }

        /* ── HERO ── */
        .ssn-promo-hero {
          padding: 100px 40px 60px;
          text-align: center;
          max-width: 1280px;
          margin: 0 auto;
          background: #ffffff;
        }
        .ssn-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fff3f3;
          color: #b52f2f;
          border: 1px solid #f5c6c6;
          font-size: 13px;
          font-weight: 700;
          padding: 7px 18px;
          border-radius: 50px;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .ssn-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1.18;
          margin-bottom: 14px;
          letter-spacing: -0.5px;
        }
        .ssn-hero-title .accent { color: #b52f2f; font-style: italic; }
        .ssn-hero-desc {
          font-size: 16px;
          line-height: 1.75;
          color: #60607a;
          max-width: 560px;
          margin: 0 auto;
        }

        /* ── SECTION TITLES ── */
        .ssn-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }
        .ssn-section-sub {
          font-size: 14.5px;
          color: #9090b0;
          margin-bottom: 40px;
        }

        /* ── VENTES FLASH ── */
        .ssn-section-flash {
          background: #fff8f8 !important;
          border-top: 1px solid #f5e0e0;
          border-bottom: 1px solid #f5e0e0;
          padding: 70px 40px;
        }
        .ssn-container { max-width: 1280px; margin: 0 auto; }
        .ssn-flash-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .ssn-flash-card {
          background: #ffffff !important;
          border: 1.5px solid #f5c6c6;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: pointer;
        }
        .ssn-flash-card:hover {
          box-shadow: 0 12px 48px rgba(181,47,47,0.12);
          transform: translateY(-4px);
        }
        .ssn-flash-card-img {
          width: 100%;
          height: 220px;
          background: #fff5f5;
          overflow: hidden;
          position: relative;
        }
        .ssn-flash-card-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .ssn-flash-card:hover .ssn-flash-card-img img { transform: scale(1.05); }
        .ssn-flash-discount {
          position: absolute;
          top: 12px; left: 12px;
          background: #b52f2f;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 8px;
          z-index: 2;
          letter-spacing: 0.3px;
        }
        .ssn-flash-time {
          position: absolute;
          top: 12px; right: 12px;
          background: #fff3f3;
          color: #b52f2f;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid #f5c6c6;
          z-index: 2;
        }
        .ssn-flash-body { padding: 20px 22px 22px; }
        .ssn-flash-tag {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          color: #fff;
          text-transform: uppercase;
          margin-bottom: 10px;
          letter-spacing: 0.4px;
        }
        .ssn-flash-body h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 16px;
          line-height: 1.35;
        }
        .ssn-flash-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ssn-old-price {
          font-size: 13px;
          text-decoration: line-through;
          color: #b0b0c0;
          display: block;
          margin-bottom: 2px;
        }
        .ssn-new-price {
          font-size: 22px;
          font-weight: 800;
          color: #b52f2f;
          letter-spacing: -0.5px;
        }
        .ssn-btn-flash {
          background: #b52f2f;
          color: #fff;
          border: none;
          padding: 11px 20px;
          border-radius: 11px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .ssn-btn-flash:hover {
          background: #8a1e1e;
          transform: translateY(-1px);
        }

        /* ── PACKS ── */
        .ssn-section-packs {
          padding: 80px 40px;
          background: #ffffff !important;
        }
        .ssn-packs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
          gap: 28px;
        }

        .ssn-pack-card {
          border: 1.5px solid #ebebf5;
          border-radius: 22px;
          overflow: hidden;
          background: #ffffff !important;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .ssn-pack-card.highlight {
          border-color: #c9963a;
          box-shadow: 0 0 0 3px rgba(201,150,58,0.12);
        }
        .ssn-pack-card:hover {
          box-shadow: 0 16px 56px rgba(26,26,46,0.1);
          transform: translateY(-4px);
        }
        .ssn-pack-header {
          padding: 28px 32px 22px;
          border-bottom: 1px solid #f3f3fb;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          background: #ffffff;
        }
        .ssn-pack-img {
          width: 120px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f3f3fb;
        }
        .ssn-pack-img img { width: 100%; height: 100%; object-fit: cover; }
        .ssn-pack-meta { flex: 1; }
        .ssn-pack-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 50px;
          color: #fff;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .ssn-pack-meta h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 6px;
        }
        .ssn-pack-meta p { font-size: 13.5px; color: #60607a; line-height: 1.5; }

        .ssn-pack-items {
          padding: 24px 32px;
          border-bottom: 1px solid #f3f3fb;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #ffffff;
        }
        .ssn-pack-item { display: flex; align-items: center; gap: 14px; }
        .ssn-pack-item-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #f3f3fb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .ssn-pack-item-info strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 2px;
        }
        .ssn-pack-item-info span { font-size: 12.5px; color: #9090b0; }

        .ssn-pack-footer {
          padding: 22px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f8fd;
        }
        .ssn-pack-discount-pill {
          display: inline-block;
          background: #fff3f3;
          color: #b52f2f;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 6px;
        }
        .ssn-pack-old { font-size: 13px; text-decoration: line-through; color: #b0b0c0; display: block; margin-bottom: 2px; }
        .ssn-pack-new { font-size: 24px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; }
        .ssn-btn-pack {
          background: #1a1a2e;
          color: #fff;
          border: none;
          padding: 13px 26px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .ssn-btn-pack:hover {
          background: #4a4ade;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(74,74,222,0.25);
        }
        .ssn-pack-card.highlight .ssn-btn-pack { background: #c9963a; }
        .ssn-pack-card.highlight .ssn-btn-pack:hover {
          background: #a87730;
          box-shadow: 0 6px 24px rgba(201,150,58,0.3);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1000px) {
          .ssn-packs-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) {
          .ssn-promo-hero { padding: 80px 24px 40px; }
          .ssn-section-flash { padding: 50px 24px; }
          .ssn-section-packs { padding: 50px 24px; }
          .ssn-pack-header { flex-direction: column; }
          .ssn-pack-img { width: 100%; height: 160px; }
          .ssn-pack-footer { flex-direction: column; gap: 16px; align-items: flex-start; }
          .ssn-btn-pack { width: 100%; text-align: center; }
        }
      `}</style>

      <div className="ssn-page">
        <NavBar />

        {/* ── HERO ── */}
        <div className="ssn-promo-hero ssn-fade">
          <div className="ssn-badge">🔥 Ventes Flash de la Semaine</div>
          <h1 className="ssn-hero-title">
            Nos Offres <span className="accent">Irrésistibles</span>
          </h1>
          <p className="ssn-hero-desc">
            Des remises exceptionnelles sur une sélection de produits pour une durée limitée.
            Premier arrivé, premier servi dans votre showroom Super Siesta !
          </p>
        </div>

        {/* ── VENTES FLASH ── */}
        <section className="ssn-section-flash">
          <div className="ssn-container">
            <div className="ssn-fade" style={{ marginBottom: "40px" }}>
              <h2 className="ssn-section-title">⚡ Ventes Flash</h2>
              <p className="ssn-section-sub">Offres limitées — ne ratez pas ces prix exceptionnels</p>
            </div>
            <div className="ssn-flash-grid">
              {promoItems.map((item) => (
                <div className="ssn-flash-card ssn-fade" key={item.id}>
                  <div className="ssn-flash-card-img">
                    <span className="ssn-flash-discount">{item.discount}</span>
                    <span className="ssn-flash-time">⏳ {item.timeLeft}</span>
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="ssn-flash-body">
                    <span className="ssn-flash-tag" style={{ backgroundColor: item.tagColor }}>
                      {item.tag}
                    </span>
                    <h3>{item.name}</h3>
                    <div className="ssn-flash-footer">
                      <div>
                        <span className="ssn-old-price">{item.oldPrice}</span>
                        <span className="ssn-new-price">{item.newPrice}</span>
                      </div>
                      <button className="ssn-btn-flash">J'en profite →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PACKS ── */}
        <section className="ssn-section-packs">
          <div className="ssn-container">
            <div className="ssn-fade" style={{ marginBottom: "40px" }}>
              <h2 className="ssn-section-title">🎁 Nos Packs Exclusifs</h2>
              <p className="ssn-section-sub">Tout ce qu'il vous faut en un seul pack — livré chez vous</p>
            </div>
            <div className="ssn-packs-grid">
              {packs.map((pack) => (
                <div
                  className={`ssn-pack-card ssn-fade${pack.highlight ? " highlight" : ""}`}
                  key={pack.id}
                >
                  <div className="ssn-pack-header">
                    <div className="ssn-pack-img">
                      <img src={pack.img} alt={pack.title} />
                    </div>
                    <div className="ssn-pack-meta">
                      <span className="ssn-pack-badge" style={{ backgroundColor: pack.badgeColor }}>
                        {pack.badge}
                      </span>
                      <h3>{pack.title}</h3>
                      <p>{pack.subtitle}</p>
                    </div>
                  </div>

                  <div className="ssn-pack-items">
                    {pack.items.map((item, i) => (
                      <div className="ssn-pack-item" key={i}>
                        <div className="ssn-pack-item-icon">{item.icon}</div>
                        <div className="ssn-pack-item-info">
                          <strong>{item.label}</strong>
                          <span>{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="ssn-pack-footer">
                    <div>
                      <span className="ssn-pack-discount-pill">{pack.discount}</span>
                      <span className="ssn-pack-old">{pack.oldPrice}</span>
                      <span className="ssn-pack-new">{pack.newPrice}</span>
                    </div>
                    <button className="ssn-btn-pack">{pack.cta} →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Promos;