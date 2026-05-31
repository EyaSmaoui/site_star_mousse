import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { login, register } from "../../services/apiAuth";
import { submitPendingOrder } from "../../services/orderService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { redirectByRole } from "../../utils/authUtils";
import "../../App.css";

/* ─── Particle canvas background for left panel ─── */
const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fill();
      });
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        })
      );
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};

const TABS = ["Connexion", "Inscription"];

const strengthColors = ["#e0e0f0", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
const strengthLabels = ["", "Faible", "Moyen", "Fort", "Excellent"];

const STAFF_ROLES = ['manager', 'employee', 'employeur'];

const Auth = ({ role: requiredRole } = {}) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remember, setRemember] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    if (name === "password") {
      let s = 0;
      if (value.length >= 8) s++;
      if (/[A-Z]/.test(value)) s++;
      if (/[0-9]/.test(value)) s++;
      if (/[^A-Za-z0-9]/.test(value)) s++;
      setStrength(s);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 1 && formData.password !== formData.confirm) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (tab === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim()) {
        toast.error("Veuillez remplir tous les champs.");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
    }
    if (tab === 0) {
      if (!formData.email.trim() || !formData.password.trim()) {
        toast.error("Veuillez saisir votre email et mot de passe.");
        return;
      }
    }
    setLoading(true);
    try {
      const response =
        tab === 0
          ? await login({ email: formData.email, password: formData.password })
          : await register({
              username: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              role: "client"
            });

      const payload = response?.data || response;
      const { token, user } = payload;
      if (tab === 0 && requiredRole) {
        const denied =
          (requiredRole === 'admin' && user.role !== 'admin') ||
          (requiredRole === 'employee' && !STAFF_ROLES.includes(user.role)) ||
          (requiredRole === 'client' && user.role !== 'client' && user.role !== 'user');
        if (denied) {
          toast.error("Identifiants valides mais accès non autorisé pour cette interface.");
          setLoading(false);
          return;
        }
      }
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      toast.success(tab === 0 ? "Heureux de vous revoir !" : "Compte créé avec succès !");
      submitPendingOrder().catch((err) => {
        console.error('Erreur commande en attente :', err);
        toast.warning("Connexion réussie, mais la commande en attente n'a pas pu être envoyée.");
      });
      setTimeout(() => {
        if (tab === 0) {
          redirectByRole(user, navigate);
        } else {
          navigate("/client-dashboard");
        }
      }, 1400);
    } catch (err) {
      const errorMessage =
        err.code === "ECONNABORTED"
          ? "Connexion impossible: le serveur d'authentification ne répond pas. Vérifiez MongoDB/backend."
          : err.response?.data?.error || err.response?.data?.message || err.message || "Une erreur est survenue.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sm-auth { display: flex; min-height: 100vh; font-family: 'Sora', sans-serif; }

        /* ══ LEFT ══ */
        .sm-left {
          width: 48%; position: relative; overflow: hidden;
          background: #0d0d1a;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 48px 52px;
        }
        .sm-left-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #0d0d1a 0%, #1a1040 50%, #0d1a2a 100%);
        }
        .sm-blob {
          position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.22; pointer-events: none;
        }
        .sm-blob-1 { width: 340px; height: 340px; background: #4a4ade; top: -100px; left: -80px; }
        .sm-blob-2 { width: 260px; height: 260px; background: #0f9e75; bottom: 20px; right: -70px; }
        .sm-blob-3 { width: 200px; height: 200px; background: #d85a30; top: 55%; left: 55%; }

        .sm-left-inner { position: relative; z-index: 2; }

        .sm-logo {
          font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 700;
          color: #fff; letter-spacing: -0.3px; margin-bottom: 68px;
          display: flex; align-items: center; gap: 10px;
        }
        .sm-logo-dot { width: 8px; height: 8px; border-radius: 50%; background: #4a4ade; display: inline-block; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }

        .sm-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.2vw, 2.9rem); font-weight: 700;
          color: #fff; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 18px;
        }
        .sm-headline em { color: #7f77dd; font-style: italic; }
        .sm-sub { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.75; max-width: 310px; }

        .sm-pills { display: flex; flex-direction: column; gap: 10px; margin-top: 44px; }
        .sm-pill {
          display: flex; align-items: center; gap: 13px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 18px; backdrop-filter: blur(12px);
          transition: background 0.2s, border-color 0.2s;
        }
        .sm-pill:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); }
        .sm-pill-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sm-pill-title { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .sm-pill-desc { font-size: 11.5px; color: rgba(255,255,255,0.38); }

        .sm-left-footer { position: relative; z-index: 2; font-size: 12px; color: rgba(255,255,255,0.22); }

        /* ══ RIGHT ══ */
        .sm-right {
          flex: 1; background: #fafafa;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 40px; overflow-y: auto;
        }
        .sm-wrap { width: 100%; max-width: 420px; }

        /* tabs */
        .sm-tabs {
          display: flex; gap: 4px; background: #f0f0f8;
          border-radius: 12px; padding: 4px; margin-bottom: 34px;
        }
        .sm-tab {
          flex: 1; padding: 10px; border: none; border-radius: 9px;
          font-size: 13.5px; font-weight: 500; font-family: 'Sora', sans-serif;
          cursor: pointer; transition: all 0.25s; color: #9090b0; background: transparent;
        }
        .sm-tab.active { background: #fff; color: #1a1a2e; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }

        /* heading */
        .sm-title {
          font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 700;
          color: #1a1a2e; letter-spacing: -0.4px; margin-bottom: 6px; line-height: 1.2;
        }
        .sm-title em { color: #4a4ade; font-style: italic; }
        .sm-desc { font-size: 13.5px; color: #9090b0; margin-bottom: 26px; }

        /* social */
        .sm-socials { display: flex; gap: 9px; margin-bottom: 22px; }
        .sm-social {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px 10px; border-radius: 11px; cursor: pointer;
          border: 1.5px solid #e8e8f0; background: #fff;
          font-size: 12.5px; font-weight: 500; font-family: 'Sora', sans-serif;
          color: #2a2a3d; transition: all 0.2s;
        }
        .sm-social:hover { border-color: #4a4ade; color: #4a4ade; background: #f5f5ff; }

        /* divider */
        .sm-divider { display: flex; align-items: center; gap: 11px; margin-bottom: 22px; }
        .sm-divider-line { flex: 1; height: 1px; background: #ebebf5; }
        .sm-divider-text { font-size: 11.5px; color: #c0c0d8; white-space: nowrap; }

        /* fields */
        .sm-field { margin-bottom: 15px; }
        .sm-label {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.09em; color: #60607a; margin-bottom: 7px;
        }
        .sm-forgot { font-size: 11.5px; color: #4a4ade; text-decoration: none; font-weight: 500; text-transform: none; letter-spacing: 0; }
        .sm-forgot:hover { color: #1a1a2e; }

        .sm-iw { position: relative; }
        .sm-ii {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          color: #c0c0d8; pointer-events: none; display: flex; align-items: center;
        }
        .sm-input {
          width: 100%; background: #fff; border: 1.5px solid #e8e8f0; border-radius: 12px;
          padding: 13px 14px 13px 40px; font-size: 14px; font-family: 'Sora', sans-serif;
          color: #1a1a2e; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sm-input::placeholder { color: #d0d0e0; }
        .sm-input:focus { border-color: #4a4ade; box-shadow: 0 0 0 3px rgba(74,74,222,0.09); }

        .sm-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #c0c0d8; padding: 2px;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .sm-eye:hover { color: #4a4ade; }

        /* strength */
        .sm-bars { display: flex; gap: 4px; margin-top: 8px; margin-bottom: 4px; }
        .sm-bar { flex: 1; height: 3px; border-radius: 2px; transition: background 0.3s; }
        .sm-bar-label { font-size: 11px; }

        /* options row */
        .sm-options { display: flex; align-items: center; margin-bottom: 20px; }
        .sm-check-row { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .sm-check {
          width: 17px; height: 17px; border-radius: 5px; border: 1.5px solid #ddddf0;
          background: #fff; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .sm-check.on { background: #4a4ade; border-color: #4a4ade; }
        .sm-check-label { font-size: 13px; color: #60607a; }

        /* submit */
        .sm-submit {
          width: 100%; padding: 14px; background: #1a1a2e; color: #fff;
          border: none; border-radius: 12px; font-size: 14px; font-weight: 600;
          font-family: 'Sora', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: all 0.25s; margin-bottom: 18px; position: relative; overflow: hidden;
        }
        .sm-submit::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          transform: translateX(-100%); transition: transform 0.5s;
        }
        .sm-submit:hover::after { transform: translateX(100%); }
        .sm-submit:hover:not(:disabled) { background: #4a4ade; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(74,74,222,0.28); }
        .sm-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .sm-spin {
          width: 15px; height: 15px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* biometric */
        .sm-bios { display: flex; gap: 9px; margin-bottom: 22px; }
        .sm-bio {
          flex: 1; padding: 11px; border-radius: 11px;
          border: 1.5px solid #e8e8f0; background: #fff; cursor: pointer;
          font-size: 12px; font-weight: 500; font-family: 'Sora', sans-serif; color: #60607a;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s;
        }
        .sm-bio:hover { border-color: #0f9e75; color: #0f9e75; background: #f0fbf7; }

        /* footer */
        .sm-foot { text-align: center; font-size: 13px; color: #9090b0; }
        .sm-foot a { color: #4a4ade; font-weight: 600; text-decoration: none; }
        .sm-foot a:hover { color: #1a1a2e; }
        .sm-sec {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 14px; font-size: 11.5px; color: #c0c0d8;
        }

        @media (max-width: 900px) {
          .sm-auth { flex-direction: column; }
          .sm-left { width: 100%; padding: 36px 28px 40px; }
          .sm-pills { flex-direction: row; flex-wrap: wrap; margin-top: 28px; }
          .sm-pill { flex: 1; min-width: 140px; }
          .sm-right { padding: 40px 24px; }
          .sm-left-footer { display: none; }
        }
      `}</style>

      <ToastContainer position="top-right" theme="light" />

      <NavBar />

      <div className="sm-auth">

        {/* ══════════ LEFT ══════════ */}
        <div className="sm-left">
          <div className="sm-left-bg" />
          <div className="sm-blob sm-blob-1" />
          <div className="sm-blob sm-blob-2" />
          <div className="sm-blob sm-blob-3" />
          <ParticleCanvas />

          <div className="sm-left-inner">
            <div className="sm-logo">
              <span className="sm-logo-dot" />
              Star Mousse
            </div>

            <h1 className="sm-headline">
              Le sommeil<br />
              <em>parfait</em> commence<br />
              ici.
            </h1>
            <p className="sm-sub">
              Rejoignez des milliers de clients qui font confiance à Star Mousse pour un repos d'exception.
            </p>

            <div className="sm-pills">
              {[
                {
                  bg: "#1a1040", color: "#7f77dd",
                  title: "Garantie 10 ans", desc: "Sur tous nos matelas orthopédiques",
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                },
                {
                  bg: "#0a2e20", color: "#0f9e75",
                  title: "Livraison 48h", desc: "Partout en Tunisie, offerte dès 199 DT",
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0f9e75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                },
                {
                  bg: "#2e1a0a", color: "#d85a30",
                  title: "Paiement 4×", desc: "Sans frais, par chèque ou traite",
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#d85a30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="3"/><path d="M1 10h22"/></svg>
                },
              ].map((p, i) => (
                <div className="sm-pill" key={i}>
                  <div className="sm-pill-icon" style={{ background: p.bg }}>{p.icon}</div>
                  <div>
                    <div className="sm-pill-title">{p.title}</div>
                    <div className="sm-pill-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sm-left-footer">© 2026 Star Mousse · Tous droits réservés</div>
        </div>

        {/* ══════════ RIGHT ══════════ */}
        <div className="sm-right">
          <div className="sm-wrap">

            {/* Tabs */}
            <div className="sm-tabs">
              {TABS.map((t, i) => (
                <button key={i} className={`sm-tab${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>{t}</button>
              ))}
            </div>

            {/* Title */}
            <h2 className="sm-title">
              {tab === 0 ? <>Bon retour <em>chez vous</em></> : <>Créez votre <em>compte</em></>}
            </h2>
            <p className="sm-desc">
              {tab === 0 ? "Accédez à votre espace client Star Mousse." : "Rejoignez la famille Star Mousse en quelques secondes."}
            </p>

            {/* Social */}
            <div className="sm-socials">
              {[
                {
                  label: "Google",
                  icon: <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                },
                {
                  label: "Facebook",
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                },
                {
                  label: "Apple",
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                },
              ].map((s) => (
                <button key={s.label} className="sm-social" onClick={() => toast.info(`${s.label} bientôt disponible`)}>
                  {s.icon}{s.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="sm-divider">
              <div className="sm-divider-line" />
              <span className="sm-divider-text">ou avec votre email</span>
              <div className="sm-divider-line" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Name */}
              {tab === 1 && (
                <div className="sm-field">
                  <label className="sm-label">Nom complet</label>
                  <div className="sm-iw">
                    <span className="sm-ii">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>
                    <input className="sm-input" type="text" name="name" placeholder="Prénom Nom"
                      value={formData.name} onChange={handleChange} required />
                  </div>
                </div>
              )}

              {/* Phone */}
              {tab === 1 && (
                <div className="sm-field">
                  <label className="sm-label">Telephone</label>
                  <div className="sm-iw">
                    <span className="sm-ii">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.08 4.18 2 2 0 014.06 2h3a2 2 0 012 1.72c.12.9.32 1.77.59 2.61a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.47-1.11a2 2 0 012.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0122 16.92z"/></svg>
                    </span>
                    <input
                      className="sm-input"
                      type="tel"
                      name="phone"
                      placeholder="Votre numero de telephone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="sm-field">
                <label className="sm-label">Adresse email</label>
                <div className="sm-iw">
                  <span className="sm-ii">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>
                  </span>
                  <input className="sm-input" type="email" name="email" placeholder="vous@email.com"
                    value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              {/* Password */}
              <div className="sm-field">
                <label className="sm-label">
                  Mot de passe
                  {tab === 0 && <Link to="/forgot-password" className="sm-forgot">Mot de passe oublié ?</Link>}
                </label>
                <div className="sm-iw">
                  <span className="sm-ii">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </span>
                  <input className="sm-input" type={showPass ? "text" : "password"} name="password"
                    placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                  <button type="button" className="sm-eye" onClick={() => setShowPass(v => !v)}>
                    {showPass
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {tab === 1 && formData.password && (
                  <div style={{ marginTop: 8 }}>
                    <div className="sm-bars">
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} className="sm-bar"
                          style={{ background: strength >= n ? strengthColors[strength] : "#e8e8f0" }} />
                      ))}
                    </div>
                    <div className="sm-bar-label" style={{ color: strengthColors[strength] }}>
                      {strengthLabels[strength]}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm */}
              {tab === 1 && (
                <div className="sm-field">
                  <label className="sm-label">Confirmer le mot de passe</label>
                  <div className="sm-iw">
                    <span className="sm-ii">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/></svg>
                    </span>
                    <input className="sm-input" type={showConfirm ? "text" : "password"} name="confirm"
                      placeholder="••••••••" value={formData.confirm} onChange={handleChange} required />
                    <button type="button" className="sm-eye" onClick={() => setShowConfirm(v => !v)}>
                      {showConfirm
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Remember me */}
              {tab === 0 && (
                <div className="sm-options">
                  <div className="sm-check-row" onClick={() => setRemember(v => !v)}>
                    <div className={`sm-check${remember ? " on" : ""}`}>
                      {remember && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </div>
                    <span className="sm-check-label">Se souvenir de moi</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="sm-submit" disabled={loading}>
                {loading ? (
                  <><span className="sm-spin" />{tab === 0 ? "Connexion…" : "Création…"}</>
                ) : (
                  <>{tab === 0 ? "Se connecter" : "Créer mon compte"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg></>
                )}
              </button>
            </form>

            {/* Biometric */}
            {tab === 0 && (
              <div className="sm-bios">
                {[
                  { label: "Empreinte", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10a2 2 0 00-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38-.08 3.46-.08 5.88M17.41 11.56c.34 1.69.35 2.95.35 4.44M17 5.57a10 10 0 00-10 .29M12 3a9.96 9.96 0 018 4.43M3.34 9a10.06 10.06 0 00-.05 4.9M8.16 17.54a11 11 0 003.23 3.46"/></svg> },
                  { label: "Face ID", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 9h.01M15 9h.01M8 13s1 2 4 2 4-2 4-2M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/></svg> },
                  { label: "QR Code", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg> },
                ].map(b => (
                  <button key={b.label} className="sm-bio" onClick={() => toast.info(`${b.label} bientôt disponible`)}>
                    {b.icon}{b.label}
                  </button>
                ))}
              </div>
            )}

            {/* Footer */}
            <p className="sm-foot">
              {tab === 0
                ? <>Pas encore de compte ? <a href="#" onClick={e => { e.preventDefault(); setTab(1); }}>Créer un compte</a></>
                : <>Déjà inscrit ? <a href="#" onClick={e => { e.preventDefault(); setTab(0); }}>Se connecter</a></>
              }
            </p>

            <div className="sm-sec">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f9e75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Connexion chiffrée SSL · Données protégées
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Auth;
