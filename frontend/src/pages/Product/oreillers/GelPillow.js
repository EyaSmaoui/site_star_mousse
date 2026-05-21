import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";

/* ─────────────────────────────────────────
   DATA — Oreiller Gel Pillow
   Prix : 209,00 DT (En promotion)
───────────────────────────────────────── */
const PRODUCT = {
  name: "Oreiller Gel Pillow",
  category: "Oreiller",
  tag: "INNOVATION RAFRAÎCHISSANTE - LIVRAISON GRATUITE",
  tagColor: "#3b82f6", // Bleu frais pour l'aspect Gel/Frais
  images: [
    "/oreiller_gel_pillow.jpg", 
    "/oreiller_gel_pillow.jpg",
    "/oreiller_gel_pillow.jpg",
  ],
  price: 209,
  oldPrice: 279,
  status: "Rupture de stock",
  dimensions: "60 x 40 x 15 cm",
  features: [
    "Technologie de Gel rafraîchissant intégrée",
    "Conception ergonomique (tête et cou)",
    "Régulation thermique continue",
    "Adapté à toutes les positions de sommeil",
    "Tissu respirant de haute qualité",
    "Propriétés hypoallergéniques",
    "Entretien facile et grande durabilité",
    "Réduction des tensions cervicales",
  ],
};

const OreillerGelPillow = () => {
  const [qty, setQty] = useState(1);
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
        .ssn-main-img { width: 100%; border-radius: 24px; background: #f8fafc; padding: 40px; border: 1px solid #e2e8f0; }
        .ssn-thumbs { display: flex; gap: 12px; margin-top: 20px; }
        .ssn-thumb { width: 90px; height: 65px; border-radius: 12px; cursor: pointer; border: 2px solid transparent; transition: 0.2s; object-fit: cover; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 8px 20px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; }
        .ssn-status { color: #ef4444; font-weight: 700; font-size: 14px; margin-bottom: 10px; display: block; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 44px; color: #0f172a; margin-bottom: 15px; }
        
        .ssn-price-area { margin: 25px 0; padding: 30px; background: #f0f7ff; border-radius: 20px; border: 1px solid #e0eefe; }
        .ssn-price-now { font-size: 40px; font-weight: 700; color: #1d4ed8; }
        .ssn-price-old { text-decoration: line-through; color: #94a3b8; margin-left: 20px; font-size: 24px; }

        .ssn-info-pill { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; padding: 15px; background: #fff; border: 1px solid #e2e8f0; border-radius: 15px; width: fit-content; }
        
        .ssn-out-stock-box { background: #fee2e2; padding: 25px; border-radius: 20px; border: 1px solid #fecaca; color: #991b1b; text-align: center; }
        .ssn-btn-disabled { width: 100%; padding: 20px; background: #94a3b8; color: #fff; border: none; border-radius: 15px; font-weight: 700; cursor: not-allowed; font-size: 18px; margin-top: 15px; }

        .ssn-tabs { margin-top: 70px; }
        .ssn-tab-nav { display: flex; gap: 50px; border-bottom: 2px solid #f1f5f9; }
        .ssn-tab-btn { padding: 20px 0; cursor: pointer; font-weight: 700; color: #94a3b8; font-size: 17px; position: relative; }
        .ssn-tab-btn.active { color: #1a1a2e; }
        .ssn-tab-btn.active:after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 4px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 900px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 36px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Visuals */}
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-main-img" alt="Oreiller Gel Pillow" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '25px', padding: '20px', background: '#e0f2fe', borderRadius: '15px', color: '#0369a1', fontSize: '15px', textAlign: 'center', border: '1px solid #bae6fd' }}>
                ❄️ Sensation de fraîcheur continue toute la nuit
              </div>
            </div>

            {/* Content */}
            <div className="ssn-fade" style={{ transitionDelay: "0.15s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <span className="ssn-status">⚠ {PRODUCT.status}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#475569', fontSize: '19px', lineHeight: '1.6' }}>L'oreiller innovant qui combine technologie de gel rafraîchissant et design ergonomique.</p>

              <div className="ssn-price-area">
                <span className="ssn-price-now">{fmt(PRODUCT.price)}</span>
                <span className="ssn-price-old">{fmt(PRODUCT.oldPrice)}</span>
                <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#1d4ed8', fontWeight: '600' }}>Livraison gratuite incluse</p>
              </div>

              <div className="ssn-info-pill">
                <span style={{ fontSize: '20px' }}>📏</span>
                <span style={{ fontWeight: '600' }}>Dimensions : {PRODUCT.dimensions}</span>
              </div>

              <div className="ssn-out-stock-box">
                <p style={{ fontWeight: '700', marginBottom: '5px' }}>Ce produit est actuellement victime de son succès.</p>
                <p style={{ fontSize: '14px' }}>Nous mettons tout en œuvre pour un réapprovisionnement rapide.</p>
                <button className="ssn-btn-disabled">RUPTURE DE STOCK</button>
              </div>
            </div>
          </div>

          <div className="ssn-tabs ssn-fade">
            <div className="ssn-tab-nav">
              <div className={`ssn-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Innovation & Confort</div>
              <div className={`ssn-tab-btn ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Fiche Technique</div>
            </div>
            
            <div style={{ padding: '50px 0', lineHeight: '2', color: '#334155', fontSize: '17px' }}>
              {activeTab === 'desc' ? (
                <div style={{ maxWidth: '900px' }}>
                  <p>Profitez d'un confort exceptionnel avec l'<strong>Oreiller Gel Pillow</strong>. Cet oreiller intègre un gel spécial qui <strong>régule la température</strong>, vous gardant au frais pendant les nuits chaudes.</p>
                  <p style={{ marginTop: '20px' }}>Son <strong>support ergonomique</strong> est conçu pour épouser parfaitement la forme de votre tête et de votre cou, assurant un alignement optimal de la colonne vertébrale. Il aide ainsi à réduire les tensions et les douleurs cervicales pour un réveil frais et dispos.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '20px', background: '#f8fafc', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f1f5f9' }}>
                      <span style={{ color: PRODUCT.tagColor, fontWeight: 'bold' }}>✓</span> {f}
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

export default OreillerGelPillow;