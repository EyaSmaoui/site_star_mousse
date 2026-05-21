import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { submitProductOrder } from "../../services/orderService";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import OrderCheckout from "../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Matelas Tendresse (Luxe Ergonomique)
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas Tendresse",
  tag: "LUXE & VOLUPTÉ - LIVRAISON GRATUITE",
  tagColor: "#d4af37", // Or pour le positionnement Luxe
  rating: 5.0,
  reviewCount: 312,
  delivery: 0,
  images: [
    "/tendresse.jpg", 
    "/tendresse.jpg",
    "/tendresse.jpg",
  ],
  // Plage de prix : 730 DT à 2555 DT
  sizes: [
    { label: "90*190",   price: 730,   oldPrice: 890 },
    { label: "140*190",  price: 1370,  oldPrice: 1665 }, // Prix exact extrait
    { label: "160*190",  price: 1620,  oldPrice: 1980 },
    { label: "180*200",  price: 2150,  oldPrice: 2620 },
    { label: "190*190",  price: 2555,  oldPrice: 3115 },
  ],
  features: [
    "Hauteur Prestige de 30 cm",
    "Technologie Ressorts Ensachés (Indépendance totale)",
    "Supporte jusqu'à 150kg par personne",
    "Tissu Haute Couture : Anti-acarien, Antitaches et Anti-humidité",
    "Alignement parfait de la colonne vertébrale",
    "Matelas réversible (Durabilité prolongée)",
    "Résistance au feu (Normes de sécurité)",
    "Garantie Sérénité : 11 ans",
  ],
};

const Tendresse = () => {
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[1]);
  const [qty, setQty]                   = useState(1);
  const [activeImg, setActiveImg]       = useState(0);
  const [activeTab, setActiveTab]       = useState("desc");
  const [form, setForm]                 = useState({ nom: "", tel: "", adresse: "", email: "" });
  const [errors, setErrors]             = useState({});
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

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom?.trim()) newErrors.nom = "Le nom est requis.";
    if (!form.tel?.trim()) newErrors.tel = "Le téléphone est requis.";
    if (!form.adresse?.trim()) newErrors.adresse = "L'adresse est requise.";
    if (form.email?.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      newErrors.email = "L'email est invalide.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = async () => {
    if (!validateForm()) {
      toast.warning("Veuillez compléter correctement le formulaire de commande.");
      return;
    }

    setLoading(true);
    const productLabel = PRODUCT.name + (selectedSize?.label ? ` (${selectedSize.label})` : "");
    const unitPrice = selectedSize?.price ?? PRODUCT.price ?? 0;
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
      const orderId = response._id || response.data?._id;
      toast.success(`✅ Commande envoyée ! Réf : ${orderId?.slice(-6) || 'OK'}`);
      setForm({ nom: "", tel: "", adresse: "", email: "" });
      setQty(1);
      setTimeout(() => {
        window.location.href = localStorage.getItem("token") ? "/client-dashboard" : "/products";
      }, 1400);
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
        .ssn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 40px; }
        
        .ssn-img-wrapper { position: relative; border-radius: 25px; overflow: hidden; border: 1px solid #f1e6c9; }
        .ssn-img-main { width: 100%; display: block; background: #fff; padding: 40px; }
        .ssn-thumbs { display: flex; gap: 15px; margin-top: 20px; }
        .ssn-thumb { width: 90px; height: 65px; border-radius: 12px; cursor: pointer; border: 2px solid transparent; transition: 0.3s; object-fit: cover; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 8px 20px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 20px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 48px; color: #0f172a; margin-bottom: 15px; }
        
        .ssn-price-card { margin: 30px 0; padding: 30px; background: #fffbf0; border-radius: 20px; border: 1px solid #f9f1d7; }
        .ssn-price-now { font-size: 40px; font-weight: 700; color: #b8860b; }
        .ssn-price-was { text-decoration: line-through; color: #94a3b8; margin-left: 20px; font-size: 24px; }

        .ssn-label { font-size: 13px; font-weight: 700; color: #1a1a2e; text-transform: uppercase; margin-bottom: 15px; display: block; }
        .ssn-size-list { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 40px; }
        .ssn-size-item { padding: 16px 24px; border: 1px solid #d1d5db; border-radius: 12px; background: #fff; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .ssn-size-item.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; transform: scale(1.05); }

        .ssn-checkout { background: #ffffff; padding: 35px; border-radius: 25px; border: 1px solid #e2e8f0; }
        .ssn-field { width: 100%; padding: 16px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 12px; outline: none; }
        .ssn-field:focus { border-color: ${PRODUCT.tagColor}; }
        .ssn-btn-gold { flex: 1; min-width: 0; padding: 18px 20px; background: #041b4f; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 16px; transition: 0.2s; }
        .ssn-btn-gold:hover { background: #03143a; }
        .ssn-order-summary { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .ssn-summary-row { display: flex; justify-content: space-between; align-items: center; color: #374151; font-size: 14px; }
        .ssn-summary-total { display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 700; color: #0f172a; }
        .ssn-order-actions { display: flex; align-items: center; gap: 12px; }
        .ssn-qty-wrap { display: inline-flex; align-items: center; border: 1px solid #94a3b8; border-radius: 12px; overflow: hidden; }
        .ssn-qty-button { width: 42px; height: 42px; border: none; background: #fff; color: #1f2937; font-size: 18px; cursor: pointer; }
        .ssn-qty-value { width: 42px; text-align: center; font-weight: 700; color: #0f172a; }

        .ssn-desc-tabs { margin-top: 80px; border-top: 1px solid #eee; }
        .ssn-tab-menu { display: flex; gap: 50px; }
        .ssn-tab-item { padding: 25px 0; cursor: pointer; font-weight: 700; color: #94a3b8; position: relative; }
        .ssn-tab-item.active { color: #1a1a2e; }
        .ssn-tab-item.active:after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 900px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 38px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Gallery */}
            <div className="ssn-fade">
              <div className="ssn-img-wrapper">
                <img src={PRODUCT.images[activeImg]} className="ssn-img-main" alt="Matelas Tendresse" />
              </div>
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '25px', padding: '15px', background: '#fff9e6', borderRadius: '15px', color: '#856404', fontSize: '14px', textAlign: 'center', border: '1px solid #ffeeba' }}>
                ⭐ Modèle Signature : Confort Hôtelier 5 Étoiles
              </div>
            </div>

            {/* Config & Buy */}
            <div className="ssn-fade" style={{ transitionDelay: "0.1s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#64748b', fontSize: '20px', fontStyle: 'italic' }}>L'excellence du sommeil ergonomique</p>

              <div className="ssn-price-card">
                <span className="ssn-price-now">{fmt(selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <span className="ssn-price-was">{fmt(selectedSize?.oldPrice ?? selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <p style={{ fontSize: '13px', color: '#27ae60', marginTop: '10px', fontWeight: '600' }}>Économisez {fmt((selectedSize?.oldPrice ?? selectedSize?.price ?? PRODUCT.price ?? 0) - (selectedSize?.price ?? PRODUCT.price ?? 0))} aujourd'hui</p>
              </div>

              <span className="ssn-label">Dimensions disponibles :</span>
              <div className="ssn-size-list">
                {PRODUCT.sizes.map((s) => (
                  <button key={s.label} className={`ssn-size-item ${selectedSize?.label === s.label ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="ssn-checkout">
                <OrderCheckout
                  form={form}
                  setForm={setForm}
                  subtotal={total}
                  delivery={PRODUCT.delivery}
                  total={total + PRODUCT.delivery}
                  fmt={fmt}
                  qty={qty}
                  setQty={setQty}
                  loading={loading}
                  onSubmit={handleOrder}
                />
                {Object.values(errors).filter(Boolean).map((error) => (
                  <div key={error} style={{ color: '#d14343', marginTop: 10 }}>{error}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="ssn-desc-tabs ssn-fade">
            <div className="ssn-tab-menu">
              <div className={`ssn-tab-item ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>L'Expérience Tendresse</div>
              <div className={`ssn-tab-item ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Spécifications de Luxe</div>
            </div>
            
            <div style={{ padding: '50px 0', lineHeight: '2', color: '#475569', fontSize: '17px' }}>
              {activeTab === 'desc' ? (
                <div>
                  <p>Découvrez le <strong>Matelas ergonomique Tendresse</strong> de Super Siesta, une oasis de confort assurant des nuits paisibles et réparatrices. Bien plus qu’un simple matelas, c’est un investissement dans votre santé et votre bien-être.</p>
                  <p style={{ marginTop: '20px' }}>Chaque nuit devient une invitation à un sommeil profond grâce à son alignement parfait de la colonne vertébrale. Son tissu haute couture est traité pour être une barrière totale contre les acariens, les taches et l'humidité.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '20px', border: '1px solid #f1f5f9', borderRadius: '15px', background: '#fdfdfd' }}>
                      <span style={{ color: PRODUCT.tagColor, marginRight: '10px' }}>✦</span> {f}
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

export default Tendresse;