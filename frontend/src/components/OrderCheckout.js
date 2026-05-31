import React, { useEffect, useState } from "react";
import { addReview } from "../services/apiReview";
import { addCartItem } from "../utils/cartUtils";
import { login, register } from "../services/apiAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultFields = {
  name: "name",
  phone: "phone",
  address: "address",
  email: "email",
};

function readValue(form, fields, key) {
  const field = fields[key];
  return form?.[field] ?? "";
}

export default function OrderCheckout({
  form,
  setForm,
  fields = defaultFields,
  subtotal,
  delivery = 0,
  total,
  fmt,
  qty,
  setQty,
  loading = false,
  onSubmit,
  buttonLabel = "Commander maintenant",
}) {
  const formFields = { ...defaultFields, ...fields };
  const format = fmt || ((value) => `${Number(value || 0).toFixed(2)} DT`);
  const orderTotal = typeof total === "number" ? total : Number(subtotal || 0) + Number(delivery || 0);
  const [reviewPrompt, setReviewPrompt] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [authMode, setAuthMode] = useState(null);
  const [authData, setAuthData] = useState({ email: "", password: "", name: "", phone: "", confirm: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    if (user && form.name === "") {
      setForm(current => ({
        ...current,
        name: user.username || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  const updateField = (key, value) => {
    const field = formFields[key];
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthData((current) => ({ ...current, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        const response = await login({ email: authData.email, password: authData.password });
        const { token, user } = response.data || response;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          setForm(current => ({
            ...current,
            name: user.username || user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
          }));
          window.dispatchEvent(new CustomEvent('user-logged-in', { detail: user }));
          setAuthMode(null);
          toast.success("Connecté avec succès !");
        }
      } else if (authMode === "register") {
        if (authData.password !== authData.confirm) {
          toast.error("Les mots de passe ne correspondent pas.");
          setAuthLoading(false);
          return;
        }
        const response = await register({
          username: authData.name,
          email: authData.email,
          phone: authData.phone,
          password: authData.password,
          role: "client"
        });
        const { token, user } = response.data || response;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          setForm(current => ({
            ...current,
            name: user.username || user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
          }));
          window.dispatchEvent(new CustomEvent('user-logged-in', { detail: user }));
          setAuthMode(null);
          toast.success("Compte créé avec succès !");
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Erreur d'authentification";
      toast.error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthMode(null);
    setForm(current => ({ ...current, name: "", email: "", phone: "" }));
  };

  const handleButtonClick = (event) => {
    if (typeof onSubmit === "function") {
      onSubmit(event);
    }
  };

  const handleAddToCart = () => {
    const title = document.querySelector("h1")?.textContent?.trim() || "Produit Star Mousse";
    const selectedSize =
      document.querySelector('input[name="size"]:checked')?.closest("label")?.textContent?.trim() ||
      document.querySelector(".ssn-size.active, .ssn-size-btn.active, .ssn-size-item input:checked")?.textContent?.trim() ||
      "";
    const image = document.querySelector(".ssn-main-frame img, .ssn-gallery img, img[alt]")?.getAttribute("src") || "";
    const quantity = Math.max(1, Number(qty || 1));
    const unitPrice = quantity ? Number(subtotal || orderTotal || 0) / quantity : Number(subtotal || orderTotal || 0);

    addCartItem({
      name: title,
      size: selectedSize,
      image,
      price: unitPrice,
      quantity,
    });
  };

  useEffect(() => {
    const openReviewPrompt = (event) => {
      const detail = event.detail;
      if (!detail?.order) return;

      detail.opened = true;
      setReviewPrompt(detail);
      setReviewForm({ rating: 0, comment: "" });
      setReviewError("");
    };

    window.addEventListener("star-mousse:order-saved", openReviewPrompt);
    return () => window.removeEventListener("star-mousse:order-saved", openReviewPrompt);
  }, []);

  const closeReviewPrompt = () => {
    try {
      sessionStorage.removeItem("pendingReviewOrder");
    } catch {
      // Ignore storage cleanup errors.
    }

    reviewPrompt?.complete?.();
    setReviewPrompt(null);
    setReviewSaving(false);
    setReviewError("");
  };

  const submitReview = async (event) => {
    event.preventDefault();

    if (!reviewForm.rating) {
      setReviewError("Choisissez une note avant d'envoyer votre avis.");
      return;
    }

    try {
      setReviewSaving(true);
      await addReview({
        order: reviewPrompt.order._id,
        productName: reviewPrompt.product?.name || "Produit Star Mousse",
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      closeReviewPrompt();
    } catch (error) {
      console.error("Erreur avis apres commande:", error);
      setReviewError("Impossible d'envoyer l'avis pour le moment.");
    } finally {
      setReviewSaving(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="light" />

      <div className="sm-order-checkout">
        {/* Auth Section - shown if not logged in and user chooses to auth */}
        {!user && authMode && (
          <div style={styles.authSection}>
            <div style={styles.authHeader}>
              <h3 style={styles.authTitle}>
                {authMode === "login" ? "Se connecter" : "Créer un compte"}
              </h3>
              <button type="button" style={styles.authClose} onClick={() => setAuthMode(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} style={styles.authForm}>
              {authMode === "register" && (
                <div style={styles.sm_field}>
                  <label style={styles.sm_label}>Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Prénom Nom"
                    value={authData.name}
                    onChange={handleAuthChange}
                    required
                    style={styles.sm_input}
                  />
                </div>
              )}

              {authMode === "register" && (
                <div style={styles.sm_field}>
                  <label style={styles.sm_label}>Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Votre numéro"
                    value={authData.phone}
                    onChange={handleAuthChange}
                    required
                    style={styles.sm_input}
                  />
                </div>
              )}

              <div style={styles.sm_field}>
                <label style={styles.sm_label}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="vous@email.com"
                  value={authData.email}
                  onChange={handleAuthChange}
                  required
                  style={styles.sm_input}
                />
              </div>

              <div style={styles.sm_field}>
                <label style={styles.sm_label}>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={authData.password}
                  onChange={handleAuthChange}
                  required
                  style={styles.sm_input}
                />
              </div>

              {authMode === "register" && (
                <div style={styles.sm_field}>
                  <label style={styles.sm_label}>Confirmer le mot de passe</label>
                  <input
                    type="password"
                    name="confirm"
                    placeholder="••••••••"
                    value={authData.confirm}
                    onChange={handleAuthChange}
                    required
                    style={styles.sm_input}
                  />
                </div>
              )}

              <button type="submit" style={styles.authSubmit} disabled={authLoading}>
                {authLoading ? "Envoi..." : (authMode === "login" ? "Se connecter" : "Créer un compte")}
              </button>

              <button
                type="button"
                style={styles.authToggle}
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setAuthData({ email: "", password: "", name: "", phone: "", confirm: "" });
                }}
              >
                {authMode === "login" ? "Créer un compte" : "J'ai un compte"}
              </button>
            </form>
          </div>
        )}

        {/* Auth buttons - shown if not logged in and not in auth mode */}
        {!user && !authMode && (
          <div style={styles.authPrompt}>
            <p style={styles.authPromptText}>Vous avez déjà un compte Star Mousse ?</p>
            <div style={styles.authButtons}>
              <button type="button" style={styles.loginBtn} onClick={() => setAuthMode("login")}>
                Se connecter
              </button>
              <button type="button" style={styles.registerBtn} onClick={() => setAuthMode("register")}>
                Créer un compte
              </button>
            </div>
          </div>
        )}

        {/* User info - shown if logged in */}
        {user && (
          <div style={styles.userInfo}>
            <div style={styles.userGreeting}>Bienvenue, <strong>{user.username || user.name || "Client"}</strong></div>
            <button type="button" style={styles.logoutBtn} onClick={handleLogout}>
              Changer de compte
            </button>
          </div>
        )}

        <div className="sm-order-title">Informations personnelles</div>

        <div className="sm-order-field">
          <label>Nom</label>
          <input
            type="text"
            placeholder="Entrez votre nom"
            value={readValue(form, formFields, "name")}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </div>

        <div className="sm-order-field">
          <label>Telephone</label>
          <input
            type="tel"
            placeholder="Entrez votre numero de telephone"
            value={readValue(form, formFields, "phone")}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>

        <div className="sm-order-field">
          <label>Adresse</label>
          <input
            type="text"
            placeholder="Entrez votre adresse"
            value={readValue(form, formFields, "address")}
            onChange={(event) => updateField("address", event.target.value)}
          />
        </div>

        <div className="sm-order-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={readValue(form, formFields, "email")}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </div>

        <div className="sm-order-summary">
          <div className="sm-order-row">
            <span>Sous-total</span>
            <strong>{format(subtotal || 0)}</strong>
          </div>
          <div className="sm-order-row">
            <span>Livraison</span>
            <strong>{format(delivery || 0)}</strong>
          </div>
          <div className="sm-order-row sm-order-row-total">
            <span>Total</span>
            <strong>{format(orderTotal)}</strong>
          </div>
        </div>

        <div className="sm-order-actions">
          <button type="button" className="sm-order-submit" onClick={handleButtonClick} disabled={loading}>
            {loading ? "Envoi en cours..." : buttonLabel}
          </button>
          <button type="button" className="sm-order-submit sm-order-cart" onClick={handleAddToCart} disabled={loading}>
            Ajouter au panier
          </button>
          <div className="sm-order-qty" aria-label="Quantite">
            <button type="button" onClick={() => setQty(Math.max(1, Number(qty || 1) - 1))}>
              -
            </button>
            <span>{qty || 1}</span>
            <button type="button" onClick={() => setQty(Number(qty || 1) + 1)}>
              +
            </button>
          </div>
        </div>
      </div>

      {reviewPrompt && (
        <div style={styles.backdrop} role="presentation" onClick={closeReviewPrompt}>
          <form style={styles.modal} onSubmit={submitReview} onClick={(event) => event.stopPropagation()}>
            <button type="button" style={styles.close} onClick={closeReviewPrompt} aria-label="Fermer">
              x
            </button>
            <h2 style={styles.title}>Laisser un avis</h2>
            <p style={styles.subtitle}>Sur {reviewPrompt.product?.name || "votre produit"}</p>

            <label style={styles.label}>Votre commentaire :</label>
            <textarea
              value={reviewForm.comment}
              onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
              placeholder="Exprimez votre experience..."
              rows="4"
              style={styles.textarea}
            />

            <label id="inline-review-rating" style={styles.label}>Laissez votre note</label>
            <div style={styles.stars} role="radiogroup" aria-labelledby="inline-review-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm((current) => ({ ...current, rating: star }))}
                  role="radio"
                  aria-checked={reviewForm.rating === star}
                  aria-label={`${star} etoile${star > 1 ? "s" : ""}`}
                  style={{
                    ...styles.star,
                    ...(star <= reviewForm.rating ? styles.starActive : {}),
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            <div style={styles.selected}>Note selectionnee : {reviewForm.rating} etoile(s)</div>
            {reviewError && <div style={styles.error}>{reviewError}</div>}

            <button type="submit" style={styles.submit} disabled={reviewSaving}>
              {reviewSaving ? "Envoi..." : "Envoyer"}
            </button>
            <button type="button" style={styles.skip} onClick={closeReviewPrompt}>
              Plus tard
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const styles = {
  authPrompt: {
    marginBottom: 24,
    padding: 18,
    background: "linear-gradient(135deg, #f0f0f8 0%, #f5f0ff 100%)",
    borderRadius: 12,
    textAlign: "center",
  },
  authPromptText: {
    margin: "0 0 12px 0",
    fontSize: 14,
    color: "#4b5563",
    fontWeight: 500,
  },
  authButtons: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  loginBtn: {
    padding: "10px 16px",
    border: "1.5px solid #7c2fbf",
    borderRadius: 8,
    background: "#fff",
    color: "#7c2fbf",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
    transition: "all 0.2s",
  },
  registerBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    background: "#7c2fbf",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
    transition: "all 0.2s",
  },
  authSection: {
    marginBottom: 24,
    padding: 20,
    background: "#f9f7ff",
    borderRadius: 12,
    border: "1px solid #ebe4ff",
  },
  authHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  authTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a2e",
  },
  authClose: {
    background: "none",
    border: "none",
    fontSize: 18,
    color: "#9090b0",
    cursor: "pointer",
    padding: 0,
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  sm_field: {
    marginBottom: 12,
  },
  sm_label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#60607a",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  sm_input: {
    width: "100%",
    padding: "11px 12px",
    border: "1.5px solid #e8e8f0",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  authSubmit: {
    padding: 12,
    background: "#7c2fbf",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
    marginTop: 4,
    transition: "background 0.2s",
  },
  authToggle: {
    padding: 10,
    background: "transparent",
    color: "#7c2fbf",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
    textDecoration: "underline",
  },
  userInfo: {
    marginBottom: 24,
    padding: 16,
    background: "#e8f5e9",
    borderRadius: 12,
    border: "1px solid #81c784",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userGreeting: {
    fontSize: 14,
    color: "#2e7d32",
    fontWeight: 500,
  },
  logoutBtn: {
    padding: "8px 14px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 2000,
    background: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modal: {
    position: "relative",
    width: "min(430px, 100%)",
    background: "#fff",
    borderRadius: 8,
    padding: 26,
    boxShadow: "0 28px 80px rgba(0,0,0,.25)",
  },
  close: {
    position: "absolute",
    top: 10,
    right: 12,
    border: "none",
    background: "transparent",
    color: "#8b8b99",
    fontSize: 20,
    cursor: "pointer",
  },
  title: {
    margin: "0 0 8px",
    textAlign: "center",
    color: "#7c2fbf",
    fontSize: 22,
  },
  subtitle: {
    margin: "0 0 20px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
  },
  label: {
    display: "block",
    margin: "14px 0 8px",
    textAlign: "center",
    color: "#4b5563",
    fontWeight: 700,
  },
  textarea: {
    width: "100%",
    border: "1px solid #d8d8e2",
    borderRadius: 8,
    padding: 12,
    font: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  stars: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
  },
  star: {
    border: "none",
    background: "transparent",
    color: "#a7a7b3",
    fontSize: 30,
    lineHeight: 1,
    cursor: "pointer",
  },
  starActive: {
    color: "#f6c400",
  },
  selected: {
    margin: "14px 0 10px",
    borderRadius: 8,
    padding: 12,
    background: "linear-gradient(135deg, #a83df0, #7b1bb4)",
    color: "#fff",
    textAlign: "center",
    fontWeight: 800,
  },
  error: {
    marginBottom: 10,
    color: "#dc2626",
    textAlign: "center",
    fontSize: 13,
    fontWeight: 700,
  },
  submit: {
    width: "100%",
    border: "none",
    borderRadius: 8,
    padding: "13px 16px",
    background: "#7c2fbf",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  skip: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#6b7280",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 10,
  },
};
