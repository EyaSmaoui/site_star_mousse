import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import formatPrice from '../../utils/formatPrice';

const Products = () => {
  const [filter, setFilter] = useState("Tous");
  const observerRef = useRef(null);
  const navigate = useNavigate();

  // Fonction pour obtenir la route du produit
  const getProductRoute = (productName) => {
    const routeMap = {
      "Matelas Relax Plus": "/product/relax-plus",
      "Matelas Medico Plus": "/product/medico-plus",
      "Matelas Tendresse": "/product/tendresse",
      "Matelas orthopédique Venise Plus": "/product/venise-plus",
      "Matelas orthopédique Soft Plus": "/product/soft-plus",
      "Matelas ressort Confort Plus": "/product/confort-plus",
      "Matelas Relax Pillow": "/product/relax-pillow",
      "Matelas Tendresse Pillow": "/product/tendresse-pillow",
      "Matelas Medico Pillow": "/product/medico-pillow",
      "Matelas Venise Pillow": "/product/venise-pillow",
      "Oreiller Gel Pillow": "/product/gel-pillow",
      "Lot de 2 Oreillers en Fibre": "/product/lot-de-2-oreillers-en-fibre",
      "Lot de 5 Oreillers en Fibre": "/product/lot-de-5-oreillers-en-fibre",
      "Oreiller en Fibre": "/product/oreiller-fibre",
      "Lot de 2 Oreillers Fibre en Boule": "/product/oreiller-classic",
      "Oreiller Médical Aroma Lavande": "/product/aroma-lavande",
      "Oreiller Médical Aroma Menthe": "/product/aroma-menthe",
      "Oreiller Médical Aroma Océan Puff": "/product/ocean-puff",
      "Oreiller Pillow Anatolia Gel": "/product/anatolia-gel",
      "Lit Bandes": "/product/lit-bandes",
      "Lit Capitonne": "/product/lit-capitonne",
      "Lit Carreaux": "/product/lit-carreaux",
      "Lit Mercurey": "/product/lit-mercurey",
      "Commode Harmony": "/product/commode-harmony",
      "Commode Rivera": "/product/commode-rivera",
      "Table de Nuit Harmony": "/product/table-de-nuit-harmony",
      "Table de Nuit Rivera": "/product/table-de-nuit-rivera",
      "Collection Oreillers Star Mousse": "/product/oreillers",
      "Matelas bébé Confort plus": "/product/bebe-confort-plus",
      "Matelas bébé Soft": "/product/bebe-soft",
      "Matelas bébé Venise": "/product/bebe-venise",
      "Protege Matelas Premium": "/product/protege-matelas-premium",
      "Protege Matelas Impermeable": "/product/protege-matelas-impermeable",
      "Lit Coffre Moderne": "/product/lit-coffre-moderne",
      "Lit Capitonne Star": "/product/lit-capitonne-star",
      "Bloc Mousse Haute Densite": "/product/bloc-mousse-haute-densite",
      "Matelas Mousse HR Confort": "/product/matelas-mousse-hr-confort",
      "Matelas Classico": "/product/matelas-classico",
      "Matelas Confort": "/product/matelas-confort",
      "Matelas Exclusive Cool": "/product/matelas-exclusive-cool",
      "Matelas Signature Orthopedique": "/product/matelas-signature-orthopedique",
      "Matelas Gold Tentation": "/product/matelas-gold-tentation",
      "Matelas Souplex Orthopedique": "/product/matelas-souplex-orthopedique",
      "Matelas Tentation Pillow Top": "/product/matelas-tentation-pillow-top",
      "Matelas Toscana Pillow Top": "/product/matelas-toscana-pillow-top"
    };
    return routeMap[productName] || "/products";
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    const fadeElements = document.querySelectorAll(".ssn-fade");
    fadeElements.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [filter]);

  const allProducts = [
    // ── ERGONOMIQUE ──
    { id: 1, name: "Matelas Relax Plus", category: "Ergonomique", guarantee: "10 ans", price: "530,00 د.ت – 1 850,00 د.ت", img: "/relax_eluproduit-card.jpg", tag: "POPULAIRE", tagColor: "#2a7a2a", discount: "-19%" },
    { id: 2, name: "Matelas Medico Plus", category: "Orthomédicale", guarantee: "9 ans", price: "440,00 د.ت – 1 530,00 د.ت", img: "/medico.jpg", tag: "POPULAIRE", tagColor: "#2a7a2a", discount: "-18%" },
    { id: 3, name: "Matelas Tendresse", category: "Ergonomique", guarantee: "11 ans", price: "730,00 د.ت – 2 555,00 د.ت", img: "/tendresse.jpg", tag: "POPULAIRE", tagColor: "#2a7a2a", discount: "-19%" },

    // ── ORTHOPÉDIQUE ──
    { id: 4, name: "Matelas orthopédique Venise Plus", category: "Orthopédique", guarantee: "5 ans", price: "310,00 د.ت – 935,00 د.ت", img: "/venise.jpg", tag: "ORTHOPÉDIQUE", tagColor: "#1a1a2e", discount: null },
    { id: 5, name: "Matelas orthopédique Soft Plus", category: "Orthopédique", guarantee: "3 ans", price: "260,00 د.ت – 620,00 د.ت", img: "/venise.jpg", tag: "ORTHOPÉDIQUE", tagColor: "#1a1a2e", discount: null },
    { id: 6, name: "Matelas ressort Confort Plus", category: "Orthopédique", guarantee: "3 ans", price: "219,00 د.ت – 349,00 د.ت", img: "/confort.png", tag: "À RESSORT", tagColor: "#4a4ade", discount: null },

    // ── PILLOW TOP ──
    { id: 7, name: "Matelas Relax Pillow", category: "Pillow Top", guarantee: "10 ans", price: "950,00 د.ت – 2 030,00 د.ت", img: "/relax_pillow.png", tag: "PILLOW TOP", tagColor: "#b78b3f", discount: "-19%" },
    { id: 8, name: "Matelas Tendresse Pillow", category: "Pillow Top", guarantee: "10 ans", price: "1 160,00 د.ت – 2 630,00 د.ت", img: "/tendresse_pillow1.png", tag: "PILLOW TOP", tagColor: "#b78b3f", discount: "-21%" },
    { id: 9, name: "Matelas Medico Pillow", category: "Pillow Top", guarantee: "9 ans", price: "800,00 د.ت – 1 810,00 د.ت", img: "/medico_pillow.png", tag: "PILLOW TOP", tagColor: "#b78b3f", discount: "-20%" },
    { id: 10, name: "Matelas Venise Pillow", category: "Pillow Top", guarantee: "8 ans", price: "650,00 د.ت – 1 400,00 د.ت", img: "/venise2.png", tag: "PILLOW TOP", tagColor: "#b78b3f", discount: "-20%" },

    // ── OREILLERS ──
    { id: 11, name: "Collection Oreillers Star Mousse", category: "Oreillers", guarantee: "2 ans", price: "175,00 د.ت – 220,00 د.ت", img: "/oreiller_gel_pillow.jpg", tag: "OREILLERS", tagColor: "#3b82f6", discount: null },
    { id: 12, name: "Oreiller Gel Pillow", category: "Oreillers", guarantee: "2 ans", price: "209,00 د.ت", img: "/oreiller_gel_pillow.jpg", tag: "PROMO", tagColor: "#b78b3f", discount: "-25%" },
    { id: 13, name: "Oreiller Médical Aroma Lavande", category: "Oreillers", guarantee: "2 ans", price: "175,00 د.ت", img: "/oreiller_lavande.png", tag: "OREILLER", tagColor: "#7a2fb5", discount: null },
    { id: 14, name: "Oreiller Médical Aroma Menthe", category: "Oreillers", guarantee: "2 ans", price: "175,00 د.ت", img: "/oreiller_menthe.png", tag: "OREILLER", tagColor: "#2a7a2a", discount: null },
    { id: 15, name: "Oreiller Médical Aroma Océan Puff", category: "Oreillers", guarantee: "2 ans", price: "175,00 د.ت", img: "/oreiller_puff.png", tag: "OREILLER", tagColor: "#2f7ab5", discount: "-19%" },
    { id: 16, name: "Oreiller Pillow Anatolia Gel", category: "Oreillers", guarantee: "2 ans", price: "220,00 د.ت", img: "/oreiller_forme_gel.jpg", tag: "OREILLER", tagColor: "#2f7ab5", discount: "-19%" },

    // ── BÉBÉ ──
    { id: 17, name: "Matelas bébé Confort plus", category: "Bébé", guarantee: "3 ans", price: "180,00 د.ت", img: "/bebe_confort.jpg", tag: "BÉBÉ", tagColor: "#e07b2a", discount: "-16%" },
    { id: 18, name: "Matelas bébé Soft", category: "Bébé", guarantee: "3 ans", price: "200,00 د.ت", img: "/bebe_soft.jpg", tag: "BÉBÉ", tagColor: "#e07b2a", discount: "-20%" },
    { id: 19, name: "Matelas bébé Venise", category: "Bébé", guarantee: "3 ans", price: "240,00 د.ت", img: "/bebe_venise.jpg", tag: "BÉBÉ", tagColor: "#e07b2a", discount: "-13%" },

    // ── NOUVELLES COLLECTIONS ──
    { id: 20, name: "Protege Matelas Premium", category: "Protege matelas", guarantee: "2 ans", price: "59,00 د.ت - 119,00 د.ت", img: "/sleeping_home.jpg", tag: "NOUVEAU", tagColor: "#0f766e", discount: "-15%" },
    { id: 21, name: "Protege Matelas Impermeable", category: "Protege matelas", guarantee: "2 ans", price: "69,00 د.ت - 139,00 د.ت", img: "/showroom4.jpg", tag: "ANTI-TACHE", tagColor: "#2563eb", discount: null },
    { id: 22, name: "Lit Coffre Moderne", category: "Lits", guarantee: "5 ans", price: "790,00 د.ت - 1 590,00 د.ت", img: "/showroom1.jpg", tag: "GAIN DE PLACE", tagColor: "#7c3aed", discount: "-12%" },
    { id: 23, name: "Lit Capitonne Star", category: "Lits", guarantee: "5 ans", price: "690,00 د.ت - 1 390,00 د.ت", img: "/showroom2.jpg", tag: "DESIGN", tagColor: "#be123c", discount: null },
    { id: 24, name: "Bloc Mousse Haute Densite", category: "Mousse", guarantee: "3 ans", price: "Sur mesure", img: "/showroom5.jpg", tag: "SUR MESURE", tagColor: "#ca8a04", discount: null },
    { id: 25, name: "Matelas Mousse HR Confort", category: "Mousse", guarantee: "6 ans", price: "340,00 د.ت - 920,00 د.ت", img: "/showroom6.jpg", tag: "HAUTE RESILIENCE", tagColor: "#334155", discount: "-10%" },

  ];

  const categories = ["Tous", "Ergonomique", "Orthopédique", "Pillow Top", "Oreillers", "Bébé", "Protege matelas", "Lits", "Mousse", "Star Mousse"];
  const featuredCollections = [
    { title: "Protection intelligente", text: "Protege-matelas respirants, faciles a entretenir et penses pour prolonger la duree de vie du matelas.", metric: "Anti-tache" },
    { title: "Chambres completes", text: "Lits modernes avec rangements, tetes capitonnees et finitions adaptees aux interieurs contemporains.", metric: "Sur mesure" },
    { title: "Mousse technique", text: "Solutions mousse haute densite pour matelas, assises et projets speciaux avec decoupe personnalisee.", metric: "Haute densite" },
  ];

  const filteredProducts =
    filter === "Tous"
      ? allProducts
      : allProducts.filter((p) => p.category === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Playfair+Display:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ssn-page {
          background: #ffffff;
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
        .ssn-products-hero {
          padding: 100px 40px 50px;
          text-align: center;
          max-width: 1280px;
          margin: 0 auto;
        }
        .ssn-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #f3f3fb;
          color: #4a4ade;
          border: 1px solid #ddddf0;
          font-size: 13px;
          font-weight: 500;
          padding: 7px 15px;
          border-radius: 50px;
          margin-bottom: 24px;
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
        .ssn-hero-title .accent { color: #4a4ade; font-style: italic; }
        .ssn-hero-desc {
          font-size: 16px;
          line-height: 1.75;
          color: #60607a;
          max-width: 520px;
          margin: 0 auto;
        }

        /* ── FILTRES ── */
        .ssn-filters {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          padding: 32px 40px 48px;
          max-width: 1280px;
          margin: 0 auto;
        }
        .ssn-btn-primary {
          background: #1a1a2e;
          color: #fff;
          border: none;
          padding: 12px 22px;
          border-radius: 11px;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .ssn-btn-primary:hover {
          background: #4a4ade;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(74,74,222,0.25);
        }
        .ssn-btn-secondary {
          background: #fff;
          color: #2a2a3d;
          border: 1.5px solid #ddddf0;
          padding: 12px 22px;
          border-radius: 11px;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ssn-btn-secondary:hover {
          border-color: #4a4ade;
          color: #4a4ade;
          box-shadow: 0 0 0 3px rgba(74,74,222,0.09);
        }

        .ssn-modern-strip {
          max-width: 1280px;
          margin: 0 auto 34px;
          padding: 0 40px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .ssn-modern-card {
          background: #ffffff;
          border: 1px solid #ebebf5;
          border-radius: 8px;
          padding: 22px;
          box-shadow: 0 18px 44px rgba(26,26,46,0.07);
          position: relative;
          overflow: hidden;
        }
        .ssn-modern-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 4px;
          background: linear-gradient(90deg, #b78b3f, #f4c84f, #0f766e);
        }
        .ssn-modern-metric {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          background: #fff5cf;
          color: #151522;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .ssn-modern-card h2 {
          font-size: 18px;
          color: #1a1a2e;
          margin-bottom: 10px;
          line-height: 1.25;
        }
        .ssn-modern-card p {
          font-size: 14px;
          color: #60607a;
          line-height: 1.65;
        }

        /* ── GRILLE ── */
        .ssn-section-products {
          background: #f8f8fd;
          padding: 60px 40px 80px;
          border-top: 1px solid #ebebf5;
        }
        .ssn-container { max-width: 1280px; margin: 0 auto; }
        .ssn-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* ── CARD ── */
        .ssn-card {
          background: #ffffff;
          border: 1px solid #ebebf5;
          border-radius: 18px;
          overflow: hidden;
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: pointer;
          position: relative;
        }
        .ssn-card:hover {
          box-shadow: 0 12px 48px rgba(26,26,46,0.1);
          transform: translateY(-4px);
        }
        .ssn-card-img {
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: #f3f3fb;
          position: relative;
        }
        .ssn-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .ssn-card:hover .ssn-card-img img { transform: scale(1.05); }
        .ssn-discount {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #b78b3f;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 6px;
          z-index: 2;
          letter-spacing: 0.2px;
        }
        .ssn-card-body { padding: 20px 22px 22px; }
        .ssn-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .ssn-tag {
          font-size: 10.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 50px;
          letter-spacing: 0.4px;
          color: #fff;
          text-transform: uppercase;
        }
        .ssn-product-tag-popular { background: #b78b3f !important; }
        .ssn-product-tag-muted { background: #94a3b8 !important; }
        .ssn-card-body h3 {
          font-size: 15.5px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 16px;
          letter-spacing: -0.1px;
          line-height: 1.35;
        }
        .ssn-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ssn-price {
          font-size: 16px;
          font-weight: 700;
          color: #b78b3f;
          letter-spacing: -0.2px;
          line-height: 1.3;
          white-space: nowrap;
        }
        .ssn-btn-card {
          background: #f3f3fb;
          color: #4a4ade;
          border: none;
          padding: 9px 15px;
          border-radius: 9px;
          font-size: 12.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap;
        }
        .ssn-btn-card:hover { background: #4a4ade; color: #fff; }
        .ssn-card-meta-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; color: #64748b; font-size: 13px; flex-wrap: wrap; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .ssn-products-hero { padding: 80px 24px 36px; }
          .ssn-filters { padding: 16px 24px 36px; }
          .ssn-section-products { padding: 40px 24px 60px; }
          .ssn-product-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
          .ssn-card-body { padding: 16px 14px 18px; }
          .ssn-card-img { height: 180px; }
          .ssn-hero-title { font-size: clamp(2rem, 6vw, 3rem); }
          .ssn-modern-strip { grid-template-columns: 1fr; padding: 0 24px; }
        }
        @media (max-width: 640px) {
          .ssn-products-hero { padding: 64px 16px 28px; }
          .ssn-filters { padding: 12px 14px 28px; gap: 8px; }
          .ssn-section-products { padding: 28px 14px 48px; }
          .ssn-product-grid { grid-template-columns: 1fr; gap: 14px; }
          .ssn-card-img { height: 220px; }
          .ssn-modern-strip { padding: 0 14px; margin-bottom: 24px; gap: 12px; }
          .ssn-modern-card { padding: 18px; }
          .ssn-card-body h3 { font-size: 15px; margin-bottom: 10px; }
          .ssn-btn-card { width: 100%; justify-content: center; display: inline-flex; }
          .ssn-card-meta-row { flex-direction: column; gap: 2px; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .ssn-hero-title { font-size: 26px; }
          .ssn-products-hero { padding: 56px 12px 22px; }
          .ssn-filters { padding: 10px 10px 22px; }
          .ssn-section-products { padding: 22px 10px 40px; }
          .ssn-card { border-radius: 14px; }
        }
      `}</style>

      <div className="ssn-page">

        {/* ── HERO ── */}
        <div className="ssn-products-hero ssn-fade">
          <div className="ssn-badge">🛏️ Collection complète Super Siesta</div>
          <h1 className="ssn-hero-title">
            Explorez notre <span className="accent">Showroom</span>
          </h1>
          <p className="ssn-hero-desc">
            Matelas ergonomiques, orthopédiques, oreillers médicaux et plus encore —
            protege-matelas, lits modernes et mousse sur mesure fabriques avec passion en Tunisie.
          </p>
        </div>

        <section className="ssn-modern-strip ssn-fade" aria-label="Collections modernes">
          {featuredCollections.map((item) => (
            <article className="ssn-modern-card" key={item.title}>
              <span className="ssn-modern-metric">{item.metric}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        {/* ── FILTRES ── */}
        <div className="ssn-filters ssn-fade">
          {categories.map((cat) => (
            <button
              key={cat}
              className={filter === cat ? "ssn-btn-primary" : "ssn-btn-secondary"}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── GRILLE ── */}
        <section className="ssn-section-products">
          <div className="ssn-container">
            <div className="ssn-product-grid">
              {filteredProducts.map((product) => {
                return (
                <div className="ssn-card ssn-fade" key={product.id}>
                  <div className="ssn-card-img">
                    {product.discount && (
                      <span className="ssn-discount">{product.discount}</span>
                    )}
                    <img src={product.img} alt={product.name} />
                  </div>
<div className="ssn-card-body">
                     <div className="ssn-card-top">
                       {product.tag && (
                         <span
                           className="ssn-tag"
                           style={{ background: product.tagColor || "#94a3b8" }}
                         >
                           {product.tag}
                         </span>
                       )}
                     </div>
                    <h3>{product.name}</h3>
                     <div className="ssn-card-meta-row">
                       <span>{product.category}</span>
                       <span>{product.guarantee || "Garantie incluse"}</span>
                     </div>
                    <div className="ssn-card-footer">
                      <span className="ssn-price">{formatPrice(product.price)}</span>
                      <button 
                        className="ssn-btn-card"
                        onClick={() => navigate(getProductRoute(product.name))}
                      >
                        Voir →
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Products;

