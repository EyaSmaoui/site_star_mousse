import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
// Imports alignés avec ton fichier services/apiUser.js
import { getAllUsers, updateProfile } from "../../services/apiUser"; 

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
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // États locaux pour gérer la session et le chargement
  const [userData, setUserData] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect : Récupération des données utilisateur
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        
        if (localUser) {
          setUserData(localUser);
          setNameInput(localUser.username || "Admin Star Mousse");
        } else {
          const data = await getAllUsers();
          if (data && data.length > 0) {
            setUserData(data[0]);
            setNameInput(data[0].username);
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
      // On envoie UNIQUEMENT le champ attendu et léger
      const payload = { username: nameInput };

      // Requête HTTP PUT via ton service apiUser
      await updateProfile(payload);
      
      // Mise à jour locale après succès de la requête
      const updatedUser = { ...userData, username: nameInput };
      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la sauvegarde.");
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

      <main style={S.main}>

        {/* ── Topbar ── */}
        <div style={S.topbar}>
          <div>
            <p style={S.topbarSub}>Star Mousse · Administration</p>
            <h1 style={S.topbarTitle}>Mon Profil</h1>
          </div>
          <button onClick={handleLogout} style={S.logoutBtn}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fecaca"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}>
            <Icon d={icons.logout} size={15} color="#dc2626" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* ── Hero + Stats row ── */}
        <div style={S.heroRow}>

          {/* Hero Card */}
          <div style={S.heroCard}>
            <div style={S.heroAccent} />

            <div style={S.heroBody}>
              {/* Avatar dynamique */}
              <div style={S.avatarWrap}>
                <div style={S.avatar}>
                  {userData?.username ? userData.username.charAt(0).toUpperCase() : "A"}
                </div>
                <div style={S.avatarOnline} />
                <button style={S.avatarCam}
                  onMouseEnter={e => e.currentTarget.style.background = "#ea580c"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f97316"}>
                  <Icon d={icons.camera} size={12} color="#fff" />
                </button>
              </div>

              {/* Nom Dynamique / Input d'édition */}
              {editing ? (
                <div style={S.editRow}>
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSave()}
                    style={S.nameInput}
                  />
                  <button onClick={handleSave} style={S.saveBtn}>
                    <Icon d={icons.check} size={14} color="#fff" /> Sauvegarder
                  </button>
                </div>
              ) : (
                <h2 style={S.heroName}>{userData?.username || "Admin Star Mousse"}</h2>
              )}

              {/* Badges */}
              <div style={S.badgeRow}>
                <span style={S.badgeAdmin}>
                  <Icon d={icons.shield} size={11} color="#f97316" /> {userData?.role || "Administrateur"}
                </span>
                <span style={S.badgeOnline}>
                  <span style={S.onlineDot} /> En ligne
                </span>
              </div>

              {!editing && (
                <button onClick={() => setEditing(true)} style={S.btnEdit}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff7ed"}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                  <Icon d={icons.edit} size={13} color="#f97316" /> Modifier le profil
                </button>
              )}

              {saved && (
                <div style={S.savedToast}>
                  <Icon d={icons.check} size={13} color="#10b981" /> Profil mis à jour
                </div>
              )}
            </div>
          </div>

          {/* Stats column */}
          <div style={S.statsCol}>
            <StatCard
              icon={<Icon d={icons.package} size={20} color="#fff" />}
              value="6" label="Matelas"
              iconBg="#3b82f6"
            />
            <StatCard
              icon={<Icon d={icons.users} size={20} color="#fff" />}
              value="4" label="Clients"
              iconBg="#10b981"
            />
            <StatCard
              icon={<Icon d={icons.activity} size={20} color="#fff" />}
              value="14" label="Commandes"
              iconBg="#f97316"
            />
          </div>
        </div>

        {/* ── Bottom Grid ── */}
        <div style={S.bottomGrid}>

          {/* Informations Dynamiques */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h2 style={S.cardTitle}>Informations</h2>
              <span style={S.cardBadge}>Profil complet</span>
            </div>
            <div style={{ padding: "4px 20px 16px" }}>
              <InfoRow icon={<Icon d={icons.user}   size={14} color="#f97316" />} label="Rôle"           value={userData?.role || "Gestionnaire"} />
              <InfoRow icon={<Icon d={icons.mail}   size={14} color="#f97316" />} label="Email"          value={userData?.email || "contact@starmousse.tn"} accent />
              <InfoRow icon={<Icon d={icons.pin}    size={14} color="#f97316" />} label="Localisation"   value="Showroom Tunis, Tunisie" />
              <InfoRow icon={<Icon d={icons.shield} size={14} color="#f97316" />} label="Niveau d'accès" value="Accès total" accent />
            </div>
          </div>

          {/* Activité récente */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h2 style={S.cardTitle}>Activité récente</h2>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>5 événements</span>
            </div>
            <div style={{ padding: "4px 20px 16px" }}>
              <ActivityRow action="Commande #7841 confirmée"     time="Il y a 2h"  type="success" />
              <ActivityRow action="Stock Néo Mémoire mis à jour" time="Il y a 5h"  type="warning" />
              <ActivityRow action="Nouveau client enregistré"    time="Hier"       type="info"    />
              <ActivityRow action="Promotion Ergo Luxe activée"  time="Hier"       type="warning" />
              <ActivityRow action="Rapport mensuel exporté"      time="30/04"      type="success" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  root: { display: "flex", minHeight: "100vh", background: "#fdf6ef", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1f2937" },
  main: { marginLeft: 220, flex: 1, padding: "28px 32px" },
  topbar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 },
  topbarSub: { fontSize: 13, color: "#9ca3af", margin: "0 0 4px" },
  topbarTitle: { fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 },
  logoutBtn: { display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#dc2626", cursor: "pointer", fontFamily: "inherit", transition: "all .15s" },
  heroRow: { display: "grid", gridTemplateColumns: "1fr 220px", gap: 20, marginBottom: 20, alignItems: "start" },
  heroCard: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 16, overflow: "hidden" },
  heroAccent: { height: 6, background: "linear-gradient(90deg, #f97316, #fb923c, #fdba74)", borderRadius: "16px 16px 0 0" },
  heroBody: { padding: "28px 32px 28px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  avatarWrap: { position: "relative", marginBottom: 18 },
  avatar: { width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#fff", boxShadow: "0 0 0 4px #fff, 0 0 0 6px #f0e8df" },
  avatarOnline: { position: "absolute", bottom: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "#10b981", border: "2.5px solid #fff" },
  avatarCam: { position: "absolute", bottom: 0, right: -4, width: 26, height: 26, borderRadius: "50%", background: "#f97316", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background .15s" },
  heroName: { fontSize: 22, fontWeight: 700, margin: "0 0 12px", color: "#1f2937", letterSpacing: "-0.02em" },
  editRow: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 340, marginBottom: 12 },
  nameInput: { width: "100%", padding: "8px 16px", border: "1.5px solid #f97316", borderRadius: 10, fontSize: 18, fontWeight: 700, textAlign: "center", outline: "none", color: "#1f2937", fontFamily: "inherit", background: "#fff7ed" },
  saveBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", background: "#f97316", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  badgeRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 },
  badgeAdmin: { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#c2410c" },
  badgeOnline: { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#16a34a" },
  onlineDot: { width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block" },
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