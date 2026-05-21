import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../../services/orderService";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import OrderCheckout from "../../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Matelas Relax Pillow (Gamme Souple / Pillow Top)
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas Relax Pillow",
  tag: "PILLOW TOP - MÉMOIRE DE FORME",
  tagColor: "#ec4899", // Rose/Fuchsia pour le côté "soft/moelleux"
  rating: 5.0,
  reviewCount: 184,
  delivery: 0, // Livraison gratuite mentionnée
  images: [
    "/relax_pillow.png", 
    "/relax_pillow1.png",
    "/relax_pillow.png",
  ],
  // Plage de prix : 950 DT à 2030 DT
  sizes: [
    { label: "90*190",   price: 950,   oldPrice: 1180 }, // Prix exact fiche
    { label: "140*190",  price: 1350,  oldPrice: 1680 },
    { label: "160*190",  price: 1520,  oldPrice: 1890 },
    { label: "180*200",  price: 1880,  oldPrice: 2320 },
    { label: "190*190",  price: 2030,  oldPrice: 2510 },
  ],
  features: [
    "Hauteur Généreuse de 33 cm",
    "Couche de 8 cm de Mousse à Mémoire de Forme",
    "Technologie Ressorts Ensachés (Indépendance de couchage)",
    "Supporte jusqu'à 130kg par personne",
    "Réversible : Face Mémoire de forme / Face Mi-ferme",
    "Tissu 100% Coton anti-acarien et hypoallergénique",
    "Aérateur anti-humidité intégré",
    "Garantie Totale : 10 ans",
  ],
};

const RelaxPillow = () => {
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
        .ssn-main-img { width: 100%; border-radius: 24px; background: #fff; padding: 30px; border: 1px solid #f0f0f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
        .ssn-thumbs { display: flex; gap: 12px; margin-top: 15px; }
        .ssn-thumb { width: 85px; height: 60px; border-radius: 12px; cursor: pointer; border: 2px solid transparent; transition: 0.2s; object-fit: cover; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 6px 18px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-bottom: 15px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 42px; color: #0f172a; margin-bottom: 10px; line-height: 1.1; }
        
        .ssn-price-area { margin: 25px 0; padding: 25px; background: #fff5f7; border-radius: 20px; border: 1px solid #ffe4e9; }
        .ssn-price-now { font-size: 38px; font-weight: 700; color: #be185d; }
        .ssn-price-old { text-decoration: line-through; color: #94a3b8; margin-left: 15px; font-size: 22px; }

        .ssn-label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 15px; display: block; }
        .ssn-size-flex { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 35px; }
        .ssn-size-opt { padding: 14px 20px; border: 1px solid #e2e8f0; border-radius: 14px; background: #fff; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .ssn-size-opt.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

        .ssn-order-box { background: #ffffff; padding: 30px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.07); }
        .ssn-input { width: 100%; padding: 16px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 14px; font-size: 15px; outline: none; }
        .ssn-input:focus { border-color: ${PRODUCT.tagColor}; }
        .ssn-btn-buy { width: 100%; padding: 18px; background: #1a1a2e; color: #fff; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; font-size: 18px; transition: 0.3s; margin-top: 10px; }
        .ssn-btn-buy:hover { background: #000; transform: translateY(-3px); }

        .ssn-tabs { margin-top: 60px; }
        .ssn-tab-nav { display: flex; gap: 40px; border-bottom: 1px solid #f1f5f9; }
        .ssn-tab-btn { padding: 20px 0; cursor: pointer; font-weight: 700; color: #94a3b8; position: relative; }
        .ssn-tab-btn.active { color: #1a1a2e; }
        .ssn-tab-btn.active:after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 850px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 34px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Visuals */}
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-main-img" alt="Matelas Relax Pillow" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '20px', padding: '15px', background: '#fdf2f8', borderRadius: '15px', color: '#be185d', fontSize: '14px', textAlign: 'center', border: '1px solid #fbcfe8', fontWeight: '600' }}>
                ✨ Élu meilleur confort "Gamme Souple" 2026
              </div>
            </div>

            {/* Content */}
            <div className="ssn-fade" style={{ transitionDelay: "0.1s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#64748b', fontSize: '18px' }}>Pillow Top : L'expérience du sommeil en apesanteur</p>

              <div className="ssn-price-area">
                <span className="ssn-price-now">{fmt(selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <span className="ssn-price-old">{fmt(selectedSize?.oldPrice ?? selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
              </div>

              <span className="ssn-label">Dimensions :</span>
              <div className="ssn-size-flex">
                {PRODUCT.sizes.map((s) => (
                  <button key={s.label} className={`ssn-size-opt ${selectedSize?.label === s.label ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
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

          <div className="ssn-tabs ssn-fade">
            <div className="ssn-tab-nav">
              <div className={`ssn-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Description</div>
              <div className={`ssn-tab-btn ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Fiche Technique</div>
            </div>
            
            <div style={{ padding: '40px 0', lineHeight: '1.8', color: '#475569', fontSize: '16px' }}>
              {activeTab === 'desc' ? (
                <div>
                  <p>Découvrez le confort ultime avec le <strong>Matelas Relax Pillow</strong> de Super Siesta. Sa conception unique intègre une <strong>mousse à mémoire de forme de 8 cm</strong> qui s'adapte parfaitement aux contours de votre corps pour un soutien optimal.</p>
                  <p style={{ marginTop: '15px' }}>Avec une <strong>hauteur luxueuse de 33 cm</strong>, il offre un accueil exceptionnel tout en supportant jusqu'à 130 kg par personne. Grâce à ses ressorts ensachés, profitez d'une indépendance de couchage totale : les mouvements de votre partenaire ne vous dérangeront plus.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: PRODUCT.tagColor }}>✔</span> {f}
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

export default RelaxPillow;