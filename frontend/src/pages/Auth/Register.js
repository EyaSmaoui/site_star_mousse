import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { register } from "../../services/apiAuth";
import { submitPendingOrder } from "../../services/orderService";
import "../../App.css";

const Register = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [formData, setFormData] = useState({
    username: searchParams.get("username") || "",
    email: searchParams.get("email") || "",
    password: "",
    phone: searchParams.get("phone") || "", // Ajout du numéro de téléphone
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 8);
      setFormData({ ...formData, [name]: digits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation simple
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      toast.error("Veuillez remplir tous les champs ⚠️");
      return;
    }
    // phone must be exactly 8 digits
    if ((formData.phone || "").replace(/\D/g, "").length !== 8) {
      toast.error("Le numéro de téléphone doit contenir exactement 8 chiffres.");
      return;
    }

    setLoading(true);

    try {
      // 2. APPEL AU SERVEUR (Utilise le service apiAuth)
      const response = await register(formData);

      if (response?.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      const hasPendingOrder = Boolean(sessionStorage.getItem('pendingOrder'));
      if (hasPendingOrder) {
        sessionStorage.setItem('showReviewAfterAuth', 'true');
      }
      toast.success("Compte Star Mousse créé ! Bienvenue 🌙");
      submitPendingOrder().catch((err) => {
        console.error('Erreur commande en attente :', err);
        toast.warning("Compte cree. Votre ancienne commande en attente n'a pas pu etre envoyee, merci de la refaire.");
      });
      setTimeout(() => {
        navigate("/client-dashboard");
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erreur lors de l'inscription.";
      toast.error(`Échec : ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-midnight">
      <NavBar />
      <ToastContainer theme="dark" position="top-right" />

      <section className="login-section">
        <div className="login-blob"></div>

        <div className="login-card fade-up visible">
          <div className="login-header">
            <h2>Créer un compte</h2>
            <p>Rejoignez le showroom Star Mousse et finalisez votre commande en toute simplicité.</p>
            <div className="benefit-badges">
              <span className="badge">Sécurité renforcée</span>
              <span className="badge">Saisie automatique</span>
              <span className="badge">Expérience premium</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Nom complet *</label>
              <input
                type="text"
                name="username"
                placeholder="Votre nom"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Numéro de téléphone *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Ex: 22 123 456"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Mot de passe *</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary-glow w-full" 
              disabled={loading}
            >
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <p className="login-footer">
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
