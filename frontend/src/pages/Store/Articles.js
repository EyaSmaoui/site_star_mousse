import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const Products = () => {
  const [filter, setFilter] = useState("Tous");
  const observerRef = useRef(null);
  const navigate = useNavigate();

  // Fonction pour obtenir la route du produit
  const getProductRoute = (productName) => {
    const routeMap = {
      "Matelas Relax Plus": "/product/relax-plus",
      "Matelas Medico plus": "/product/medico-plus",
      "Matelas Tendresse": "/product/tendresse",
      "Matelas orthopédique Venise Plus": "/product/venise-plus",
      "Matelas orthopédique Soft Plus": "/product/soft-plus",
      "Matelas ressort Confort Plus": "/product/confort-plus",
      "Matelas Relax pillow": "/product/relax-pillow",
      "Matelas Tendresse pillow": "/product/tendresse-pillow",
      "Matelas Medico pillow": "/product/medico-pillow",
      "Matelas Venise pillow": "/product/venise-pillow",
      "Oreiller Gel Pillow": "/product/gel-pillow",
      "Oreiller Médical Aroma Lavande": "/product/aroma-lavande",
      "Oreiller Médical Aroma Menthe": "/product/aroma-menthe",
      "Oreiller Médical Aroma Océan Puff": "/product/ocean-puff",
      "Oreiller Pillow Anatolia Gel": "/product/anatolia-gel",
      "Matelas bébé Confort plus": "/product/bebe-confort-plus",
      "Matelas bébé Soft": "/product/bebe-soft",
      "Matelas bébé Venise": "/product/bebe-venise"
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
    { id: 1, name: "Matelas Relax Plus", category: "Ergonomique", price: "530,00 د.ت – 1 850,00 د.ت", img: "/relax1.png", tag: "POPULAIRE", tagColor: "#2a7a2a", discount: "-19%" },
    { id: 2, name: "Matelas Medico plus", category: "Orthomédicale", price: "440,00 د.ت – 1 530,00 د.ت", img: "/medico.jpg", tag: "POPULAIRE", tagColor: "#2a7a2a", discount: "-18%" },
    { id: 3, name: "Matelas Tendresse", category: "Ergonomique", price: "730,00 د.ت – 2 555,00 د.ت", img: "/tendresse.jpg", tag: "POPULAIRE", tagColor: "#2a7a2a", discount: "-19%" },

    // ── ORTHOPÉDIQUE ──
    { id: 4, name: "Matelas orthopédique Venise Plus", category: "Orthopédique", price: "310,00 د.ت – 935,00 د.ت", img: "/venise.jpg", tag: "ORTHOPÉDIQUE", tagColor: "#1a1a2e", discount: null },
    { id: 5, name: "Matelas orthopédique Soft Plus", category: "Orthopédique", price: "260,00 د.ت – 620,00 د.ت", img: "/venise.jpg", tag: "ORTHOPÉDIQUE", tagColor: "#1a1a2e", discount: null },
    { id: 6, name: "Matelas ressort Confort Plus", category: "Orthopédique", price: "219,00 د.ت – 349,00 د.ت", img: "/confort.png", tag: "À RESSORT", tagColor: "#4a4ade", discount: null },

    // ── PILLOW TOP ──
    { id: 7, name: "Matelas Relax pillow", category: "Pillow Top", price: "950,00 د.ت – 2 030,00 د.ت", img: "/relax_pillow.png", tag: "PILLOW TOP", tagColor: "#b52f2f", discount: "-19%" },
    { id: 8, name: "Matelas Tendresse pillow", category: "Pillow Top", price: "1 160,00 د.ت – 2 630,00 د.ت", img: "/tendresse_pillow.png", tag: "PILLOW TOP", tagColor: "#b52f2f", discount: "-21%" },
    { id: 9, name: "Matelas Medico pillow", category: "Pillow Top", price: "800,00 د.ت – 1 810,00 د.ت", img: "/medico_pillow.png", tag: "PILLOW TOP", tagColor: "#b52f2f", discount: "-20%" },
    { id: 10, name: "Matelas Venise pillow", category: "Pillow Top", price: "650,00 د.ت – 1 400,00 د.ت", img: "/venise_pillow.png", tag: "PILLOW TOP", tagColor: "#b52f2f", discount: "-20%" },

    // ── OREILLERS ──
    { id: 11, name: "Oreiller Gel Pillow", category: "Oreillers", price: "209,00 د.ت", img: "/oreiller_gel_pillow.jpg", tag: "PROMO", tagColor: "#b52f2f", discount: "-25%" },
    { id: 12, name: "Oreiller Médical Aroma Lavande", category: "Oreillers", price: "175,00 د.ت", img: "/oreiller_lavande.png", tag: "OREILLER", tagColor: "#7a2fb5", discount: null },
    { id: 13, name: "Oreiller Médical Aroma Menthe", category: "Oreillers", price: "175,00 د.ت", img: "/oreiller_menthe.png", tag: "OREILLER", tagColor: "#2a7a2a", discount: null },
    { id: 14, name: "Oreiller Médical Aroma Océan Puff", category: "Oreillers", price: "175,00 د.ت", img: "/oreiller_puff.png", tag: "OREILLER", tagColor: "#2f7ab5", discount: "-19%" },
    { id: 15, name: "Oreiller Pillow Anatolia Gel", category: "Oreillers", price: "220,00 د.ت", img: "/oreiller_forme_gel.jpg", tag: "OREILLER", tagColor: "#2f7ab5", discount: "-19%" },

    // ── BÉBÉ ──
    { id: 16, name: "Matelas bébé Confort plus", category: "Bébé", price: "180,00 د.ت", img: "/bebe_confort.jpg", tag: "BÉBÉ", tagColor: "#e07b2a", discount: "-16%" },
    { id: 17, name: "Matelas bébé Soft", category: "Bébé", price: "200,00 د.ت", img: "/bebe_soft.jpg", tag: "BÉBÉ", tagColor: "#e07b2a", discount: "-20%" },
    { id: 18, name: "Matelas bébé Venise", category: "Bébé", price: "240,00 د.ت", img: "/bebe_venise.jpg", tag: "BÉBÉ", tagColor: "#e07b2a", discount: "-13%" },
  ];

  const categories = ["Tous", "Ergonomique", "Orthopédique", "Pillow Top", "Oreillers", "Bébé"];

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
          background: #b52f2f;
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
        .ssn-rating { font-size: 12px; color: #9090b0; }
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
          font-size: 14px;
          font-weight: 700;
          color: #1a1a2e;
          letter-spacing: -0.2px;
          line-height: 1.3;
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

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .ssn-products-hero { padding: 80px 24px 36px; }
          .ssn-filters { padding: 16px 24px 36px; }
          .ssn-section-products { padding: 40px 24px 60px; }
        }
      `}</style>

      <div className="ssn-page">
        <NavBar />

        {/* ── HERO ── */}
        <div className="ssn-products-hero ssn-fade">
          <div className="ssn-badge">🛏️ Collection complète Super Siesta</div>
          <h1 className="ssn-hero-title">
            Explorez notre <span className="accent">Showroom</span>
          </h1>
          <p className="ssn-hero-desc">
            Matelas ergonomiques, orthopédiques, oreillers médicaux et plus encore —
            fabriqués avec passion en Tunisie.
          </p>
        </div>

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
              {filteredProducts.map((product) => (
                <div className="ssn-card ssn-fade" key={product.id}>
                  <div className="ssn-card-img">
                    {product.discount && (
                      <span className="ssn-discount">{product.discount}</span>
                    )}
                    <img src={product.img} alt={product.name} />
                  </div>
                  <div className="ssn-card-body">
                    <div className="ssn-card-top">
                      <span className="ssn-tag" style={{ backgroundColor: product.tagColor }}>
                        {product.tag}
                      </span>
                      <span className="ssn-rating">⭐ 4.9</span>
                    </div>
                    <h3>{product.name}</h3>
                    <div className="ssn-card-footer">
                      <span className="ssn-price">{product.price}</span>
                      <button 
                        className="ssn-btn-card"
                        onClick={() => navigate(getProductRoute(product.name))}
                      >
                        Voir →
                      </button>
                    </div>
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

export default Products;