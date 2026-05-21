import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../services/orderService";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import OrderCheckout from "../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Matelas ressort Confort Plus
   Prix extraits de la boutique officielle
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas ressort Confort Plus",
  tag: "PROMO -32%",
  tagColor: "#e63946",
  rating: 4.8,
  reviewCount: 124,
  delivery: 8, // Frais de livraison standards en Tunisie
  images: [
    "/confort.png", 
    "/confort.png",
    "/confort.png",
  ],
  // Prix exacts basés sur la boutique officielle
  sizes: [
    { label: "80*190",  price: 219, oldPrice: 322 },
    { label: "90*190",  price: 231, oldPrice: 340 },
    { label: "120*190", price: 288, oldPrice: 424 },
    { label: "140*190", price: 321, oldPrice: 472 },
    { label: "160*190", price: 349, oldPrice: 513 },
  ],
  features: [
    "Hauteur 22 cm (+/- 1cm)",
    "Ressorts biconiques (Bonnell) fil d'acier 2,2 mm",
    "Soutien Ferme (80 ressorts / m²)",
    "Mousse polyuréthane haute densité",
    "Tissu stretch de haute qualité",
    "Matelas réversible (Face Été / Face Hiver)",
    "Traitement anti-acarien et anti-allergique",
    "Garantie 5 ans",
  ],
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const ConfortPlus = () => {
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

  const subtotal = (selectedSize?.price ?? PRODUCT.price ?? 0) * qty;
  const total    = subtotal + PRODUCT.delivery;
  const fmt      = (n) => n.toFixed(3).replace(".", ",") + " DT";

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
      if (error.status === 401 || message.toLowerCase().includes('connect')) {
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

        /* Gallery */
        .ssn-gallery-main { width: 100%; border-radius: 20px; background: #f9f9fb; padding: 30px; border: 1px solid #eee; }
        .ssn-thumbs { display: flex; gap: 10px; margin-top: 15px; }
        .ssn-thumb { width: 80px; height: 60px; border-radius: 8px; cursor: pointer; border: 2px solid transparent; object-fit: cover; background: #f9f9fb; }
        .ssn-thumb.active { border-color: #1a1a2e; }

        /* Right Panel */
        .ssn-badge { display: inline-block; padding: 4px 12px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 50px; font-size: 12px; font-weight: 700; margin-bottom: 10px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 10px; }
        
        .ssn-price-area { margin: 20px 0; }
        .ssn-current-price { font-size: 28px; font-weight: 700; color: #1a1a2e; }
        .ssn-old-price { text-decoration: line-through; color: #999; margin-left: 10px; font-size: 18px; }

        .ssn-selector-label { font-size: 13px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 10px; display: block; }
        .ssn-size-btns { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 25px; }
        .ssn-size-btn { padding: 10px 18px; border: 1.5px solid #eee; border-radius: 10px; background: #fff; cursor: pointer; transition: 0.2s; font-weight: 500; }
        .ssn-size-btn.active { border-color: #1a1a2e; background: #1a1a2e; color: #fff; }

        /* Form */
        .ssn-order-box { background: #f4f4f9; padding: 25px; border-radius: 15px; border: 1px solid #e0e0e0; }
        .ssn-input { width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 8px; outline: none; }
        .ssn-input:focus { border-color: #1a1a2e; }

        .ssn-summary { border-top: 1px solid #ddd; margin-top: 15px; padding-top: 15px; }
        .ssn-summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
        .ssn-total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 18px; margin-top: 10px; color: #1a1a2e; }

        .ssn-actions { display: flex; gap: 10px; margin-top: 20px; }
        .ssn-btn-main { flex: 1; padding: 15px; background: #1a1a2e; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
        .ssn-btn-main:hover { opacity: 0.9; }

        /* Tabs */
        .ssn-tabs { margin-top: 60px; border-top: 1px solid #eee; }
        .ssn-tab-nav { display: flex; gap: 30px; border-bottom: 1px solid #eee; }
        .ssn-tab-btn { padding: 15px 0; border: none; background: none; font-weight: 700; cursor: pointer; color: #999; border-bottom: 2px solid transparent; }
        .ssn-tab-btn.active { color: #1a1a2e; border-bottom-color: #1a1a2e; }
        .ssn-tab-content { padding: 30px 0; line-height: 1.6; }
        .ssn-feat-list { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; list-style: none; }

        @media (max-width: 850px) {
          .ssn-grid { grid-template-columns: 1fr; }
          .ssn-feat-list { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Colonne Gauche : Images */}
            <div className="ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-gallery-main" alt="Matelas" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    className={`ssn-thumb ${activeImg === i ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            </div>

            {/* Colonne Droite : Infos et Achat */}
            <div className="ssn-fade" style={{ transitionDelay: "0.2s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              
              <div className="ssn-price-area">
                <span className="ssn-current-price">{fmt(selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <span className="ssn-old-price">{fmt(selectedSize?.oldPrice ?? selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
              </div>

              <span className="ssn-selector-label">Choisir la dimension :</span>
              <div className="ssn-size-btns">
                {PRODUCT.sizes.map((s) => (
                  <button 
                    key={s.label} 
                    className={`ssn-size-btn ${selectedSize?.label === s.label ? "active" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <OrderCheckout
                form={form}
                setForm={setForm}
                subtotal={subtotal}
                delivery={PRODUCT.delivery}
                total={total}
                fmt={fmt}
                qty={qty}
                setQty={setQty}
                loading={loading}
                onSubmit={handleOrder}
              />
            </div>
          </div>

          {/* Section Détails */}
          <div className="ssn-tabs ssn-fade">
            <div className="ssn-tab-nav">
              <button className={`ssn-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Description</button>
              <button className={`ssn-tab-btn ${activeTab === 'avis' ? 'active' : ''}`} onClick={() => setActiveTab('avis')}>Avis ({PRODUCT.reviewCount})</button>
            </div>
            
            <div className="ssn-tab-content">
              {activeTab === 'desc' ? (
                <>
                  <p style={{ marginBottom: '20px' }}>
                    Le matelas <strong>Confort Plus</strong> de Super Siesta offre un équilibre parfait entre fermeté et accueil. 
                    Sa technologie de ressorts Bonnell assure une excellente aération et une grande durabilité.
                  </p>
                  <ul className="ssn-feat-list">
                    {PRODUCT.features.map((f, i) => (
                      <li key={i}>✅ {f}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Excellent rapport qualité/prix. Livraison rapide en 48h. (Avis certifiés)</p>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ConfortPlus;