import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../../services/orderService";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import OrderCheckout from "../../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Matelas Venise Pillow (Gamme Souple)
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas Venise Pillow",
  tag: "PILLOW TOP - MÉMOIRE DE FORME",
  tagColor: "#3498db", // Bleu serein pour la gamme Venise
  rating: 4.8,
  reviewCount: 124,
  delivery: 0, // Livraison gratuite mentionnée
  images: [
    "/venise_pillow.png", 
    "/venise_pillow.png",
    "/venise_pillow.png",
  ],
  // Plage de prix : 650.00 DT à 1,400.00 DT
  sizes: [
    { label: "90*190",   price: 650,   oldPrice: 810 }, // Prix exact fiche
    { label: "120*190",  price: 880,   oldPrice: 1100 },
    { label: "140*190",  price: 1050,  oldPrice: 1310 },
    { label: "160*190",  price: 1220,  oldPrice: 1525 },
    { label: "180*200",  price: 1400,  oldPrice: 1750 },
  ],
  features: [
    "Mousse à mémoire de forme de 8 cm", //
    "Hauteur généreuse de 31 cm", //
    "Jusqu’à 90 kg par personne (180 kg par couple)", //
    "Technologie Ressorts Bonnell (Soutien équilibré)", //
    "Matelas réversible été/hiver", //
    "Tissu 100% coton anti-acarien et hypoallergénique", //
    "Résistant au feu (Normes de sécurité)", //
    "Garantie d'usine : 5 ans", //
  ],
};

const VenisePillow = () => {
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[0]);
  const [qty, setQty]                   = useState(1);
  const [activeImg, setActiveImg]       = useState(0);
  const [activeTab, setActiveTab]       = useState("desc");
  const [form, setForm]                 = useState({ nom: "", tel: "", adresse: "" });
  const [loading, setLoading] = useState(false);
  const observerRef                     = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".ssn-fade").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const total = (selectedSize?.price ?? PRODUCT.price ?? 0) * qty;
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
        .ssn-img-main { width: 100%; border-radius: 20px; background: #fff; padding: 25px; border: 1px solid #f0f0f0; box-shadow: 0 5px 20px rgba(0,0,0,0.02); }
        .ssn-thumbs { display: flex; gap: 10px; margin-top: 15px; }
        .ssn-thumb { width: 80px; height: 60px; border-radius: 10px; cursor: pointer; border: 2px solid transparent; object-fit: cover; transition: 0.2s; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 6px 15px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 4px; font-size: 11px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 38px; color: #0f172a; margin-bottom: 10px; }
        
        .ssn-price-wrap { margin: 25px 0; padding: 25px; background: #f0f7ff; border-radius: 15px; border: 1px solid #e0efff; }
        .ssn-price-now { font-size: 34px; font-weight: 700; color: #2c3e50; }
        .ssn-price-old { text-decoration: line-through; color: #94a3b8; margin-left: 15px; font-size: 20px; }

        .ssn-label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 15px; display: block; }
        .ssn-size-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 35px; }
        .ssn-size-btn { padding: 12px 18px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; cursor: pointer; font-weight: 600; }
        .ssn-size-btn.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }

        .ssn-form-card { background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 15px 40px rgba(0,0,0,0.05); }
        .ssn-input { width: 100%; padding: 14px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 15px; }
        .ssn-btn-order { width: 100%; padding: 18px; background: #1a1a2e; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 17px; transition: 0.3s; }
        .ssn-btn-order:hover { background: #34495e; transform: translateY(-2px); }

        .ssn-tabs { margin-top: 60px; }
        .ssn-tab-nav { display: flex; gap: 40px; border-bottom: 1px solid #f1f5f9; }
        .ssn-tab-link { padding: 15px 0; cursor: pointer; font-weight: 700; color: #94a3b8; position: relative; }
        .ssn-tab-link.active { color: #1a1a2e; }
        .ssn-tab-link.active:after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 850px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 32px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Gallery Section */}
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-img-main" alt="Matelas Venise Pillow" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '20px', padding: '15px', background: '#ecf0f1', borderRadius: '12px', color: '#2c3e50', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
                🚚 Livraison gratuite incluse
              </div>
            </div>

            {/* Product Info Section */}
            <div className="ssn-fade" style={{ transitionDelay: "0.1s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#64748b', fontSize: '18px' }}>Gamme souple : Le confort absolu</p>

              <div className="ssn-price-wrap">
                <span className="ssn-price-now">{fmt(selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <span className="ssn-price-old">{fmt(selectedSize?.oldPrice ?? selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
              </div>

              <span className="ssn-label">Dimensions au choix :</span>
              <div className="ssn-size-grid">
                {PRODUCT.sizes.map((s) => (
                  <button key={s.label} className={`ssn-size-btn ${selectedSize?.label === s.label ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
                    {s.label}
                  </button>
                ))}
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

          {/* Technical Tabs */}
          <div className="ssn-tabs ssn-fade">
            <div className="ssn-tab-nav">
              <div className={`ssn-tab-link ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Description du produit</div>
              <div className={`ssn-tab-link ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Caractéristiques techniques</div>
            </div>
            
            <div style={{ padding: '40px 0', lineHeight: '1.8', color: '#475569', fontSize: '16px' }}>
              {activeTab === 'desc' ? (
                <div>
                  <p>Découvrez le <strong>Matelas Venise Pillow</strong> de Super Siesta, un produit d’excellence garantissant un sommeil de qualité supérieure. Ce matelas haut de gamme combine une technologie de pointe avec des matériaux nobles pour un confort ultime.</p>
                  <p style={{ marginTop: '15px' }}>Sa <strong>mousse à mémoire de forme de 8 cm</strong> s'adapte précisément à votre morphologie, réduisant la pression sur les points sensibles et permettant une régénération musculaire optimale pendant la nuit.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <span style={{ color: PRODUCT.tagColor, marginRight: '8px' }}>✦</span> {f}
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

export default VenisePillow;