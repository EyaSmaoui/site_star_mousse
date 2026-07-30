import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
      <style>{`
        .sm-cart-page { min-height: 100vh; background: #fafaf8; color: #0a0a0a; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .sm-cart-shell { max-width: 1180px; margin: 0 auto; padding: 42px 20px 64px; display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 30px; align-items: start; }
        .sm-cart-head { grid-column: 1 / -1; display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; }
        .sm-cart-head h1 { margin: 0; font-size: 38px; letter-spacing: 0; line-height: 1.05; }
        .sm-cart-head p { margin: 10px 0 0; color: #6b6b6b; max-width: 520px; }
        .sm-cart-card, .sm-cart-summary { background: #ffffff; border: 1px solid #e2e2de; border-radius: 24px; box-shadow: 0 24px 60px rgba(10,10,10,0.08); }
        .sm-cart-list { display: flex; flex-direction: column; }
        .sm-cart-item { display: grid; grid-template-columns: 96px minmax(0, 1fr) auto; gap: 16px; padding: 22px; border-bottom: 1px solid #f0ece3; align-items: center; }
        .sm-cart-item:last-child { border-bottom: 0; }
        .sm-cart-img { width: 96px; height: 96px; border-radius: 16px; background: #f7f2ea; object-fit: cover; }
        .sm-cart-name { margin: 0 0 6px; font-size: 16px; font-weight: 900; }
        .sm-cart-meta { color: #6b6b6b; font-size: 13px; }
        .sm-cart-price { margin-top: 10px; font-weight: 900; color: #0a0a0a; }
        .sm-cart-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .sm-stepper { display: inline-flex; align-items: center; border: 1px solid #e2e2de; border-radius: 999px; overflow: hidden; height: 40px; }
        .sm-stepper button { width: 38px; height: 38px; border: 0; background: #ffffff; cursor: pointer; font-weight: 900; color: #0a0a0a; }
        .sm-stepper span { min-width: 34px; text-align: center; font-weight: 900; }
        .sm-remove { border: 1px solid #d8d0c8; background: #f7f3ef; color: #0a0a0a; border-radius: 14px; height: 38px; padding: 0 12px; cursor: pointer; font-weight: 800; }
        .sm-cart-summary { padding: 28px; position: sticky; top: 100px; }
        .sm-cart-summary h2 { margin: 0 0 20px; font-size: 20px; }
        .sm-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .sm-field label { font-size: 12px; color: #6b6b6b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
        .sm-field input { border: 1px solid #e2e2de; border-radius: 16px; padding: 14px 16px; font: inherit; outline: 0; background: #fafafa; }
        .sm-total-row { display: flex; justify-content: space-between; padding: 16px 0; border-top: 1px solid #f0ece3; font-weight: 900; }
        .sm-submit { width: 100%; border: 0; border-radius: 999px; padding: 15px 18px; background: #0a0a0a; color: #fff; font-weight: 900; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .sm-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(10,10,10,0.18); }
        .sm-submit:disabled { opacity: .55; cursor: not-allowed; }
        .sm-empty { padding: 36px; text-align: center; }
        .sm-empty a, .sm-cart-head a { color: #0a0a0a; font-weight: 900; text-decoration: none; }
        @media (max-width: 768px) {
          .sm-cart-shell {
            grid-template-columns: 1fr;
            padding: 24px 14px 56px;
            gap: 18px;
          }
          .sm-cart-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .sm-cart-head h1 {
            font-size: 26px;
          }
          .sm-cart-item {
            grid-template-columns: 72px 1fr;
            row-gap: 12px;
          }
          .sm-cart-actions {
            grid-column: 1 / -1;
            justify-content: flex-start;
          }
          .sm-cart-img {
            width: 72px;
            height: 72px;
          }
          .sm-remove {
            min-height: 36px;
          }
          .sm-stepper button {
            width: 36px;
            height: 36px;
          }
        }
        @media (max-width: 480px) {
          .sm-cart-shell {
            padding: 18px 10px 50px;
            gap: 14px;
          }
          .sm-cart-item {
            grid-template-columns: 64px 1fr;
          }
          .sm-cart-img {
            width: 64px;
            height: 64px;
            border-radius: 10px;
          }
          .sm-cart-name {
            font-size: 14px;
          }
          .sm-cart-summary {
            padding: 16px;
          }
        }
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
    </div>
  );
}
