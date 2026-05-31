import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { resetPassword } from "../../services/apiAuth";
import "../../App.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword({ token, ...formData });
      toast.success(data.message || "Mot de passe mis a jour.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.error || "Lien invalide ou expire.");
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
            <h2>Nouveau mot de passe</h2>
            <p>Choisissez un mot de passe d'au moins 6 caracteres.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="input-group">
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="btn-primary-glow w-full" disabled={loading}>
              {loading ? "Mise a jour..." : "Changer le mot de passe"}
            </button>
          </form>

          <p className="login-footer">
            <Link to="/login">Retour a la connexion</Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
