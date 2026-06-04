import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import SuccessModal from "../../components/SuccessModal";
import { useSuccessAlert } from "../../hooks/useSuccessAlert";
import { getAllUsers, updateProfile, changePassword } from "../../services/apiUser";

/* ─── StatCard ───────────────────────────────────────────────────────────── */
const StatCard = ({ icon, value, label, iconBg }) => (
  <div style={S.statCard}>
    <div style={{ ...S.statIconBox, background: iconBg }}>{icon}</div>
    <div style={S.statValue}>{value}</div>
    <div style={S.statLabel}>{label}</div>
  </div>
);

/* ─── InfoRow ────────────────────────────────────────────────────────────── */
const InfoRow = ({ icon, label, value, accent }) => (
  <div style={S.infoRow}>
    <div style={S.infoIconWrap}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={S.infoLabel}>{label}</div>
      <div style={{ ...S.infoValue, color: accent ? "#f97316" : "#1f2937" }}>{value}</div>
    </div>
  </div>
);

/* ─── ActivityRow ────────────────────────────────────────────────────────── */
const ActivityRow = ({ action, time, type }) => {
  const dotColor = { success: "#10b981", warning: "#f97316", info: "#3b82f6" }[type];
  return (
    <div style={S.activityRow}>
      <div style={{ ...S.activityDot, background: dotColor }} />
      <span style={S.activityText}>{action}</span>
      <span style={S.activityTime}>{time}</span>
    </div>
  );
};

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 16, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  user:     ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
  mail:     ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  pin:      ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", "M12 10a2 2 0 100-4 2 2 0 000 4z"],
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  edit:     ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  logout:   ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  package:  ["M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z", "M3.27 6.96L12 12.01l8.73-5.05", "M12 22.08V12"],
  users:    ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M23 21v-2a4 4 0 00-3-3.87", "M9 7a4 4 0 100 8 4 4 0 000-8z", "M16 3.13a4 4 0 010 7.75"],
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  check:    "M20 6L9 17l-5-5",
  camera:   ["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z", "M12 17a4 4 0 100-8 4 4 0 000 8z"],
};

/* ─── Profile ────────────────────────────────────────────────────────────── */
export default function Profile() {
  const { isOpen, message, title, showSuccess, closeSuccess } = useSuccessAlert();
  
  // États locaux pour gérer la session et le chargement
  const [userData, setUserData] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false });
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // useEffect : Récupération des données utilisateur
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        
        if (localUser) {
          setUserData(localUser);
          setNameInput(localUser.username || "Admin Star Mousse");
          setPhoneInput(localUser.phone || "");
          setAddressInput(localUser.address || "");
        } else {
          const data = await getAllUsers();
          if (data && data.length > 0) {
            setUserData(data[0]);
            setNameInput(data[0].username);
            setPhoneInput(data[0].phone || "");
            setAddressInput(data[0].address || "");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // handleSave corrigé (évite l'erreur 431 en nettoyant le payload)
  const handleSave = async () => {
    try {
      const payload = {
        username: nameInput,
        phone: phoneInput,
        address: addressInput,
      };

      await updateProfile(payload);
      
      const updatedUser = { ...userData, username: nameInput, phone: phoneInput, address: addressInput };
      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showSuccess('Profil mis à jour avec succès!', 'Enregistré!');
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const handlePasswordFieldChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      alert("Veuillez remplir tous les champs du mot de passe.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      alert("Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    setPasswordUpdating(true);
    try {
      await changePassword({ currentPassword: passwords.current, newPassword: passwords.next, confirmPassword: passwords.confirm });
      setPasswords({ current: "", next: "", confirm: "" });
      setShowPasswords({ current: false, next: false, confirm: false });
      showSuccess('Mot de passe mis à jour avec succès!', 'Enregistré!');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      alert("Impossible de mettre à jour le mot de passe.");
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#fdf6ef" }}>
        Chargement du profil...
      </div>
    );
  }

  return (
    <div style={S.root}>
      <AdminSidebar />

      <main className="admin-main sm-internal-main" style={S.main}>
        <div style={S.header}>
          <div>
            <p style={S.breadcrumb}>Administration / Profil</p>
            <h1 style={S.title}>Mon profil</h1>
            <p style={S.subtitle}>Nom, email, téléphone, adresse et mot de passe</p>
          </div>
          <button onClick={handleLogout} style={S.logoutBtn}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fecaca"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}>
            <Icon d={icons.logout} size={15} color="#dc2626" />
            <span>Déconnexion</span>
          </button>
        </div>

        <div style={S.grid}>
          <section style={S.card}>
            <h2 style={S.sectionTitle}>Informations</h2>
            <label style={S.label}>Nom complet</label>
            <input
              style={S.input}
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={userData?.email || ""} disabled />
            <label style={S.label}>Téléphone</label>
            <input
              style={S.input}
              type="tel"
              inputMode="numeric"
              pattern="\\d{8}"
              maxLength={8}
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 8))}
            />
            <label style={S.label}>Adresse</label>
            <input
              style={S.input}
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <label style={S.label}>Rôle</label>
            <input style={S.input} type="text" value={userData?.role || "Administrateur"} disabled />
            <button style={S.actionButton} type="button" onClick={handleSave}>
              Enregistrer
            </button>
          </section>

          <section style={S.card}>
            <h2 style={S.sectionTitle}>Mot de passe</h2>
            <label style={S.label}>Mot de passe actuel</label>
            <div style={S.passwordContainer}>
              <input
                style={S.input}
                type={showPasswords.current ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => handlePasswordFieldChange("current", e.target.value)}
              />
              <button style={S.toggleButton} onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))} type="button">
                {showPasswords.current ? "👁️" : "🔒"}
              </button>
            </div>
            <label style={S.label}>Nouveau mot de passe</label>
            <div style={S.passwordContainer}>
              <input
                style={S.input}
                type={showPasswords.next ? "text" : "password"}
                value={passwords.next}
                onChange={(e) => handlePasswordFieldChange("next", e.target.value)}
              />
              <button style={S.toggleButton} onClick={() => setShowPasswords((prev) => ({ ...prev, next: !prev.next }))} type="button">
                {showPasswords.next ? "👁️" : "🔒"}
              </button>
            </div>
            <label style={S.label}>Confirmer le nouveau mot de passe</label>
            <div style={S.passwordContainer}>
              <input
                style={S.input}
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => handlePasswordFieldChange("confirm", e.target.value)}
              />
              <button style={S.toggleButton} onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))} type="button">
                {showPasswords.confirm ? "👁️" : "🔒"}
              </button>
            </div>
            <button style={S.actionButton} onClick={handlePasswordUpdate} type="button" disabled={passwordUpdating}>
              {passwordUpdating ? "Mise à jour…" : "Mettre à jour le mot de passe"}
            </button>
          </section>
        </div>

        <SuccessModal isOpen={isOpen} title={title} message={message} onClose={closeSuccess} />
      </main>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  root: { display: "flex", minHeight: "100vh", background: "#fdf6ef", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1f2937" },
  main: { marginLeft: 220, flex: 1, padding: "32px 34px 48px" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 28, flexWrap: "wrap" },
  breadcrumb: { margin: 0, fontSize: 12, color: "#8f7a63", textTransform: "uppercase", letterSpacing: ".12em" },
  title: { margin: "8px 0 8px", fontSize: 32, fontWeight: 800, color: "#1a1714" },
  subtitle: { margin: 0, fontSize: 14, color: "#5f5246", maxWidth: 620 },
  logoutBtn: { display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#dc2626", cursor: "pointer", fontFamily: "inherit", transition: "all .15s" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  card: { background: "#fff", borderRadius: 20, border: "1px solid #e7ddd1", padding: 24, boxShadow: "0 10px 35px rgba(0,0,0,0.03)" },
  sectionTitle: { fontSize: 18, marginBottom: 16, color: "#3f352e" },
  label: { display: "block", marginBottom: 8, fontSize: 12, textTransform: "uppercase", color: "#8f7a63", letterSpacing: ".08em" },
  input: { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #d6c9b7", marginBottom: 18, fontSize: 14, color: "#3f352e", fontFamily: "inherit" },
  passwordContainer: { position: "relative", marginBottom: 18 },
  toggleButton: { position: "absolute", right: 12, top: 12, background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "4px 8px", color: "#8f7a63", transition: "color 0.2s" },
  actionButton: { width: "100%", marginTop: 4, background: "#c8651a", border: "none", color: "#fff", borderRadius: 14, padding: "14px 16px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" },
  loading: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6e5f52" },
  btnEdit: { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 22px", background: "#fff", border: "1.5px solid #f0e8df", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#f97316", cursor: "pointer", fontFamily: "inherit", transition: "background .15s" },
  savedToast: { marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#15803d" },
  statsCol: { display: "flex", flexDirection: "column", gap: 14 },
  statCard: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 14, padding: "18px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  statIconBox: { width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 28, fontWeight: 700, color: "#1f2937", lineHeight: 1 },
  statLabel: { fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  card: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 14, overflow: "hidden" },
  cardHeader: { padding: "14px 20px", borderBottom: "1px solid #f9f0e8", display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".07em", margin: 0 },
  cardBadge: { fontSize: 11, fontWeight: 600, color: "#10b981", background: "#dcfce7", border: "1px solid #86efac", padding: "2px 10px", borderRadius: 999 },
  infoRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #fdf3ea" },
  infoIconWrap: { width: 32, height: 32, borderRadius: 8, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  infoLabel: { fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: 500, color: "#1f2937" },
  activityRow: { display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid #fdf3ea" },
  activityDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  activityText: { flex: 1, fontSize: 13, color: "#374151" },
  activityTime: { fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" },
};
