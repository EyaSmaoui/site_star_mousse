import React, { useState, useEffect, useRef } from "react";
import { submitProductOrder } from "../../services/orderService";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import OrderCheckout from "../../components/OrderCheckout";

/* ─────────────────────────────────────────
   DATA — remplacez par vos vraies données
───────────────────────────────────────── */
const PRODUCT = {
  name: "Matelas orthopédique Venise Plus",
  tag: "ORTHOPÉDIQUE",
  tagColor: "#1a1a2e",
  rating: 4.9,
  reviewCount: 127,
  delivery: 3,
  images: [
    "/venise.jpg",
    "/venise2.png",
    "/venise2.png",
  ],
  sizes: [
    { label: "80×190",  price: 300 },
    { label: "90×190",  price: 320 },
    { label: "120×190", price: 350 },
    { label: "140×190", price: 380 },
    { label: "160×190", price: 420 },
    { label: "160×200", price: 440 },
    { label: "180×200", price: 470 },
    { label: "200×200", price: 500 },
  ],
  features: [
    "Hauteur 23 cm",
    "Jusqu'à 90 kg par personne (180 kg par couple)",
    "Ressort bonnell",
    "Matelas réversible été/hiver",
    "Tissus 100% coton anti-acarien",
    "Résistant au feu",
    "Garantie 5 ans",
    "Fabriqué en Tunisie",
  ],
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[0]);
  const [qty, setQty]                   = useState(1);
  const [activeImg, setActiveImg]       = useState(0);
  const [activeTab, setActiveTab]       = useState("desc");
  const [form, setForm]                 = useState({ nom: "", tel: "", adresse: "", email: "" });
  const [loading, setLoading] = useState(false);
  const observerRef                     = useRef(null);

  /* fade-in on scroll */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".ssn-fade").forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const subtotal   = (selectedSize?.price ?? PRODUCT.price ?? 0) * qty;
  const total      = subtotal + PRODUCT.delivery;
  const fmt        = (n) => n.toLocaleString("fr-TN") + " DT";

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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ssn-page {
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          color: #2a2a3d;
        }

        /* ── FADE ── */
        .ssn-fade {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .ssn-fade.visible { opacity: 1; transform: translateY(0); }

        /* ── BREADCRUMB ── */
        .ssn-breadcrumb {
          padding: 28px 40px 0;
          max-width: 1200px;
          margin: 0 auto;
          font-size: 13px;
          color: #9090b0;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .ssn-breadcrumb a {
          color: #9090b0;
          text-decoration: none;
          transition: color 0.18s;
        }
        .ssn-breadcrumb a:hover { color: #4a4ade; }
        .ssn-breadcrumb span { color: #2a2a3d; font-weight: 500; }

        /* ── LAYOUT ── */
        .ssn-product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          padding: 32px 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── GALLERY ── */
        .ssn-img-main {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: contain;
          background: #f3f3fb;
          border: 1px solid #ebebf5;
          border-radius: 18px;
          padding: 24px;
          transition: transform 0.3s;
        }
        .ssn-img-main:hover { transform: scale(1.02); }
        .ssn-thumbs { display: flex; gap: 10px; margin-top: 12px; }
        .ssn-thumb {
          width: 72px;
          height: 62px;
          object-fit: contain;
          background: #f3f3fb;
          border: 1.5px solid #ebebf5;
          border-radius: 10px;
          padding: 6px;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .ssn-thumb.active,
        .ssn-thumb:hover { border-color: #4a4ade; }

        /* ── RIGHT PANEL ── */
        .ssn-right { display: flex; flex-direction: column; gap: 22px; }

        .ssn-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f3f3fb;
          color: #4a4ade;
          border: 1px solid #ddddf0;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 50px;
          letter-spacing: 0.3px;
          width: fit-content;
        }

        .ssn-prod-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1.2;
          letter-spacing: -0.4px;
          margin-top: 10px;
        }

        .ssn-price-block { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
        .ssn-price-main { font-size: 26px; font-weight: 700; color: #1a1a2e; letter-spacing: -0.5px; }
        .ssn-price-from {
          font-size: 12px;
          background: #f3f3fb;
          color: #4a4ade;
          border: 1px solid #ddddf0;
          border-radius: 6px;
          padding: 3px 9px;
          font-weight: 600;
        }

        .ssn-rating-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #9090b0; margin-top: 8px; }
        .ssn-stars { color: #f5a623; font-size: 14px; }

        .ssn-divider { border: none; border-top: 1px solid #ebebf5; }

        /* ── SIZES ── */
        .ssn-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #9090b0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .ssn-sizes { display: flex; flex-wrap: wrap; gap: 8px; }
        .ssn-size {
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          border: 1.5px solid #ebebf5;
          border-radius: 10px;
          background: #fff;
          color: #2a2a3d;
          cursor: pointer;
          transition: all 0.18s;
        }
        .ssn-size:hover { border-color: #4a4ade; color: #4a4ade; }
        .ssn-size.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }

        /* ── FORM CARD ── */
        .ssn-form-card {
          background: #f8f8fd;
          border: 1px solid #ebebf5;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ssn-form-card .ssn-label { margin-bottom: 0; }
        .ssn-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ssn-field { display: flex; flex-direction: column; gap: 5px; }
        .ssn-field label { font-size: 12.5px; font-weight: 500; color: #60607a; }
        .ssn-field input {
          padding: 9px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          border: 1.5px solid #ddddf0;
          border-radius: 10px;
          background: #fff;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .ssn-field input:focus {
          border-color: #4a4ade;
          box-shadow: 0 0 0 3px rgba(74, 74, 222, 0.08);
        }
        .ssn-field input::placeholder { color: #c0c0d8; }

        /* ── TOTALS ── */
        .ssn-totals { display: flex; flex-direction: column; gap: 8px; }
        .ssn-total-row { display: flex; justify-content: space-between; font-size: 14px; color: #9090b0; }
        .ssn-total-row.main {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          border-top: 1px solid #ebebf5;
          padding-top: 10px;
          margin-top: 2px;
        }

        /* ── CTA ── */
        .ssn-cta-row { display: flex; align-items: center; gap: 12px; }
        .ssn-btn-order {
          flex: 1;
          padding: 13px 20px;
          background: #1a1a2e;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.1px;
        }
        .ssn-btn-order:hover {
          background: #4a4ade;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(74, 74, 222, 0.28);
        }
        .ssn-qty {
          display: flex;
          align-items: center;
          border: 1.5px solid #ebebf5;
          border-radius: 11px;
          overflow: hidden;
        }
        .ssn-qty button {
          width: 36px;
          height: 44px;
          background: #f8f8fd;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #2a2a3d;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
        }
        .ssn-qty button:hover { background: #ebebf5; }
        .ssn-qty span {
          width: 36px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
        }

        /* ── TABS ── */
        .ssn-tabs-section {
          background: #f8f8fd;
          border-top: 1px solid #ebebf5;
          padding: 0 40px 60px;
        }
        .ssn-tabs-inner { max-width: 1200px; margin: 0 auto; }
        .ssn-tabs-nav { display: flex; border-bottom: 1px solid #ebebf5; }
        .ssn-tab {
          padding: 18px 26px;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: none;
          border-bottom: 2.5px solid transparent;
          background: none;
          color: #9090b0;
          transition: color 0.2s;
        }
        .ssn-tab.active { border-bottom-color: #4a4ade; color: #4a4ade; }
        .ssn-tab:hover:not(.active) { color: #2a2a3d; }

        .ssn-tab-content {
          padding: 28px 0;
          font-size: 14.5px;
          line-height: 1.8;
          color: #60607a;
        }
        .ssn-tab-content p { margin-bottom: 16px; }
        .ssn-features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 24px;
          list-style: none;
        }
        .ssn-features-grid li { display: flex; align-items: center; gap: 10px; }
        .ssn-check {
          width: 20px;
          height: 20px;
          background: #f3f3fb;
          border: 1px solid #ddddf0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #4a4ade;
          flex-shrink: 0;
          font-weight: 700;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .ssn-product-layout { grid-template-columns: 1fr; padding: 20px 20px 40px; gap: 28px; }
          .ssn-breadcrumb { padding: 20px 20px 0; }
          .ssn-tabs-section { padding: 0 20px 40px; }
          .ssn-features-grid { grid-template-columns: 1fr; }
          .ssn-form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ssn-page">
        <NavBar />

        {/* ── BREADCRUMB ── */}
        <nav className="ssn-breadcrumb ssn-fade">
          <a href="/">Accueil</a>
          <span>›</span>
          <a href="/products">Produits</a>
          <span>›</span>
          <span>{PRODUCT.name}</span>
        </nav>

        {/* ── LAYOUT ── */}
        <div className="ssn-product-layout">

          {/* GALERIE */}
          <div className="ssn-fade">
            <img
              className="ssn-img-main"
              src={PRODUCT.images[activeImg]}
              alt={PRODUCT.name}
            />
            <div className="ssn-thumbs">
              {PRODUCT.images.map((src, i) => (
                <img
                  key={i}
                  className={`ssn-thumb${activeImg === i ? " active" : ""}`}
                  src={src}
                  alt={`vue ${i + 1}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          </div>

          {/* DROITE */}
          <div className="ssn-right ssn-fade" style={{ transitionDelay: "0.12s" }}>

            {/* Tag + titre + prix */}
            <div>
              <div className="ssn-tag-pill">🛏️ {PRODUCT.tag}</div>
              <h1 className="ssn-prod-name">{PRODUCT.name}</h1>
              <div className="ssn-price-block">
                <span className="ssn-price-main">{fmt(selectedSize?.price ?? PRODUCT.price ?? 0)}</span>
                <span className="ssn-price-from">À partir de {PRODUCT.sizes[0].label}</span>
              </div>
              <div className="ssn-rating-row">
                <span className="ssn-stars">{"★".repeat(5)}</span>
                <span>{PRODUCT.rating} / 5</span>
                <span>·</span>
                <span>{PRODUCT.reviewCount} avis</span>
              </div>
            </div>

            <hr className="ssn-divider" />

            {/* Tailles */}
            <div>
              <div className="ssn-label">Taille — <strong style={{ color: "#1a1a2e" }}>{selectedSize?.label}</strong></div>
              <div className="ssn-sizes">
                {PRODUCT.sizes.map((s) => (
                  <button
                    key={s.label}
                    className={`ssn-size${selectedSize?.label === s.label ? " active" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="ssn-divider" />

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

        {/* ── TABS ── */}
        <section className="ssn-tabs-section">
          <div className="ssn-tabs-inner">
            <div className="ssn-tabs-nav">
              <button
                className={`ssn-tab${activeTab === "desc" ? " active" : ""}`}
                onClick={() => setActiveTab("desc")}
              >
                Description
              </button>
              <button
                className={`ssn-tab${activeTab === "avis" ? " active" : ""}`}
                onClick={() => setActiveTab("avis")}
              >
                Avis ({PRODUCT.reviewCount})
              </button>
            </div>

            {activeTab === "desc" && (
              <div className="ssn-tab-content ssn-fade visible">
                <p>
                  Découvrez le <strong>{PRODUCT.name}</strong>, une avancée exceptionnelle
                  pour un sommeil et un bien-être inégalés, fabriqué avec passion en Tunisie.
                </p>
                <ul className="ssn-features-grid">
                  {PRODUCT.features.map((f, i) => (
                    <li key={i}>
                      <div className="ssn-check">✓</div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "avis" && (
              <div className="ssn-tab-content ssn-fade visible">
                <p style={{ color: "#9090b0" }}>
                  Aucun avis pour le moment. Soyez le premier à laisser un avis !
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
