import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import OrderCheckout from "./OrderCheckout";
import { getProductBySlug } from "../data/products";

function formatPrice(amount) {
  return typeof amount === "number"
    ? amount.toLocaleString("fr-TN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DT"
    : "0,00 DT";
}

function ProductTemplate({ product: fallbackProduct }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = fallbackProduct || getProductBySlug(slug);

  const [selectedSize, setSelectedSize] = useState(() => {
    if (!product) return undefined;
    if (product.sizes?.length) {
      return product.sizes[product.defaultSizeIndex ?? 0];
    }
    return undefined;
  });
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("desc");

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [form, setForm] = useState({
    name: user?.username || user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    email: user?.email || ""
  });
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(updatedUser);
      if (updatedUser) {
        setForm({
          name: updatedUser.username || updatedUser.name || "",
          phone: updatedUser.phone || "",
          address: updatedUser.address || "",
          email: updatedUser.email || ""
        });
      }
    };

    const handleUserLoggedIn = (e) => {
      const user = e.detail;
      setUser(user);
      if (user) {
        setForm({
          name: user.username || user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          email: user.email || ""
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-logged-in', handleUserLoggedIn);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-logged-in', handleUserLoggedIn);
    };
  }, []);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes?.[product.defaultSizeIndex ?? 0]);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".ssn-fade").forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [product]);

  if (!product) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <h1>Produit introuvable</h1>
        <p>La fiche demandée n'existe pas ou a été déplacée.</p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          style={{ marginTop: "20px", padding: "12px 24px", borderRadius: "12px", background: "#b52f2f", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Retour aux produits
        </button>
      </div>
    );
  }

  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const unitPrice = hasSizes ? selectedSize?.price : product.price;
  const subtotal = (unitPrice ?? 0) * qty;
  const total = subtotal + (product.delivery || 0);

  const handleOrder = async (event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.warning("Veuillez remplir les champs obligatoires : nom, téléphone et adresse.");
      return;
    }

    if (!form.email.trim()) {
      toast.warning("Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);
    const productLabel = product.name + (hasSizes && selectedSize?.label ? ` (${selectedSize.label})` : "");
    const orderData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      products: [{ name: productLabel, quantity: qty, price: unitPrice ?? 0 }],
      total,
    };

    try {
      const { submitProductOrder } = await import("../services/orderService");
      await submitProductOrder(orderData);
      toast.success("Commande envoyée avec succès !");
      setForm({ name: "", phone: "", address: "", email: "" });
      setQty(1);
      setTimeout(() => navigate("/client-dashboard"), 1400);
    } catch (error) {
      console.error("Erreur commande :", error);
      const message = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Erreur lors de l'envoi de la commande.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const hasOldPrice = hasSizes ? selectedSize?.oldPrice : product.oldPrice;
  const accent = product.tagColor || "#b52f2f";

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        .ssn-page { background: #fbfaf8; color: #242436; font-family: 'DM Sans', sans-serif; }
        .ssn-container { max-width: 1200px; margin: 0 auto; padding: 28px 20px 60px; }
        .ssn-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 38px; align-items: start; }
        .ssn-gallery { position: sticky; top: 110px; }
        .ssn-main-image { width: 100%; border-radius: 24px; overflow: hidden; background: #fff; border: 1px solid #eee; box-shadow: 0 18px 50px rgba(0,0,0,0.06); }
        .ssn-main-image img { width: 100%; display: block; height: auto; }
        .ssn-thumbs { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
        .ssn-thumb { width: 88px; height: 72px; border-radius: 18px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: border-color 0.25s; }
        .ssn-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .ssn-thumb.active { border-color: ${accent}; }
        .ssn-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; background: ${accent}; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.2px; margin-bottom: 14px; }
        .ssn-title { font-family: 'Playfair Display', serif; font-size: clamp(2.8rem, 3.8vw, 4.5rem); line-height: 1.02; margin-bottom: 14px; color: #1b1b33; }
        .ssn-subtitle { font-size: 1rem; line-height: 1.8; color: #4f5668; max-width: 680px; margin-bottom: 24px; }
        .ssn-price-block { display: flex; align-items: center; gap: 18px; margin-bottom: 26px; flex-wrap: wrap; }
        .ssn-price-current { font-size: clamp(2.4rem, 3vw, 3.4rem); font-weight: 800; color: #1f2937; }
        .ssn-price-old { font-size: 1.1rem; color: #94a3b8; text-decoration: line-through; }
        .ssn-info-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-bottom: 30px; }
        .ssn-info-card { background: #fff; border: 1px solid #e8e8ec; border-radius: 18px; padding: 18px 20px; color: #475569; }
        .ssn-info-card strong { display: block; font-size: 0.95rem; margin-bottom: 8px; color: #1f2937; }
        .ssn-size-list { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 30px; }
        .ssn-size-button { min-width: 98px; padding: 14px 16px; border-radius: 14px; border: 1px solid #d1d5db; background: #fff; color: #334155; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .ssn-size-button.active { background: ${accent}; color: #fff; border-color: ${accent}; }
        .ssn-order-panel { background: #fff; border-radius: 28px; box-shadow: 0 26px 65px rgba(21,21,34,0.08); border: 1px solid #f0eded; padding: 28px; }
        .ssn-tab-nav { display: flex; gap: 18px; border-bottom: 1px solid #e2e8f0; margin-top: 42px; }
        .ssn-tab-button { padding: 14px 0; cursor: pointer; font-weight: 700; color: #64748b; border: none; background: none; position: relative; }
        .ssn-tab-button.active { color: #1f2937; }
        .ssn-tab-button.active::after { content: ""; position: absolute; bottom: -1px; left: 0; width: 100%; height: 4px; background: ${accent}; border-radius: 999px; }
        .ssn-tab-content { padding: 26px 0 4px; color: #475569; line-height: 1.8; font-size: 1rem; }
        .ssn-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 18px; }
        .ssn-feature-card { background: #fff; border: 1px solid #e6e8ef; border-radius: 18px; padding: 18px; color: #334155; display: flex; align-items: flex-start; gap: 12px; }
        .ssn-feature-icon { color: ${accent}; font-size: 1.2rem; line-height: 1; }
        .ssn-feature-text { font-size: 0.96rem; }
        @media (max-width: 1024px) {
          .ssn-grid { grid-template-columns: 1fr; }
          .ssn-gallery { position: static; top: auto; }
        }
        @media (max-width: 640px) {
          .ssn-container { padding: 20px 16px 40px; }
          .ssn-price-current { font-size: 2.4rem; }
          .ssn-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ssn-page">
        <NavBar />
        <div className="ssn-container">
          <div className="ssn-grid">
            <div className="ssn-gallery ssn-fade">
              <div className="ssn-main-image">
                <img src={product.images[activeImg]} alt={product.name} />
              </div>
              <div className="ssn-thumbs">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`ssn-thumb ${activeImg === index ? "active" : ""}`}
                    onClick={() => setActiveImg(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="ssn-fade" style={{ transitionDelay: "0.08s" }}>
              <span className="ssn-badge">{product.tag}</span>
              <h1 className="ssn-title">{product.name}</h1>
              <div className="ssn-subtitle">{product.description}</div>

              <div className="ssn-price-block">
                <div className="ssn-price-current">{formatPrice(unitPrice)}</div>
                {hasOldPrice && <div className="ssn-price-old">{formatPrice(hasOldPrice)}</div>}
              </div>

              <div className="ssn-info-grid">
                <div className="ssn-info-card">
                  <strong>Catégorie</strong>
                  {product.category || "Matelas et oreiller"}
                </div>
                <div className="ssn-info-card">
                  <strong>Livraison</strong>
                  {product.delivery ? `${product.delivery} DT` : "Gratuite"}
                </div>
                {product.sizes?.length ? (
                  <div className="ssn-info-card">
                    <strong>Tailles disponibles</strong>
                    {product.sizes.length} options
                  </div>
                ) : null}
                <div className="ssn-info-card">
                  <strong>Garantie</strong>
                  {product.guarantee || "3 à 10 ans"}
                </div>
              </div>

              {hasSizes && (
                <div className="ssn-size-list">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      type="button"
                      className={`ssn-size-button ${selectedSize?.label === size.label ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="ssn-order-panel">
                <OrderCheckout
                  form={form}
                  setForm={setForm}
                  subtotal={subtotal}
                  delivery={product.delivery || 0}
                  total={total}
                  fmt={formatPrice}
                  qty={qty}
                  setQty={setQty}
                  loading={loading}
                  onSubmit={handleOrder}
                  buttonLabel={loading ? "Envoi..." : "Commander maintenant"}
                />
              </div>
            </div>
          </div>

          <div className="ssn-tabs ssn-fade" style={{ transitionDelay: "0.12s" }}>
            <div className="ssn-tab-nav">
              <button className={`ssn-tab-button ${activeTab === "desc" ? "active" : ""}`} type="button" onClick={() => setActiveTab("desc")}>Description</button>
              <button className={`ssn-tab-button ${activeTab === "details" ? "active" : ""}`} type="button" onClick={() => setActiveTab("details")}>Détails</button>
            </div>
            <div className="ssn-tab-content">
              {activeTab === "desc" ? (
                <div>
                  <p>{product.description}</p>
                  <div className="ssn-feature-grid">
                    {product.features?.map((feature, index) => (
                      <div key={index} className="ssn-feature-card">
                        <span className="ssn-feature-icon">✓</span>
                        <div className="ssn-feature-text">{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p>{product.details}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ProductTemplate;
