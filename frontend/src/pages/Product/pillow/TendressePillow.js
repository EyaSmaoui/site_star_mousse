import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../../services/orderService";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import OrderCheckout from "../../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Matelas Tendresse Pillow (L'Ultime Confort)
   Prix : 1 160,00 DT – 2 630,00 DT
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas Tendresse Pillow",
  brand: "Super Siesta",
  tag: "PRESTIGE PILLOW TOP - MÉMOIRE DE FORME",
  tagColor: "#8e44ad", // Violet royal pour le summum de la gamme
  images: [
    "/tendresse_pillow.png", 
    "/tendresse_pillow1.png",
    "/tendresse_pillow.png",
  ],
  // Plage de prix : 1,160.00 DT à 2,630.00 DT
  sizes: [
    { label: "90*190",   price: 1160,  oldPrice: 1450 },
    { label: "140*190",  price: 1780,  oldPrice: 2225 },
    { label: "160*190",  price: 1990,  oldPrice: 2485 },
    { label: "180*200",  price: 2450,  oldPrice: 3060 },
    { label: "190*190",  price: 2630,  oldPrice: 3285 },
  ],
  features: [
    "Hauteur d'Exception : 35 cm",
    "Couche de 8 cm de Mousse à Mémoire de Forme",
    "Technologie Ressorts Ensachés (Indépendance de couchage)",
    "Supporte jusqu'à 150Kg par personne",
    "Gamme Souple : Ajustement parfait à la morphologie",
    "Matelas Réversible pour un confort saisonnier",
    "Tissu Premium : Anti-acarien, Antitaches et Anti-humidité",
    "Résistant au feu (Standards de sécurité élevés)",
    "Garantie Longue Durée : 11 ans",
  ],
};

const TendressePillow = () => {
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
        .ssn-fade { opacity: 0; transform: translateY(20px); transition: all 0.7s ease-out; }
        .ssn-fade.visible { opacity: 1; transform: translateY(0); }
        .ssn-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .ssn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 30px; }
        
        .ssn-gallery { position: sticky; top: 120px; }
        .ssn-main-img { width: 100%; border-radius: 30px; background: #fff; padding: 40px; border: 1px solid #f3f4f6; box-shadow: 0 15px 45px rgba(0,0,0,0.04); }
        .ssn-thumbs { display: flex; gap: 15px; margin-top: 20px; }
        .ssn-thumb { width: 95px; height: 70px; border-radius: 15px; cursor: pointer; border: 2px solid transparent; transition: 0.3s; object-fit: cover; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 10px 25px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 8px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 20px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 46px; color: #0f172a; margin-bottom: 15px; line-height: 1.2; }
        
        .ssn-price-card { margin: 30px 0; padding: 30px; background: #faf5ff; border-radius: 25px; border: 1px solid #f3e8ff; }
        .ssn-price-now { font-size: 42px; font-weight: 700; color: #6b21a8; }
        .ssn-price-old { text-decoration: line-through; color: #94a3b8; margin-left: 20px; font-size: 24px; }

        .ssn-label { font-size: 13px; font-weight: 700; color: #1e293b; text-transform: uppercase; margin-bottom: 15px; display: block; }
        .ssn-size-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; margin-bottom: 40px; }
        .ssn-size-btn { padding: 16px; border: 1px solid #e2e8f0; border-radius: 15px; background: #fff; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .ssn-size-btn.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; transform: scale(1.05); }

        .ssn-form-box { background: #ffffff; padding: 40px; border-radius: 30px; border: 1px solid #e2e8f0; box-shadow: 0 25px 60px rgba(0,0,0,0.08); }
        .ssn-input { width: 100%; padding: 18px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 15px; font-size: 16px; transition: 0.3s; }
        .ssn-input:focus { border-color: ${PRODUCT.tagColor}; box-shadow: 0 0 0 4px rgba(142, 68, 173, 0.1); }
        .ssn-cta { width: 100%; padding: 22px; background: #1a1a2e; color: #fff; border: none; border-radius: 15px; font-weight: 700; cursor: pointer; font-size: 19px; transition: 0.4s; }
        .ssn-cta:hover { background: #000; transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }

        .ssn-tabs-sec { margin-top: 80px; }
        .ssn-tab-header { display: flex; gap: 60px; border-bottom: 2px solid #f1f5f9; }
        .ssn-tab-link { padding: 25px 0; cursor: pointer; font-weight: 700; color: #94a3b8; font-size: 18px; position: relative; }
        .ssn-tab-link.active { color: #1a1a2e; }
        .ssn-tab-link.active:after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 4px; background: ${PRODUCT.tagColor}; border-radius: 2px; }

        @media (max-width: 900px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 36px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Left Side: Images */}
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-main-img" alt="Matelas Tendresse Pillow" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '30px', padding: '20px', background: '#f5f3ff', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #ddd6fe' }}>
                <div style={{ fontSize: '30px' }}>⭐</div>
                <div>
                  <h4 style={{ margin: 0, color: '#5b21b6' }}>Excellence Super Siesta</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#7c3aed' }}>Le plus haut niveau de confort de notre collection.</p>
                </div>
              </div>
            </div>

            {/* Right Side: Details & Order */}
            <div className="ssn-fade" style={{ transitionDelay: "0.15s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#475569', fontSize: '20px', lineHeight: '1.6' }}>Une expérience de sommeil améliorée combinant ressorts ensachés et 8cm de mémoire de forme.</p>

              <div className="ssn-price-card">
                <span className="ssn-price-now">{fmt(selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <span className="ssn-price-old">{fmt(selectedSize?.oldPrice ?? selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#7c3aed', fontWeight: '600' }}>✓ Livraison Gratuite incluse</p>
              </div>

              <span className="ssn-label">Dimensions disponibles :</span>
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

          {/* Bottom Tabs */}
          <div className="ssn-tabs-sec ssn-fade">
            <div className="ssn-tab-header">
              <div className={`ssn-tab-link ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>L'Innovation Tendresse</div>
              <div className={`ssn-tab-link ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Fiche Technique</div>
            </div>
            
            <div style={{ padding: '50px 0', lineHeight: '2', color: '#334155', fontSize: '18px' }}>
              {activeTab === 'desc' ? (
                <div style={{ maxWidth: '800px' }}>
                  <p>Le <strong>Matelas Tendresse Pillow</strong> n’est pas juste un matelas, c’est un investissement dans votre santé. Sa technologie de <strong>ressorts ensachés</strong> garantit une indépendance de couchage totale : les mouvements de votre partenaire ne perturbent plus votre sommeil.</p>
                  <p style={{ marginTop: '20px' }}>Avec son <strong>surmatelas intégré (Pillow Top) de 8 cm en mémoire de forme</strong>, il s'ajuste parfaitement à chaque courbe de votre corps, offrant une sensation d'apesanteur et un réveil plein de vitalité.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '25px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                      <span style={{ color: PRODUCT.tagColor, fontWeight: 'bold', marginRight: '10px' }}>◈</span> {f}
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

export default TendressePillow;