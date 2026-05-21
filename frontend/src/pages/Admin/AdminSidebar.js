import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Accueil",
    path: "/admin-dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Commandes",
    path: "/admin/orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  
  {
    id: "clients",
    label: "Clients",
    path: "/manage-clients",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    id: "managers",
    label: "Gestionnaires",
    path: "/manage-managers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/>
        <circle cx="18" cy="18" r="3"/><path d="M18 16v2l1 1"/>
      </svg>
    ),
  },
  {
    id: "Profile",
    label: "Profil",
    path: "/profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
  },
  
  
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside style={S.sidebar}>
      {/* Logo */}
      <div
        style={S.logoArea}
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') navigate('/'); }}
      >
        <div style={S.logoIconWrap}>
          {/* Layered lines icon like the screenshot */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </div>
        <span style={S.logoText}>Star Mousse</span>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                ...S.navItem,
                ...(isActive ? S.navItemActive : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#fff7ed";
                  e.currentTarget.style.color = "#f97316";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={S.logoutBtn}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#f97316";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#f97316";
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>Déconnexion</span>
      </button>
    </aside>
  );
}

const S = {
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    borderRight: "1px solid #f0e8df",
    padding: "20px 0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },

  /* Logo */
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 20px 20px",
    cursor: 'pointer',
  },
  logoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "linear-gradient(135deg, #f97316, #ea580c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1f2937",
    letterSpacing: "-0.02em",
  },

  /* Nav */
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "0 0",
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    width: "100%",
    padding: "10px 20px",
    background: "transparent",
    border: "none",
    borderRadius: 0,
    textAlign: "left",
    fontSize: 14,
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background .15s, color .15s",
  },
  navItemActive: {
    background: "#f97316",
    color: "#ffffff",
    margin: "0 10px",
    width: "calc(100% - 20px)",
    borderRadius: 10,
    padding: "10px 10px",
  },

  /* Logout */
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#f97316",
    fontFamily: "inherit",
    marginTop: 8,
    width: "100%",
  },
};