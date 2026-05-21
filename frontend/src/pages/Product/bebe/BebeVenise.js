import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../../services/orderService";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import OrderCheckout from "../../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Matelas Bébé Venise
   Prix : 240,00 DT (Promotion)
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas Bébé Venise",
  category: "Matelas bébé",
  tag: "INNOVATION & BIEN-ÊTRE - LIVRAISON GRATUITE",
  tagColor: "#f59e0b", // Ambre pour le côté premium/innovation
  images: [
    "/bebe_venise.jpg", 
    "/bebe_venise.jpg",
  ],
  price: 240,
  oldPrice: 297,
  features: [
    "Hauteur d'exception : 23 cm", //
    "Technologie Ressort Bonnell pour un soutien inébranlable", //
    "Structure box de 2.1mm de diamètre pour une stabilité remarquable", //
    "Matelas réversible : Face Été fraîche / Face Hiver chaleureuse", //
    "Tissu Premium 100% Coton (selon fiche technique)", //
    "Traitement anti-acarien et hypoallergénique", //
    "Résistant au feu pour une sécurité maximale", //
    "Garantie Longue Durée : 5 ans", //
  ],
};

const BebeVenise = () => {
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
  const fmt = (n) => n.toFixed(3).replace(".", ",") + " DT";

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
        .ssn-main-img { width: 100%; border-radius: 20px; background: #fff; padding: 25px; border: 1px solid #fffbeb; box-shadow: 0 10px 40px rgba(245, 158, 11, 0.05); }
        .ssn-thumbs { display: flex; gap: 12px; margin-top: 15px; }
        .ssn-thumb { width: 85px; height: 65px; border-radius: 10px; cursor: pointer; border: 2px solid transparent; object-fit: cover; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 8px 18px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 6px; font-size: 11px; font-weight: 700; margin-bottom: 15px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 40px; color: #1e293b; margin-bottom: 12px; }
        
        .ssn-price-card { margin: 25px 0; padding: 25px; background: #fffbeb; border-radius: 20px; border: 1px solid #fef3c7; }
        .ssn-price-now { font-size: 38px; font-weight: 700; color: #b45309; }
        .ssn-price-old { text-decoration: line-through; color: #94a3b8; margin-left: 15px; font-size: 22px; }

        .ssn-form { background: #fff; padding: 35px; border-radius: 25px; border: 1px solid #e2e8f0; box-shadow: 0 15px 45px rgba(0,0,0,0.07); }
        .ssn-input { width: 100%; padding: 16px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 15px; }
        .ssn-cta { width: 100%; padding: 20px; background: #1a1a2e; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 18px; transition: 0.3s; }
        .ssn-cta:hover { background: #000; transform: translateY(-3px); }

        .ssn-tabs { margin-top: 60px; }
        .ssn-tab-nav { display: flex; gap: 40px; border-bottom: 2px solid #f8fafc; }
        .ssn-tab-btn { padding: 20px 0; cursor: pointer; font-weight: 700; color: #94a3b8; position: relative; }
        .ssn-tab-btn.active { color: #1a1a2e; }
        .ssn-tab-btn.active:after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 4px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 850px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 34px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Gallery Section */}
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-main-img" alt="Matelas Bébé Venise" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '25px', padding: '20px', background: '#fffbeb', borderRadius: '15px', color: '#92400e', fontSize: '14px', textAlign: 'center', border: '1px solid #fef3c7', fontWeight: '500' }}>
                🌟 Une innovation remarquable pour le bien-être de votre nouveau-né
              </div>
            </div>

            {/* Content Section */}
            <div className="ssn-fade" style={{ transitionDelay: "0.1s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#475569', fontSize: '18px', lineHeight: '1.6' }}>Le compagnon idéal pour des nuits paisibles et réparatrices, alliant robustesse et confort premium.</p>

              <div className="ssn-price-card">
                <span className="ssn-price-now">{fmt(PRODUCT.price)}</span>
                <span className="ssn-price-old">{fmt(PRODUCT.oldPrice)}</span>
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
              <div className={`ssn-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Innovation Venise</div>
              <div className={`ssn-tab-btn ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Fiche Technique</div>
            </div>
            
            <div style={{ padding: '40px 0', lineHeight: '1.9', color: '#475569', fontSize: '16px' }}>
              {activeTab === 'desc' ? (
                <div>
                  <p>Faites l’expérience du <strong>Matelas bébé Venise</strong>, une innovation remarquable conçue spécialement pour offrir un soutien inébranlable au développement de votre enfant. Avec sa hauteur de <strong>23 cm</strong>, il allie une stabilité exceptionnelle à une durabilité éprouvée.</p>
                  <p style={{ marginTop: '15px' }}>Sa caractéristique majeure réside dans sa <strong>réversibilité été/hiver</strong>, permettant un confort sur mesure : fraîcheur pour les nuits chaudes et chaleur réconfortante pour l'hiver. Recouvert d'un tissu premium traité anti-acarien, il assure un environnement de sommeil parfaitement hygiénique.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '18px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f1f5f9' }}>
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

export default BebeVenise;