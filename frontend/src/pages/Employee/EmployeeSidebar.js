import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Accueil",
    path: "/employer/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Commandes",
    path: "/employer/orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "inventory",
    label: "Stock",
    path: "/employer/inventory",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: "clients",
    label: "Clients",
    path: "/employer/clients",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profil",
    path: "/employer/profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function EmployeeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 900 : false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        style={S.logoArea}
        onClick={() => { navigate('/'); closeMenu(); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') { navigate('/'); closeMenu(); } }}
      >
        <div style={S.logoIconWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </div>
        <span style={S.logoText}>Star Mousse</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav" style={S.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => { navigate(item.path); closeMenu(); }}
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
        onClick={() => { handleLogout(); closeMenu(); }}
        style={S.logoutBtn}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>Déconnexion</span>
      </button>
    </>
  );

  return (
    <>
      {!isMobile && <aside className="employee-sidebar" style={S.sidebar}>{sidebarContent}</aside>}
      {isMobile && (
        <div className="employee-mobile-bar" style={S.mobileTopBar}>
          <button style={S.hamburgerBtn} onClick={openMenu} aria-label="Ouvrir le menu">
            <span style={S.hamburgerLine} />
            <span style={S.hamburgerLine} />
            <span style={S.hamburgerLine} />
          </button>
          <div style={S.mobileBrand}>Star Mousse</div>
          <div style={{ width: 32 }} />
          {menuOpen && (
            <div style={S.mobileOverlay} onClick={closeMenu}>
              <div style={S.mobileMenu} onClick={(e) => e.stopPropagation()}>
                <div style={S.mobileMenuHeader}>
                  <span style={S.mobileBrand}>Menu</span>
                  <button style={S.closeBtn} onClick={closeMenu} aria-label="Fermer le menu">✕</button>
                </div>
                {sidebarContent}
              </div>
            </div>
          )}
        </div>
      )}
    </>
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
    zIndex: 100,
  },
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
  mobileTopBar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 2600,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 16px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.08)",
    boxSizing: "border-box",
  },
  hamburgerBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fff",
    cursor: "pointer",
    padding: 0,
  },
  hamburgerLine: {
    width: 18,
    height: 2,
    background: "#1f2937",
    borderRadius: 999,
    margin: "3px 0",
  },
  mobileBrand: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1f2937",
  },
  mobileOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
    zIndex: 2700,
    display: "flex",
    justifyContent: "flex-end",
  },
  mobileMenu: {
    width: "280px",
    maxWidth: "100%",
    height: "100%",
    background: "#ffffff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    overflowY: "auto",
  },
  mobileMenuHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: 20,
    cursor: "pointer",
    color: "#1f2937",
  },
};
