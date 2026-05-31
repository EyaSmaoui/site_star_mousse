import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import {
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../../utils/cartUtils";
import { submitOrder } from "../../services/orderService";

const emptyForm = { name: "", phone: "", address: "", email: "" };

const formatMoney = (value) => `${Number(value || 0).toLocaleString("fr-TN")}.00 DT`;

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    setItems(getCartItems());
    setForm({
      name: user.username || user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      email: user.email || "",
    });
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0),
    [items]
  );

  const setQuantity = (key, quantity) => {
    setItems(updateCartItemQuantity(key, quantity));
  };

  const removeItem = (key) => {
    setItems(removeCartItem(key));
    toast.info("Produit retire du panier");
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitCart = async (event) => {
    event.preventDefault();
    if (!items.length) {
      toast.warning("Votre panier est vide.");
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.warning("Nom, telephone et adresse sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      await submitOrder({
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        email: form.email.trim(),
        products: items.map((item) => ({
          name: `${item.name}${item.size ? ` (${item.size})` : ""}`,
          quantity: item.quantity,
          price: item.price,
        })),
        total: subtotal,
      });
      clearCart();
      setItems([]);
      toast.success("Commande envoyee avec succes");
      setTimeout(() => navigate(localStorage.getItem("token") ? "/client-orders" : "/products"), 900);
    } catch (error) {
      toast.error(error.message || "Impossible d'envoyer la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm-cart-page">
      <NavBar />
      <style>{`
        .sm-cart-page { min-height: 100vh; background: #fbfaf8; color: #151522; font-family: 'DM Sans', system-ui, sans-serif; }
        .sm-cart-shell { max-width: 1180px; margin: 0 auto; padding: 42px 20px 64px; display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 26px; align-items: start; }
        .sm-cart-head { grid-column: 1 / -1; display: flex; align-items: end; justify-content: space-between; gap: 18px; }
        .sm-cart-head h1 { margin: 0; font-size: 34px; letter-spacing: 0; }
        .sm-cart-head p { margin: 8px 0 0; color: #6f7180; }
        .sm-cart-card, .sm-cart-summary { background: #fff; border: 1px solid #ebe6df; border-radius: 8px; box-shadow: 0 18px 46px rgba(21,21,34,.07); }
        .sm-cart-list { display: flex; flex-direction: column; }
        .sm-cart-item { display: grid; grid-template-columns: 86px minmax(0, 1fr) auto; gap: 16px; padding: 18px; border-bottom: 1px solid #f1ece5; align-items: center; }
        .sm-cart-item:last-child { border-bottom: 0; }
        .sm-cart-img { width: 86px; height: 86px; border-radius: 8px; background: #f8f3ed; object-fit: cover; }
        .sm-cart-name { margin: 0 0 5px; font-size: 15px; font-weight: 900; }
        .sm-cart-meta { color: #77798a; font-size: 13px; }
        .sm-cart-price { margin-top: 9px; font-weight: 900; }
        .sm-cart-actions { display: flex; align-items: center; gap: 10px; }
        .sm-stepper { display: inline-flex; align-items: center; border: 1px solid #e2d9ce; border-radius: 999px; overflow: hidden; height: 36px; }
        .sm-stepper button { width: 34px; height: 34px; border: 0; background: #fff; cursor: pointer; font-weight: 900; color: #b52f2f; }
        .sm-stepper span { min-width: 32px; text-align: center; font-weight: 900; }
        .sm-remove { border: 1px solid #fecaca; background: #fef2f2; color: #dc2626; border-radius: 8px; height: 36px; padding: 0 10px; cursor: pointer; font-weight: 800; }
        .sm-cart-summary { padding: 20px; position: sticky; top: 100px; }
        .sm-cart-summary h2 { margin: 0 0 16px; font-size: 18px; }
        .sm-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .sm-field label { font-size: 12px; color: #6f7180; font-weight: 800; }
        .sm-field input { border: 1px solid #e5ded5; border-radius: 8px; padding: 11px 12px; font: inherit; outline: 0; }
        .sm-total-row { display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid #f1ece5; font-weight: 900; }
        .sm-submit { width: 100%; border: 0; border-radius: 8px; padding: 13px 16px; background: #b52f2f; color: #fff; font-weight: 900; cursor: pointer; }
        .sm-submit:disabled { opacity: .55; cursor: not-allowed; }
        .sm-empty { padding: 36px; text-align: center; }
        .sm-empty a, .sm-cart-head a { color: #b52f2f; font-weight: 900; text-decoration: none; }
        @media (max-width: 900px) { .sm-cart-shell { grid-template-columns: 1fr; } .sm-cart-summary { position: static; } .sm-cart-item { grid-template-columns: 70px 1fr; } .sm-cart-actions { grid-column: 1 / -1; justify-content: flex-end; } }
      `}</style>

      <main className="sm-cart-shell">
        <div className="sm-cart-head">
          <div>
            <h1>Panier</h1>
            <p>{items.length ? `${items.length} produit(s) pret(s) a commander` : "Votre panier est vide pour le moment."}</p>
          </div>
          <Link to="/products">Continuer mes achats</Link>
        </div>

        <section className="sm-cart-card">
          {!items.length ? (
            <div className="sm-empty">
              <h2>Aucun produit dans le panier</h2>
              <p>Ajoutez un produit depuis une fiche produit, puis revenez ici pour commander.</p>
              <Link to="/products">Voir les produits</Link>
            </div>
          ) : (
            <div className="sm-cart-list">
              {items.map((item) => (
                <article className="sm-cart-item" key={item.key}>
                  <img className="sm-cart-img" src={item.image || "/logo-star-mousse.png"} alt={item.name} />
                  <div>
                    <h2 className="sm-cart-name">{item.name}</h2>
                    <div className="sm-cart-meta">{item.size || "Dimension standard"}</div>
                    <div className="sm-cart-price">{formatMoney(item.price)}</div>
                  </div>
                  <div className="sm-cart-actions">
                    <div className="sm-stepper" aria-label="Quantite">
                      <button type="button" onClick={() => setQuantity(item.key, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => setQuantity(item.key, item.quantity + 1)}>+</button>
                    </div>
                    <button className="sm-remove" type="button" onClick={() => removeItem(item.key)}>Retirer</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <form className="sm-cart-summary" onSubmit={submitCart}>
          <h2>Finaliser la commande</h2>
          <div className="sm-field">
            <label>Nom</label>
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </div>
          <div className="sm-field">
            <label>Telephone</label>
            <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </div>
          <div className="sm-field">
            <label>Adresse</label>
            <input value={form.address} onChange={(event) => updateField("address", event.target.value)} />
          </div>
          <div className="sm-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
          </div>
          <div className="sm-total-row">
            <span>Total</span>
            <strong>{formatMoney(subtotal)}</strong>
          </div>
          <button className="sm-submit" disabled={loading || !items.length}>
            {loading ? "Envoi..." : "Commander le panier"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
