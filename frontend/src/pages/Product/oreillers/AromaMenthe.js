import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../../services/orderService";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import OrderCheckout from "../../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Oreiller Médical Aroma Therapy Menthe
   Prix : 175,00 DT
───────────────────────────────────────── */
const PRODUCT = {
  name: "Oreiller Médical Aroma Therapy Menthe",
  category: "Oreiller",
  tag: "AROMATHÉRAPIE & FRAÎCHEUR",
  tagColor: "#2ecc71", // Vert menthe
  images: [
    "/oreiller_menthe.png", 
    "/oreiller_menthe.png",
  ],
  price: 175,
  dimensions: "60 x 40 x 14 cm",
  features: [
    "Fabriqué en mousse visco de qualité supérieure (visco-élastique)",
    "Huiles d’aromathérapie à base d’extraits naturels de Menthe",
    "Canaux d’air innovants au centre pour le soutien de la tête",
    "Petits canaux périphériques pour un soutien supérieur du cou",
    "Conception ergonomique enveloppant la colonne vertébrale",
    "Tissu tricoté en micro spandex blanc pour une douceur inégalée",
    "Propriétés curatives : aide à réduire les maux de tête",
    "Usage polyvalent : ronflement, femmes enceintes, problèmes de cou/dos",
  ],
};

const OreillerAromaMenthe = () => {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("desc");
  const [form, setForm] = useState({ nom: "", tel: "", adresse: "" });
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".ssn-fade").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const total = (PRODUCT.price * qty);
  const fmt = (n) => n.toFixed(2).replace(".", ",") + " DT";

  const handleOrder = async () => {
    if (!form.nom?.trim() || !form.tel?.trim() || !form.adresse?.trim()) {
      alert("Veuillez remplir les champs obligatoires pour valider votre commande.");
      return;
    }

    setLoading(true);
    const productLabel = PRODUCT.name + (typeof selectedSize !== "undefined" && selectedSize?.label ? ` (${selectedSize.label})` : "");
    const unitPrice = (typeof selectedSize !== "undefined" ? selectedSize?.price : PRODUCT.price) ?? PRODUCT.price ?? 0;
    const orderData = {
      name: form.nom.trim(),
      email: form.email?.trim(),
      phone: form.tel.trim(),
      address: form.adresse.trim(),
      products: [{ name: productLabel, quantity: qty || 1, price: unitPrice }],
      total: unitPrice * (qty || 1),
    };

    try {
      const response = await submitProductOrder(orderData);
      alert(`✅ Commande envoyée ! Référence : ${response.data._id?.slice(-6) || 'OK'}`);
      setForm({ nom: "", tel: "", adresse: "", email: "" });
      setTimeout(() => {
        window.location.href = localStorage.getItem("token") ? "/client-dashboard" : "/products";
      }, 1800);
    } catch (error) {
      console.error("Erreur commande :", error);
      const message =
        error.message ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erreur lors de l'envoi de la commande. Réessayez plus tard.";
      alert(message);
      if (error.response?.status === 401 || message.toLowerCase().includes('token')) {
        window.location.href = '/login/client';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');
        .ssn-page { background: #fff; font-family: 'DM Sans', sans-serif; color: #1a1a2e; }
        .ssn-fade { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
        .ssn-fade.visible { opacity: 1; transform: translateY(0); }
        .ssn-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .ssn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 30px; }
        
        .ssn-gallery { position: sticky; top: 100px; }
        .ssn-main-img { width: 100%; border-radius: 20px; background: #fafafa; padding: 30px; border: 1px solid #f0fff4; box-shadow: 0 10px 30px rgba(46, 204, 113, 0.05); }
        .ssn-thumbs { display: flex; gap: 12px; margin-top: 15px; }
        .ssn-thumb { width: 85px; height: 60px; border-radius: 10px; cursor: pointer; border: 2px solid transparent; object-fit: cover; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 8px 18px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-bottom: 15px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 34px; color: #1e293b; margin-bottom: 10px; }
        
        .ssn-price-card { margin: 25px 0; padding: 25px; background: #f0fff4; border-radius: 20px; border: 1px solid #c6f6d5; text-align: center; }
        .ssn-price-val { font-size: 42px; font-weight: 700; color: #276749; }

        .ssn-info-row { display: flex; gap: 15px; margin-bottom: 30px; }
        .ssn-info-item { flex: 1; padding: 15px; background: #fff; border: 1px solid #e2e8f0; border-radius: 15px; text-align: center; font-size: 14px; }
        
        .ssn-order-form { background: #fff; padding: 35px; border-radius: 25px; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.06); }
        .ssn-input { width: 100%; padding: 16px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 12px; outline: none; }
        .ssn-cta { width: 100%; padding: 20px; background: #1a1a2e; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 18px; transition: 0.3s; }
        .ssn-cta:hover { background: #000; transform: translateY(-3px); }

        .ssn-tabs { margin-top: 60px; }
        .ssn-tab-nav { display: flex; gap: 40px; border-bottom: 2px solid #f1f5f9; }
        .ssn-tab-btn { padding: 20px 0; cursor: pointer; font-weight: 700; color: #94a3b8; position: relative; }
        .ssn-tab-btn.active { color: #1a1a2e; }
        .ssn-tab-btn.active:after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 4px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 850px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 28px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Visuals */}
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-main-img" alt="Oreiller Aroma Menthe" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '25px', padding: '20px', background: '#f0fff4', borderRadius: '15px', color: '#276749', fontSize: '14px', textAlign: 'center', border: '1px solid #c6f6d5' }}>
                🍃 Parfum menthe rafraîchissant pour un réveil tonique
              </div>
            </div>

            {/* Content */}
            <div className="ssn-fade" style={{ transitionDelay: "0.1s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#475569', fontSize: '18px', lineHeight: '1.6' }}>Une technologie de moulage avancée offrant un soutien optimal et une respiration confortable.</p>

              <div className="ssn-price-card">
                <span className="ssn-price-val">{fmt(PRODUCT.price)}</span>
                <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#276749', fontWeight: '600' }}>🚚 Livraison Gratuite incluse</p>
              </div>

              <div className="ssn-info-row">
                <div className="ssn-info-item">📏 <b>Taille</b><br/>{PRODUCT.dimensions}</div>
                <div className="ssn-info-item">🌿 <b>Odeur</b><br/>Menthe</div>
                <div className="ssn-info-item">✨ <b>Confort</b><br/>Visco sans CFC</div>
              </div>

              <OrderCheckout
                form={form}
                setForm={setForm}
                subtotal={total}
                delivery={PRODUCT.delivery || 0}
                total={total}
                fmt={fmt}
                qty={qty}
                setQty={setQty}
                loading={loading}
                onSubmit={handleOrder}
              />
            </div>
          </div>

          <div className="ssn-tabs ssn-fade">
            <div className="ssn-tab-nav">
              <div className={`ssn-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Innovation & Sommeil</div>
              <div className={`ssn-tab-btn ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Caractéristiques</div>
            </div>
            
            <div style={{ padding: '40px 0', lineHeight: '1.9', color: '#475569', fontSize: '16px' }}>
              {activeTab === 'desc' ? (
                <div>
                  <p>Découvrez l'<strong>Oreiller Médical Aromathérapie Menthe</strong>, une innovation pour votre confort. Fabriqué avec des huiles d’aromathérapie à base d’extraits naturels, cet oreiller utilise une technologie de moulage avancée pour offrir un soutien optimal.</p>
                  <p style={{ marginTop: '15px' }}>L'aromathérapie apaisante aide à réduire les maux de tête, à accélérer l’endormissement et à apaiser le corps grâce à ses propriétés curatives. Grâce aux arômes diffusés et aux canaux d'air, il permet une respiration confortable et ouvre les pores de la peau.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '15px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #f1f5f9' }}>
                      <span style={{ color: PRODUCT.tagColor }}>🍃</span> {f}
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

export default OreillerAromaMenthe;