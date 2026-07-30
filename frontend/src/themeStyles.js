// src/themeStyles.js

export const Theme = {
  colors: {
    bgMain: "#fffdf8",
    cardBg: "#ffffff",
    border: "#e4ddd0",
    borderLight: "#f1eadf",
    textDark: "#12231f",
    textMuted: "#64706c",

    admin: "#e86f45",
    employe: "#1c6b55",
    client: "#2f8f71",
  }
};

export const CommonStyles = {
  cardTable: { background: Theme.colors.cardBg, border: `1px solid ${Theme.colors.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 14px 34px rgba(18,35,31,0.08)" },
  tableHeader: { padding: "18px 20px", borderBottom: `1px solid ${Theme.colors.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  tableTitle: { fontSize: 16, fontWeight: 800, color: Theme.colors.textDark, margin: 0 },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "14px 20px", background: "#fff8ef", fontSize: 11, fontWeight: 700, color: Theme.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${Theme.colors.border}` },
  td: { padding: "16px 20px", fontSize: 13, color: Theme.colors.textDark, borderBottom: `1px solid ${Theme.colors.borderLight}`, verticalAlign: "middle" },

  badge: (type) => {
    const config = {
      LIVRE: { bg: "#dcfce7", color: "#16724d" },
      EN_COURS: { bg: "#e8f3ef", color: "#1c6b55" },
      ATTENTE: { bg: "#fff3d7", color: "#a96519" },
      URGENT: { bg: "#fee2e2", color: "#c73624" }
    };
    const style = config[type] || { bg: "#f3f4f6", color: "#374151" };
    return { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, ...style, display: "inline-block" };
  }
};

export const AdminStyles = {
  root: { display: "flex", minHeight: "100vh", background: Theme.colors.bgMain, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  main: { marginLeft: 240, flex: 1, padding: "32px" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 800, color: Theme.colors.textDark, margin: 0, letterSpacing: "0" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 },
  statCard: { background: Theme.colors.cardBg, border: `1px solid ${Theme.colors.border}`, borderRadius: 12, padding: "24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 14px 34px rgba(18,35,31,0.08)" },
  iconBox: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff0e9", color: Theme.colors.admin },
  statValue: { fontSize: 26, fontWeight: 800, color: Theme.colors.textDark, margin: "0 0 4px 0" },
  statLabel: { fontSize: 12, color: Theme.colors.textMuted, margin: 0, fontWeight: 600 },

  btnPrimary: { background: Theme.colors.admin, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "opacity 0.2s" },
  btnActionDelete: { background: "#fee2e2", color: "#c73624", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }
};

export const EmployeeStyles = {
  root: { display: "flex", minHeight: "100vh", background: Theme.colors.bgMain, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  main: { flex: 1, padding: "32px", maxWidth: 1400, margin: "0 auto" },

  kanbanGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 24 },
  column: { background: "#f4efe6", borderRadius: 12, padding: "20px", minHeight: "500px", border: "1px solid #e4ddd0" },
  columnHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  columnTitle: { fontSize: 15, fontWeight: 800, color: Theme.colors.textDark, margin: 0 },
  columnCount: { background: "#fff", padding: "2px 8px", borderRadius: 999, fontSize: 12, fontWeight: 800, color: Theme.colors.textMuted },

  taskCard: { background: Theme.colors.cardBg, border: `1px solid ${Theme.colors.border}`, borderRadius: 12, padding: "18px", marginBottom: 14, boxShadow: "0 10px 24px rgba(18,35,31,0.06)" },
  taskHeader: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  taskClient: { fontSize: 14, fontWeight: 800, color: Theme.colors.textDark, margin: 0 },
  taskDetails: { fontSize: 13, color: Theme.colors.textMuted, margin: "0 0 14px 0" }
};

export const ClientStyles = {
  root: { minHeight: "100vh", background: Theme.colors.bgMain, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  navbar: { height: 72, background: Theme.colors.cardBg, borderBottom: `1px solid ${Theme.colors.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", sticky: "top" },
  brand: { fontSize: 20, fontWeight: 800, color: Theme.colors.client, letterSpacing: "0" },

  container: { maxWidth: 1200, margin: "0 auto", padding: "42px 20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 },
  productCard: { background: Theme.colors.cardBg, border: `1px solid ${Theme.colors.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 14px 34px rgba(18,35,31,0.08)" },
  imgPlaceholder: { height: 210, background: "#f7f1e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", position: "relative" },

  scentBadge: (scent) => {
    const colors = { Lavande: "#7760a8", Menthe: "#2f8f71", Ocean: "#16778d" };
    return { position: "absolute", top: 14, right: 14, background: colors[scent] || "#e86f45", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800 };
  },

  infoBody: { padding: "22px" },
  prodTitle: { fontSize: 17, fontWeight: 800, margin: "0 0 6px 0", color: Theme.colors.textDark },
  prodDesc: { fontSize: 12, color: Theme.colors.textMuted, margin: "0 0 16px 0", lineHeight: "1.4" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 19, fontWeight: 900, color: Theme.colors.client },
  btnOrder: { background: Theme.colors.client, color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }
};
