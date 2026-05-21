import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../../services/orderService";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import OrderCheckout from "../../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Matelas Bébé Confort Plus
   Prix : 180,00 DT (Promotion)
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas Bébé Confort Plus",
  category: "Matelas bébé",
  tag: "DOUCEUR & SÉCURITÉ - LIVRAISON GRATUITE",
  tagColor: "#3bc9db", // Turquoise doux pour l'univers bébé
  images: [
    "/bebe_confort.jpg", 
    "/bebe_confort.jpg",
  ],
  price: 180,
  oldPrice: 215,
  features: [
    "Hauteur optimale : 22 cm", // Selon la liste à puces
    "Suspension Box (diamètre 2mm) pour une stabilité parfaite",
    "Matelas réversible (Face Été / Face Hiver)",
    "Tissu 80% coton naturel et respirant",
    "Traitement anti-acarien pour un sommeil sain",
    "Ressorts de haute qualité pour une durabilité exceptionnelle",
    "Favorise la circulation sanguine et diminue les points de pression",
    "Garantie Sérénité : 3 ans",
  ],
};

const BebeConfortPlus = () => {
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
        .ssn-main-img { width: 100%; border-radius: 20px; background: #fff; padding: 20px; border: 1px solid #e3fafc; }
        .ssn-thumbs { display: flex; gap: 10px; margin-top: 15px; }
        .ssn-thumb { width: 80px; height: 60px; border-radius: 8px; cursor: pointer; border: 2px solid transparent; object-fit: cover; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; }

        .ssn-badge { display: inline-block; padding: 6px 15px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 4px; font-size: 11px; font-weight: 700; margin-bottom: 15px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 38px; color: #0f172a; margin-bottom: 10px; }
        
        .ssn-price-box { margin: 20px 0; padding: 20px; background: #f1f3f5; border-radius: 15px; }
        .ssn-price-now { font-size: 34px; font-weight: 700; color: #0c8599; }
        .ssn-price-was { text-decoration: line-through; color: #adb5bd; margin-left: 15px; font-size: 20px; }

        .ssn-order-card { background: #fff; padding: 30px; border-radius: 20px; border: 1px solid #dee2e6; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .ssn-input { width: 100%; padding: 14px; margin-bottom: 10px; border: 1px solid #ced4da; border-radius: 10px; outline: none; }
        .ssn-btn { width: 100%; padding: 18px; background: #1a1a2e; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .ssn-btn:hover { background: #000; }

        .ssn-tabs { margin-top: 50px; }
        .ssn-tab-nav { display: flex; gap: 30px; border-bottom: 1px solid #e9ecef; }
        .ssn-tab-link { padding: 15px 0; cursor: pointer; font-weight: 700; color: #868e96; position: relative; }
        .ssn-tab-link.active { color: #1a1a2e; }
        .ssn-tab-link.active:after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 850px) { .ssn-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-main-img" alt="Matelas Bébé" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '20px', padding: '15px', background: '#e3fafc', borderRadius: '12px', color: '#0b7285', fontSize: '14px', textAlign: 'center' }}>
                🍼 Sommeil paisible pour votre tout-petit
              </div>
            </div>

            <div className="ssn-fade" style={{ transitionDelay: "0.1s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#495057', fontSize: '16px' }}>L'investissement idéal pour le bien-être et la croissance de votre enfant.</p>

              <div className="ssn-price-box">
                <span className="ssn-price-now">{fmt(PRODUCT.price)}</span>
                <span className="ssn-price-was">{fmt(PRODUCT.oldPrice)}</span>
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
              <div className={`ssn-tab-link ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Description</div>
              <div className={`ssn-tab-link ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Fiche Technique</div>
            </div>
            
            <div style={{ padding: '30px 0', lineHeight: '1.7', color: '#495057' }}>
              {activeTab === 'desc' ? (
                <div>
                  <p>Offrez à votre bébé un sommeil réparateur avec le <strong>Matelas bébé Confort Plus</strong>. Ce matelas est doté de ressorts de haute qualité assurant une résistance exceptionnelle et un soutien optimal pour diminuer les points de pression.</p>
                  <p style={{ marginTop: '10px' }}>Grâce à son <strong>tissu composé à 80% de coton</strong>, il offre une régulation naturelle de la température et une excellente évacuation de l'humidité, garantissant un environnement sain pour votre nouveau-né.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px', fontSize: '14px' }}>
                      <span style={{ color: PRODUCT.tagColor, marginRight: '8px' }}>✓</span> {f}
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

export default BebeConfortPlus;