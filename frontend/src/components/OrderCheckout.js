import React, { useEffect, useState } from "react";
import { addReview } from "../services/apiReview";
import { addCartItem } from "../utils/cartUtils";

const defaultFields = {
  name: "nom",
  phone: "tel",
  address: "adresse",
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

  const updateField = (key, value) => {
    const field = formFields[key];
    setForm((current) => ({ ...current, [field]: value }));
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
      <div className="sm-order-checkout">
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
