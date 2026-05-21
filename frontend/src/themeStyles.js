// src/themeStyles.js

export const Theme = {
  colors: {
    bgMain: "#fdf6ef",       // Fond crème/sable signature Star Mousse
    cardBg: "#ffffff",       // Blanc pur pour les cartes
    border: "#f0e8df",       // Bordures douces
    borderLight: "#fdf3ea",  // Séparateurs légers
    textDark: "#1f2937",     // Texte principal
    textMuted: "#9ca3af",    // Texte secondaire
    
    // Codes couleurs par espace
    admin: "#f97316",        // Orange Admin
    employe: "#3b82f6",      // Bleu Employé / Logistique
    client: "#10b981",       // Vert Confort / Client
  }
};

export const CommonStyles = {
  // Styles de Tableaux Communs (Admin & Employé)
  cardTable: { background: Theme.colors.cardBg, border: `1px solid ${Theme.colors.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" },
  tableHeader: { padding: "18px 20px", borderBottom: `1px solid ${Theme.colors.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  tableTitle: { fontSize: 16, fontWeight: 700, color: Theme.colors.textDark, margin: 0 },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "14px 20px", background: "#fefbfa", fontSize: 11, fontWeight: 600, color: Theme.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${Theme.colors.border}` },
  td: { padding: "16px 20px", fontSize: 13, color: Theme.colors.textDark, borderBottom: `1px solid ${Theme.colors.borderLight}`, verticalAlign: "middle" },
  
  // Badges de statut
  badge: (type) => {
    const config = {
      LIVRE: { bg: "#dcfce7", color: "#16a34a" },
      EN_COURS: { bg: "#eff6ff", color: "#2563eb" },
      ATTENTE: { bg: "#fef3c7", color: "#d97706" },
      URGENT: { bg: "#fee2e2", color: "#dc2626" }
    };
    const style = config[type] || { bg: "#f3f4f6", color: "#374151" };
    return { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, ...style, display: "inline-block" };
  }
};

export const AdminStyles = {
  root: { display: "flex", minHeight: "100vh", background: Theme.colors.bgMain, fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main: { marginLeft: 240, flex: 1, padding: "32px" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 800, color: Theme.colors.textDark, margin: 0, letterSpacing: "-0.02em" },
  
  // Grid de statistiques
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 },
  statCard: { background: Theme.colors.cardBg, border: `1px solid ${Theme.colors.border}`, borderRadius: 16, padding: "24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" },
  iconBox: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff7ed", color: Theme.colors.admin },
  statValue: { fontSize: 26, fontWeight: 700, color: Theme.colors.textDark, margin: "0 0 4px 0" },
  statLabel: { fontSize: 12, color: Theme.colors.textMuted, margin: 0, fontWeight: 500 },
  
  // Boutons
  btnPrimary: { background: Theme.colors.admin, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "opacity 0.2s" },
  btnActionDelete: { background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }
};

export const EmployeeStyles = {
  root: { display: "flex", minHeight: "100vh", background: Theme.colors.bgMain, fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main: { flex: 1, padding: "32px", maxWidth: 1400, margin: "0 auto" },
  
  // Tableau de bord logistique style Kanban / Sprints
  kanbanGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 24 },
  column: { background: "#f4ebe1", borderRadius: 16, padding: "20px", minHeight: "500px", border: "1px solid #ebdcd0" },
  columnHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  columnTitle: { fontSize: 15, fontWeight: 700, color: Theme.colors.textDark, margin: 0 },
  columnCount: { background: "#fff", padding: "2px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: Theme.colors.textMuted },
  
  // Cartes de commandes à traiter
  taskCard: { background: Theme.colors.cardBg, border: `1px solid ${Theme.colors.border}`, borderRadius: 12, padding: "18px", marginBottom: 14, boxShadow: "0 2px 4px rgba(0,0,0,0.01)" },
  taskHeader: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  taskClient: { fontSize: 14, fontWeight: 700, color: Theme.colors.textDark, margin: 0 },
  taskDetails: { fontSize: 13, color: Theme.colors.textMuted, margin: "0 0 14px 0" }
};

export const ClientStyles = {
  root: { minHeight: "100vh", background: Theme.colors.bgMain, fontFamily: "'Segoe UI', system-ui, sans-serif" },
  navbar: { height: 72, background: Theme.colors.cardBg, borderBottom: `1px solid ${Theme.colors.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", sticky: "top" },
  brand: { fontSize: 20, fontWeight: 800, color: Theme.colors.admin, letterSpacing: "-0.03em" },
  
  // Grille catalogue de matelas
  container: { maxWidth: 1200, margin: "0 auto", padding: "42px 20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 },
  productCard: { background: Theme.colors.cardBg, border: `1px solid ${Theme.colors.border}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" },
  imgPlaceholder: { height: 210, background: "#fbf8f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", position: "relative" },
  
  // Badges aromathérapie (Lavande, Menthe, etc.)
  scentBadge: (scent) => {
    const colors = { Lavande: "#8b5cf6", Menthe: "#10b981", Ocean: "#06b6d4" };
    return { position: "absolute", top: 14, right: 14, background: colors[scent] || "#f97316", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700 };
  },
  
  infoBody: { padding: "22px" },
  prodTitle: { fontSize: 17, fontWeight: 700, margin: "0 0 6px 0", color: Theme.colors.textDark },
  prodDesc: { fontSize: 12, color: Theme.colors.textMuted, margin: "0 0 16px 0", lineHeight: "1.4" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 19, fontWeight: 800, color: Theme.colors.client },
  btnOrder: { background: Theme.colors.client, color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }
};