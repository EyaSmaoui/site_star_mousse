import React, { useState, useEffect, useRef } from "react";
import { submitOrder } from "../../services/orderService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import OrderCheckout from "../../components/OrderCheckout";

/* ─────────────────────────────────────────
    DATA — Matelas Orthopédique Soft Plus
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas orthopédique Soft Plus",
  tag: "ORTHOPÉDIQUE",
  delivery: 0, // LIVRAISON GRATUITE
  images: [
    "/venise.jpg", 
    "/venise2.png",
    "/venise.jpg",
    "/venise2.png",
  ],
  sizes: [
    { label: "90×190",  price: 260 },
    { label: "120×190", price: 360 },
    { label: "140×190", price: 440 },
    { label: "160×190", price: 520 },
    { label: "160×200", price: 550 },
    { label: "180×200", price: 620 },
  ],
  features: [
    "Hauteur 22 cm",
    "Jusqu’à 80kg par personne",
    "Matelas en box diamètre 2.1mm",
    "Matelas réversible (été/hiver)",
    "Tissus 80% coton anti-acarien",
    "Garantie 3 ans",
  ],
};

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[0]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '' });
  
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".ssn-fade").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const total = (selectedSize?.price ?? PRODUCT.price ?? 0) * qty;
  const fmt = (n) => n.toLocaleString("fr-TN") + ".00 DT";

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.warning("Veuillez remplir les champs obligatoires.");
      return;
    }

    setLoading(true);
    const orderData = {
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      products: [{ 
        name: PRODUCT.name + (typeof selectedSize !== "undefined" && selectedSize?.label ? ` (${selectedSize.label})` : ""), 
        quantity: qty, 
        price: (typeof selectedSize !== "undefined" ? selectedSize?.price : PRODUCT.price) ?? PRODUCT.price ?? 0 
      }],
      total: total
    };

    try {
      await submitOrder(orderData);
      toast.success("Commande confirmée ! Redirection...");
      setTimeout(() => window.location.href = localStorage.getItem("token") ? "/client-dashboard" : "/products", 2000);
    } catch (err) {
      console.error("Erreur commande :", err);
      const message =
        err.message ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de l'envoi de la commande. Réessayez plus tard.";
      toast.error(message);
      if (err.response?.status === 401 || message.toLowerCase().includes('token')) {
        window.location.href = '/login/client';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <style>{`
        .ssn-page { background: #fff; font-family: sans-serif; color: #1a1a2e; }
        .ssn-container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        
        /* GALERIE */
        .ssn-gallery { display: flex; flex-direction: column; gap: 15px; }
        .ssn-main-frame { border: 1px solid #ddd; padding: 20px; border-radius: 4px; }
        .ssn-main-frame img { width: 100%; height: auto; display: block; }
        .ssn-thumbs { display: flex; gap: 10px; }
        .ssn-thumb { width: 70px; height: 70px; border: 1px solid #ddd; cursor: pointer; padding: 5px; }
        .ssn-thumb.active { border-color: #1a1a2e; }

        /* INFOS DROITE */
        .ssn-right h1 { font-size: 20px; margin-bottom: 10px; }
        .ssn-price-top { font-size: 18px; font-weight: bold; margin-bottom: 25px; }
        
        .ssn-section-box { border: 1px solid #f0f0f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .ssn-label-small { font-size: 13px; font-weight: bold; color: #555; margin-bottom: 15px; display: block; }
        
        /* RADIOS TAILLES */
        .ssn-sizes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
        .ssn-size-item { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; font-weight: bold; }
        .ssn-size-item input { accent-color: #1a1a2e; width: 18px; height: 18px; }

        /* FORMULAIRE */
        .ssn-field { margin-bottom: 15px; }
        .ssn-field label { display: block; font-size: 13px; font-weight: bold; margin-bottom: 8px; }
        .ssn-input { width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 8px; outline: none; }

        /* RÉCAPITULATIF */
        .ssn-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
        .ssn-row.total { font-size: 18px; font-weight: bold; border-top: 1px solid #eee; margin-top: 10px; padding-top: 15px; }

        /* ACTIONS */
        .ssn-actions { display: flex; gap: 10px; margin-top: 20px; }
        .ssn-btn-main { flex: 1; background: #1a1a2e; color: #fff; border: none; padding: 15px; border-radius: 6px; font-weight: bold; cursor: pointer; }
        .ssn-qty-ctrl { display: flex; border: 1px solid #1a1a2e; border-radius: 6px; align-items: center; }
        .ssn-qty-ctrl button { background: none; border: none; width: 35px; height: 100%; cursor: pointer; font-size: 18px; }
        .ssn-qty-ctrl span { width: 40px; text-align: center; font-weight: bold; border-left: 1px solid #eee; border-right: 1px solid #eee; }

        /* TABS */
        .ssn-tabs-container { max-width: 1100px; margin: 20px auto; border: 1px solid #ddd; border-radius: 4px; }
        .ssn-tabs-nav { display: flex; border-bottom: 1px solid #ddd; background: #fff; }
        .ssn-tab-btn { padding: 15px 30px; border: none; background: none; cursor: pointer; font-weight: bold; color: #ccc; }
        .ssn-tab-btn.active { color: #1a1a2e; border-bottom: 2px solid #1a1a2e; }
        .ssn-tab-content { padding: 30px; line-height: 1.6; font-size: 14px; color: #333; }

        @media (max-width: 850px) { .ssn-container { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          
          {/* GAUCHE : GALERIE */}
          <div className="ssn-gallery">
            <div className="ssn-main-frame">
              <img src={PRODUCT.images[activeImg]} alt={PRODUCT.name} />
            </div>
            <div className="ssn-thumbs">
              {PRODUCT.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  className={`ssn-thumb ${activeImg === i ? 'active' : ''}`} 
                  onClick={() => setActiveImg(i)} 
                  alt="thumb"
                />
              ))}
            </div>
          </div>

          {/* DROITE : CONFIGURATION */}
          <div className="ssn-right">
            <h1>{PRODUCT.name}</h1>
            <div className="ssn-price-top">{fmt(selectedSize?.price ?? PRODUCT.price ?? 0)}</div>

            <div className="ssn-section-box">
              <span className="ssn-label-small">Size</span>
              <div className="ssn-sizes-grid">
                {PRODUCT.sizes.map((s) => (
                  <label key={s.label} className="ssn-size-item">
                    <input 
                      type="radio" 
                      name="size" 
                      checked={selectedSize?.label === s.label}
                      onChange={() => setSelectedSize(s)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="ssn-section-box">
              <OrderCheckout
                form={formData}
                setForm={setFormData}
                fields={{ name: "name", phone: "phone", address: "address", email: "email" }}
                subtotal={total}
                delivery={PRODUCT.delivery}
                total={total + PRODUCT.delivery}
                fmt={fmt}
                qty={qty}
                setQty={setQty}
                loading={loading}
                onSubmit={handleOrder}
              />
            </div>
          </div>
        </div>

        {/* ONGLETS BAS */}
        <div className="ssn-tabs-container">
          <div className="ssn-tabs-nav">
            <button className={`ssn-tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>DESCRIPTION</button>
            <button className={`ssn-tab-btn ${activeTab === 'avis' ? 'active' : ''}`} onClick={() => setActiveTab('avis')}>AVIS</button>
          </div>
          <div className="ssn-tab-content">
            {activeTab === 'desc' ? (
              <div>
                <p style={{marginBottom: '15px'}}>Découvrez le <strong>{PRODUCT.name}</strong> de Super Siesta, votre allié idéal pour des nuits de sommeil réparateur.</p>
                {PRODUCT.features.map((f, i) => (
                  <div key={i} style={{marginBottom: '8px'}}>✓ {f}</div>
                ))}
              </div>
            ) : (
              <p style={{color: '#999'}}>Aucun avis pour le moment.</p>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
