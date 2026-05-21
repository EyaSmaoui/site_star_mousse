import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../../services/orderService";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import OrderCheckout from "../../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — Oreiller Médical Aroma Therapy Océan Puff
   Prix : 175,00 DT
───────────────────────────────────────── */
const PRODUCT = {
  name: "Oreiller Médical Aroma Therapy Océan Puff",
  category: "Oreiller",
  tag: "AROMATHÉRAPIE & ÉVASION MARINE",
  tagColor: "#0ea5e9", // Bleu Océan
  images: [
    "/oreiller_puff.png", 
    "/oreiller_puff.png",
  ],
  price: 175,
  dimensions: "60 x 40 x 14 cm",
  features: [
    "Mousse visco-élastique de haute densité sans gaz CFC",
    "Extraits naturels d'Aromathérapie senteur Océan",
    "Système de canaux d'air (Grands au centre, petits sur les bords)",
    "Soutien cervical supérieur et alignement de la colonne",
    "Tissu tricoté en micro spandex blanc (douceur extrême)",
    "Idéal pour soulager les ronflements et douleurs dorsales",
    "Convient parfaitement aux femmes enceintes",
    "Parfum cadeau intégré pour une évasion immédiate",
  ],
};

const OreillerAromaOcean = () => {
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
        .ssn-main-img { width: 100%; border-radius: 20px; background: #f0f9ff; padding: 30px; border: 1px solid #e0f2fe; box-shadow: 0 10px 40px rgba(14, 165, 233, 0.08); }
        .ssn-thumbs { display: flex; gap: 12px; margin-top: 15px; }
        .ssn-thumb { width: 85px; height: 60px; border-radius: 10px; cursor: pointer; border: 2px solid transparent; transition: 0.3s; }
        .ssn-thumb.active { border-color: ${PRODUCT.tagColor}; transform: scale(1.05); }

        .ssn-badge { display: inline-block; padding: 8px 18px; background: ${PRODUCT.tagColor}; color: #fff; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 15px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: 32px; color: #0c4a6e; line-height: 1.2; margin-bottom: 15px; }
        
        .ssn-price-box { margin: 25px 0; padding: 25px; background: #f0f9ff; border-radius: 20px; border: 1px solid #bae6fd; text-align: center; }
        .ssn-price-val { font-size: 40px; font-weight: 700; color: #0369a1; }

        .ssn-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
        .ssn-spec-item { padding: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 13px; color: #64748b; }
        
        .ssn-order-card { background: #fff; padding: 30px; border-radius: 25px; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
        .ssn-input { width: 100%; padding: 15px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; }
        .ssn-cta { width: 100%; padding: 18px; background: #0c4a6e; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 17px; transition: 0.3s; }
        .ssn-cta:hover { background: #082f49; }

        .ssn-tabs { margin-top: 60px; }
        .ssn-tab-nav { display: flex; gap: 40px; border-bottom: 2px solid #f1f5f9; }
        .ssn-tab-btn { padding: 20px 0; cursor: pointer; font-weight: 700; color: #94a3b8; position: relative; }
        .ssn-tab-btn.active { color: #0c4a6e; }
        .ssn-tab-btn.active:after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 4px; background: ${PRODUCT.tagColor}; }

        @media (max-width: 850px) { .ssn-grid { grid-template-columns: 1fr; } .ssn-title { font-size: 26px; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            
            {/* Visuals */}
            <div className="ssn-gallery ssn-fade">
              <img src={PRODUCT.images[activeImg]} className="ssn-main-img" alt="Oreiller Aroma Océan" />
              <div className="ssn-thumbs">
                {PRODUCT.images.map((img, i) => (
                  <img key={i} src={img} className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
              <div style={{ marginTop: '25px', padding: '18px', background: '#0ea5e9', borderRadius: '15px', color: '#fff', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
                🌊 Une vague de fraîcheur et de bien-être pour vos nuits
              </div>
            </div>

            {/* Content */}
            <div className="ssn-fade" style={{ transitionDelay: "0.1s" }}>
              <span className="ssn-badge">{PRODUCT.tag}</span>
              <h1 className="ssn-title">{PRODUCT.name}</h1>
              <p style={{ color: '#475569', fontSize: '17px', lineHeight: '1.6' }}>Soutien ergonomique et aromathérapie marine pour un endormissement rapide et apaisé.</p>

              <div className="ssn-price-box">
                <span className="ssn-price-val">{fmt(PRODUCT.price)}</span>
                <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#0369a1', fontWeight: '600' }}>Livraison gratuite sur toute la Tunisie 🚛</p>
              </div>

              <div className="ssn-specs">
                <div className="ssn-spec-item">📏 <b>Dimensions :</b> {PRODUCT.dimensions}</div>
                <div className="ssn-spec-item">🧼 <b>Tissu :</b> Micro Spandex Blanc</div>
                <div className="ssn-spec-item">🧘 <b>Soutien :</b> Cervical Optimal</div>
                <div className="ssn-spec-item">🌀 <b>Matière :</b> Visco-élastique</div>
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
              <div className={`ssn-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Le concept Océan Puff</div>
              <div className={`ssn-tab-btn ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>Fiche Technique</div>
            </div>
            
            <div style={{ padding: '40px 0', lineHeight: '1.9', color: '#475569', fontSize: '16px' }}>
              {activeTab === 'desc' ? (
                <div>
                  <p>L’<strong>Oreiller Médical Aroma Therapy Océan Puff</strong> est bien plus qu'un simple accessoire de literie : c'est une véritable innovation pour votre santé. Fabriqué avec des huiles d’aromathérapie à base d’extraits naturels marins, il diffuse une senteur apaisante qui aide à <strong>réduire les maux de tête</strong> et à accélérer l'endormissement.</p>
                  <p style={{ marginTop: '15px' }}>Sa conception unique repose sur des <strong>canaux d'air innovants</strong> : les larges canaux centraux accueillent la tête tandis que les petits canaux périphériques assurent un maintien ferme du cou. Cette ergonomie enveloppe la colonne vertébrale pour une respiration libre et saine toute la nuit.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #f1f5f9' }}>
                      <span style={{ color: PRODUCT.tagColor }}>💎</span> {f}
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

export default OreillerAromaOcean;