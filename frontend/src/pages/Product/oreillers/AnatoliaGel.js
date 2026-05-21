import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";

/* ─────────────────────────────────────────
   DATA — Oreiller Pillow Anatolia avec Gel
   Prix : 220,00 DT (Promotion)
───────────────────────────────────────── */
const PRODUCT = {
  name: "Oreiller Pillow Anatolia Orthopédique avec Gel",
  category: "Oreiller",
  tag: "ANTI-TRANSPIRATION & ORTHOPÉDIQUE",
  tagColor: "#00b4d8", // Bleu glace pour le gel rafraîchissant
  images: [
    "/oreiller_forme_gel.jpg", 
    "/oreiller_forme_gel.jpg",
  ],
  price: 220,
  oldPrice: 270,
  status: "Rupture de stock",
  dimensions: "60 x 40 x 12 cm",
  features: [
    "Technologie Viscofoam (mémoire de forme) de haute qualité",
    "Couche de gel innovante absorbant la chaleur corporelle",
    "Action anti-transpiration par régulation thermique",
    "Soulage les douleurs au cou, au dos et aux épaules",
    "Soutien exceptionnel favorisant la détente musculaire",
    "Résistant aux liquides (entretien facile par simple essuyage)",
    "Tissu tricoté en micro spandex blanc ultra-doux",
    "Conception orthopédique pour un alignement vertébral parfait",
  ],
};

const OreillerAnatoliaGel = () => {
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("desc");
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".ssn-fade").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const fmt = (n) => n.toFixed(3).replace(".", ",") + " DT";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');
        .ssn-page { background: #fff; font-family: 'DM Sans', sans-serif; color: #1a1a2e; }
        .ssn-fade { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
        .ssn-fade.visible { opacity: 1; transform: translateY(0); }
        .ssn-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .ssn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 30px; }
        
        .ssn-gallery { position: sticky; top: 100px; }
        .ssn-main-img { width: 100%; border-radius: 24px; background: #f0faff; padding: 40px; border: 1px solid #caf0f8; box-shadow: 0 10px 40px rgba(0, 180, 216, 0.05); }
        .ssn-thumbs { display: flex; gap: 12px; margin-top: 20px; }
        .ssn-thumb { width: 90px; height: 65px; border-radius: 12px; cursor: pointer; border: 2px solid transparent; transition: 0.3s; object-fit: cover; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 8px 20px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; }
        .ssn-status { color: #e63946; font-weight: 700; font-size: 14px; margin-bottom: 10px; display: block; text-transform: uppercase; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 38px; color: #023e8a; line-height: 1.2; margin-bottom: 20px; }
        
        .ssn-price-card { margin: 25px 0; padding: 30px; background: #f0faff; border-radius: 20px; border: 1px solid #90e0ef; }
        .ssn-price-now { font-size: 40px; font-weight: 700; color: #0077b6; }
        .ssn-price-old { text-decoration: line-through; color: #94a3b8; margin-left: 20px; font-size: 24px; }

        .ssn-pill-info { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; background: #fff; border: 1px solid #caf0f8; border-radius: 15px; font-weight: 600; font-size: 15px; margin-bottom: 30px; }
        
        .ssn-stock-warning { background: #fee2e2; padding: 30px; border-radius: 25px; border: 1px solid #fecaca; text-align: center; }
        .ssn-btn-stock { width: 100%; padding: 20px; background: #94a3b8; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: not-allowed; font-size: 18px; margin-top: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

        .ssn-tabs { margin-top: 70px; }
        .ssn-tab-nav { display: flex; gap: 50px; border-bottom: 2px solid #f1f5f9; }
        .ssn-tab-btn { padding: 20px 0; cursor: pointer; font-weight: 700; color: #94a3b8; font-size: 17px; position: relative; }
        .ssn-tab-btn.active { color: #023e8a; }
        .ssn-tab-btn.active:after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 4px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 900px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 32px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Visuals */}
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-main-img" alt="Anatolia Gel Pillow" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '25px', padding: '20px', background: '#e0f7fa', borderRadius: '15px', color: '#006064', fontSize: '15px', textAlign: 'center', border: '1px solid #b2ebf2' }}>
                ❄️ Couche de gel viscofoam : Fraîcheur continue et entretien sans lavage
              </div>
            </div>

            {/* Content */}
            <div className="ssn-fade" style={{ transitionDelay: "0.15s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <span className="ssn-status">⚠ {PRODUCT.status}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#475569', fontSize: '19px', lineHeight: '1.6' }}>L'oreiller orthopédique pionnier en technologie Gel Viscofoam pour des nuits sans transpiration.</p>

              <div className="ssn-price-card">
                <span className="ssn-price-now">{fmt(PRODUCT.price)}</span>
                <span className="ssn-price-old">{fmt(PRODUCT.oldPrice)}</span>
                <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#0077b6', fontWeight: '600' }}>Livraison gratuite incluse sur toute la Tunisie</p>
              </div>

              <div className="ssn-pill-info">
                <span>📏</span>
                <span>Format : {PRODUCT.dimensions}</span>
              </div>

              <div className="ssn-stock-warning">
                <p style={{ fontWeight: '700', color: '#991b1b', fontSize: '18px' }}>Victime de son succès !</p>
                <p style={{ fontSize: '14px', color: '#b91c1c', marginTop: '5px' }}>Ce produit est temporairement indisponible. Revenez bientôt.</p>
                <button className="ssn-btn-stock">INDISPONIBLE</button>
              </div>
            </div>
          </div>

          <div className="ssn-tabs ssn-fade">
            <div className="ssn-tab-nav">
              <div className={`ssn-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Expertise Anatolia</div>
              <div className={`ssn-tab-btn ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Spécifications</div>
            </div>
            
            <div style={{ padding: '50px 0', lineHeight: '2', color: '#334155', fontSize: '17px' }}>
              {activeTab === 'desc' ? (
                <div style={{ maxWidth: '900px' }}>
                  <p>Découvrez l'<strong>Oreiller Orthopédique Anatolia</strong>, conçu spécialement pour soulager les douleurs au cou, au dos et aux épaules. Il offre un soutien exceptionnel pour favoriser la détente musculaire, tout en profitant d'une sensation de fraîcheur inégalée.</p>
                  <p style={{ marginTop: '20px' }}>Grâce à sa <strong>couche de gel innovante</strong>, cet oreiller absorbe la chaleur corporelle et aide à réguler la température, ce qui le rend extrêmement efficace contre la transpiration. Sa résistance aux liquides assure un entretien simplifié : il suffit de l'essuyer sans aucun lavage nécessaire.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '20px', background: '#f8fafc', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #f1f5f9' }}>
                      <span style={{ color: PRODUCT.tagColor, fontWeight: 'bold', fontSize: '20px' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default OreillerAnatoliaGel;