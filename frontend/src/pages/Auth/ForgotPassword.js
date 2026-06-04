import React, { useEffect, useState } from "react";
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
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error("Veuillez saisir votre email.");
      return;
    }

    if (cooldownSeconds > 0) return;
    setLoading(true);
    setResetLink("");

    try {
      const data = await forgotPassword(value);
      toast.success(data.message || "Si cet email existe, un lien a été envoyé.");
      if (data.resetLink) setResetLink(data.resetLink);
    } catch (error) {
      // 🕵️‍♂️ Extraction compatible avec la structure de ton `httpClient.js`
      const status = error?.status || error?.response?.status;
      const message = error?.message || error?.response?.data?.error || "Impossible d'envoyer le lien.";
      
      // On tente de récupérer le retry-after si jamais l'intercepteur l'a laissé passer
      const retryAfter = error?.response?.headers?.['retry-after'] || error?.response?.headers?.['Retry-After'];
      let seconds = Number.parseInt(retryAfter, 10);

      // 🔥 Si c'est un 429 mais qu'on n'a pas pu parser les secondes (à cause de l'intercepteur)
      if (status === 429 && (!Number.isFinite(seconds) || seconds <= 0)) {
        // Fallback temporaire à 60 secondes pour bloquer l'IHM et protéger l'UX
        seconds = 60; 
      }

      if (Number.isFinite(seconds) && seconds > 0) {
        setCooldownSeconds(seconds);
        toast.error(`Trop de tentatives. ${message}`);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Countdown UX
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const t = setInterval(() => {
      setCooldownSeconds((s) => (s > 1 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [cooldownSeconds]);

  // Formatage pour les très longues durées (ex: tes 23 heures de blocage actuelles)
  const formatCooldown = (sec) => {
    if (sec > 3600) return `${Math.ceil(sec / 3600)}h`;
    if (sec > 60) return `${Math.ceil(sec / 60)}m`;
    return `${sec}s`;
  };

  return (
    <>
      <NavBar />

      <section className="login-section">
        <div className="login-blob" />
        <div className="login-card">
          <div className="login-header">
            <h2>Mot de passe oublié</h2>
            <p>Entrez votre email et nous vous envoyons un lien pour créer un nouveau mot de passe.</p>
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

            <button 
              type="submit" 
              className="btn-primary-glow w-full" 
              disabled={loading || cooldownSeconds > 0}
            >
              {cooldownSeconds > 0 
                ? `Patientez (${formatCooldown(cooldownSeconds)})` 
                : loading 
                ? "Envoi..." 
                : "Envoyer le lien"
              }
            </button>
          </form>

          {resetLink && (
            <div className="login-footer" style={{ overflowWrap: "anywhere" }}>
              Mode test: <a href={resetLink} target="_blank" rel="noreferrer">ouvrir le lien de réinitialisation</a>
            </div>
          )}

          <p className="login-footer">
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}