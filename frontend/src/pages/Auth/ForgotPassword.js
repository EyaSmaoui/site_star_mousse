import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { forgotPassword } from "../../services/apiAuth";
import "../../App.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error("Veuillez saisir votre email.");
      return;
    }

    setLoading(true);
    setResetLink("");
    try {
      const data = await forgotPassword(value);
      toast.success(data.message || "Si cet email existe, un lien a ete envoye.");
      if (data.resetLink) setResetLink(data.resetLink);
    } catch (error) {
      toast.error(error.response?.data?.error || "Impossible d'envoyer le lien.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <section className="login-section">
        <div className="login-blob" />
        <div className="login-card fade-up visible">
          <div className="login-header">
            <h2>Mot de passe oublie</h2>
            <p>Entrez votre email et nous vous envoyons un lien pour creer un nouveau mot de passe.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vous@email.com"
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="btn-primary-glow w-full" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>

          {resetLink && (
            <div className="login-footer" style={{ overflowWrap: "anywhere" }}>
              Mode test: <a href={resetLink} target="_blank" rel="noreferrer">ouvrir le lien de reinitialisation</a>
            </div>
          )}

          <p className="login-footer">
            <Link to="/login">Retour a la connexion</Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
