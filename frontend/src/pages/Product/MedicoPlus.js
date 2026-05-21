import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { submitProductOrder } from "../../services/orderService";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import OrderCheckout from "../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Matelas Medico Plus (Officiel)
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas Medico Plus",
  tag: "LIVRAISON GRATUITE",
  tagColor: "#2980b9",
  rating: 4.9,
  reviewCount: 210,
  delivery: 0, // Gratuit selon la fiche
  images: [
    "/medico.jpg", 
    "/medico.jpg",
    "/medico.jpg",
  ],
  // Plage de prix : 440 DT à 1530 DT
  sizes: [
    { label: "90*190",   price: 440,   oldPrice: 580 },
    { label: "140*190",  price: 830,   oldPrice: 1050 }, // Prix spécifique fiche
    { label: "160*190",  price: 940,   oldPrice: 1210 },
    { label: "180*200",  price: 1350,  oldPrice: 1720 },
    { label: "190*190",  price: 1530,  oldPrice: 1960 },
  ],
  features: [
    "Hauteur 25 cm",
    "Technologie Ressorts Bonnell (Répartition équilibrée)",
    "Supporte jusqu'à 110kg par personne",
    "Double Face : Mi-ferme (Face 1) & Relaxante souple (Face 2)",
    "Tissu traité anti-acarien et résistant au feu",
    "Garantie 9 ans (Qualité supérieure)",
    "Indéal pour posture de sommeil saine",
  ],
};

const MedicoPlus = () => {
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[1]); // 140*190 par défaut
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

  const total = (selectedSize?.price ?? PRODUCT.price ?? 0) * qty + PRODUCT.delivery;
  const fmt = (n) => n.toFixed(3).replace(".", ",") + " DT";

  const handleOrder = async () => {
    if (!form.nom?.trim() || !form.tel?.trim() || !form.adresse?.trim()) {
      toast.warning("Veuillez remplir les champs obligatoires pour valider votre commande.");
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
      toast.success(`✅ Commande reçue ! Référence : ${response._id?.slice(-6) || 'OK'}`);
      setForm({ nom: "", tel: "", adresse: "", email: "" });
      setTimeout(() => {
        window.location.href = localStorage.getItem("token") ? "/client-dashboard" : "/products";
      }, 1800);
    } catch (error) {
      console.error("Erreur commande :", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Erreur lors de l'envoi de la commande. Réessayez plus tard.";
      toast.error(errorMessage);
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
        
        .ssn-gallery-main { width: 100%; border-radius: 15px; border: 1px solid #f0f0f0; padding: 20px; }
        .ssn-thumbs { display: flex; gap: 10px; margin-top: 15px; }
        .ssn-thumb { width: 70px; height: 50px; border-radius: 5px; cursor: pointer; border: 2px solid transparent; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 5px 15px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 4px; font-size: 11px; font-weight: 700; margin-bottom: 10px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 36px; color: #0f172a; margin-bottom: 15px; }
        
        .ssn-price-box { margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border-left: 4px solid ${PRODUCT.tagColor}; }
        .ssn-current-price { font-size: 32px; font-weight: 700; color: #1e293b; }
        .ssn-old-price { text-decoration: line-through; color: #94a3b8; margin-left: 15px; font-size: 20px; }

        .ssn-size-btn { padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; cursor: pointer; min-width: 90px; font-weight: 500; }
        .ssn-size-btn.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }

        .ssn-order-card { background: #fff; padding: 25px; border-radius: 15px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .ssn-input { width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }
        .ssn-btn-buy { width: 100%; padding: 16px; background: #1a1a2e; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 16px; transition: 0.3s; }
        .ssn-btn-buy:hover { background: #000; transform: scale(1.02); }

        .ssn-tab-nav { display: flex; gap: 30px; border-bottom: 2px solid #f1f5f9; margin-top: 50px; }
        .ssn-tab-link { padding: 15px 0; cursor: pointer; font-weight: 700; color: #64748b; position: relative; }
        .ssn-tab-link.active { color: #1a1a2e; }
        .ssn-tab-link.active:after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: #1a1a2e; }

        @media (max-width: 800px) { .ssn-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Gauche : Images */}
            <div className="ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-gallery-main" alt="Matelas Medico Plus" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
            </div>

            {/* Droite : Infos */}
            <div className="ssn-fade" style={{ transitionDelay: "0.1s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#64748b' }}>Catégorie : Matelas orthomédicale</p>

              <div className="ssn-price-box">
                <span className="ssn-current-price">{fmt(selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <span className="ssn-old-price">{fmt(selectedSize?.oldPrice ?? selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
              </div>

              <p style={{ fontWeight: '700', marginBottom: '10px', fontSize: '14px' }}>DIMENSIONS :</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                {PRODUCT.sizes.map((s) => (
                  <button key={s.label} className={`ssn-size-btn ${selectedSize?.label === s.label ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
                    {s.label}
                  </button>
                ))}
              </div>

              <OrderCheckout
                form={form}
                setForm={setForm}
                subtotal={total - PRODUCT.delivery}
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

          {/* Onglets Techniques */}
          <div className="ssn-tabs ssn-fade">
            <div className="ssn-tab-nav">
              <div className={`ssn-tab-link ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Description</div>
              <div className={`ssn-tab-link ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Détails techniques</div>
            </div>
            
            <div style={{ padding: '30px 0', lineHeight: '1.8' }}>
              {activeTab === 'desc' ? (
                <div>
                  <p>Le <strong>Matelas Medico Plus</strong> est un bijou de technologie pour votre santé. Avec ses ressorts Bonnell, il assure une répartition équilibrée du poids pour éliminer les tensions musculaires.</p>
                  <ul style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', listStyle: 'none' }}>
                    {PRODUCT.features.map((f, i) => (
                      <li key={i} style={{ background: '#f8fafc', padding: '10px', borderRadius: '5px' }}>✅ {f}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Matelas réversible : Face 1 mi-ferme / Face 2 relaxante. Conçu pour supporter jusqu'à 110kg. Garantie d'usine de 9 ans incluse.</p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MedicoPlus;