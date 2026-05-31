import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import EmployeeSidebar from "./EmployeeSidebar";
import { addOrder, deleteOrder as removeOrder, getAllOrders, getCachedOrders, updateOrder } from "../../services/apiOrder";

// ─── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  "en attente": { label: "En attente", color: "#b45309", bg: "#fef3c7", border: "#fcd34d" },
  "en cours":   { label: "En cours",   color: "#6d28d9", bg: "#ede9fe", border: "#c4b5fd" },
  "expédié":    { label: "Expédié",    color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" },
  "livré":      { label: "Livré",      color: "#15803d", bg: "#dcfce7", border: "#86efac" },
  "annulé":     { label: "Annulé",     color: "#b91c1c", bg: "#fee2e2", border: "#fca5a5" },
};
const DEFAULT_STATUS = { label: "Inconnu", color: "#374151", bg: "#f3f4f6", border: "#d1d5db" };
const STATUS_KEYS    = Object.keys(STATUS_CONFIG);
const STATUS_FILTERS = ["Tous", ...STATUS_KEYS];

const DIMENSIONS   = ["80×190", "90×190", "120×190", "140×190", "160×190"];
const EMPTY_PRODUCT = { name: "", quantity: 1, dimension: DIMENSIONS[0] };
const EMPTY_FORM = {
  customerName:  "",
  customerEmail: "",
  phone:         "",
  address:       "",
  total:         "",
  status:        "en attente",
  products:      [{ ...EMPTY_PRODUCT }],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtId   = (id)   => (id ? id.slice(-6).toUpperCase() : "TEMP");
const fmtDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// ─── SVG Icon ──────────────────────────────────────────────────────────────────

const Ico = ({ d, size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICO = {
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  plus:     ["M12 5v14", "M5 12h14"],
  edit:     ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash:    ["M3 6h18", "M19 6l-1 14H6L5 6", "M9 6V4h6v2"],
  x:        ["M18 6L6 18", "M6 6l12 12"],
  warn:     ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
  check:    "M20 6L9 17l-5-5",
  refresh:  "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 12m-3 0a3 3 0 106 0 3 3 0 00-6 0"],
  flag:     "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  pkg:      ["M16.5 9.4l-9-5.19", "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z", "M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"],
  user:     ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
  tag:      ["M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z", "M7 7h.01"],
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const S = {
  root:       { display: "flex", minHeight: "100vh", background: "#fdf6ef", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1f2937" },
  main:       { marginLeft: 220, flex: 1, padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 },

  topbar:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  topbarSub:  { fontSize: 13, color: "#9ca3af", margin: "0 0 4px" },
  topbarTitle:{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 },

  btnAdd: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "10px 20px", background: "#f97316", color: "#fff",
    border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", transition: "background .15s",
  },

  kpiStrip: {
    display: "flex", alignItems: "center",
    background: "#fff", border: "1px solid #f0e8df",
    borderRadius: 12, overflow: "hidden",
  },
  kpiItem:    { display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", flex: 1 },
  kpiDivider: { width: 1, height: 40, background: "#f0e8df", flexShrink: 0 },
  kpiIcon: {
    width: 46, height: 46, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  kpiVal: { fontSize: 24, fontWeight: 700, color: "#1f2937", lineHeight: 1 },
  kpiLbl: { fontSize: 12, color: "#9ca3af", marginTop: 4, fontWeight: 500 },

  controls:   { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 10, padding: "9px 14px", flex: 1, minWidth: 220,
  },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1f2937", flex: 1, fontFamily: "inherit" },

  pill: (active) => ({
    padding: "6px 14px", borderRadius: 999,
    border: `1px solid ${active ? "#f97316" : "#e5e7eb"}`,
    background: active ? "#f97316" : "#fff",
    color: active ? "#fff" : "#6b7280",
    fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
  }),

  refreshBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 14px", background: "#fff", color: "#6b7280",
    border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 13,
    cursor: "pointer", fontFamily: "inherit",
  },

  card:       { background: "#fff", border: "1px solid #f0e8df", borderRadius: 14, overflow: "hidden" },
  cardHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px", borderBottom: "1px solid #f9f0e8",
  },
  cardTitle:  { fontSize: 13, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 2px" },
  cardSub:    { fontSize: 12, color: "#9ca3af", margin: 0 },

  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { padding: "10px 16px", fontSize: 11, color: "#9ca3af", fontWeight: 700, textAlign: "left", textTransform: "uppercase", letterSpacing: ".06em", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", whiteSpace: "nowrap" },
  tr:         { borderBottom: "1px solid #fdf3ea", transition: "background .12s" },
  td:         { padding: "11px 16px", verticalAlign: "middle" },

  tdId:       { fontSize: 11, color: "#9ca3af", fontFamily: "monospace" },
  tdName:     { fontSize: 13, fontWeight: 700, color: "#1f2937" },
  tdSub:      { fontSize: 11, color: "#9ca3af", marginTop: 2 },

  badge: (cfg) => ({
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "4px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600,
    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    whiteSpace: "nowrap",
  }),
  dot: (color) => ({ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }),

  prodTag: {
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "#fff7ed", border: "1px solid #fed7aa",
    borderRadius: 6, padding: "2px 7px", fontSize: 11, margin: "2px 2px 2px 0",
  },
  prodName: { fontWeight: 600, color: "#92400e" },
  prodDim:  { color: "#b45309", fontSize: 10 },
  prodQty:  { background: "#f97316", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 999 },

  btnView:   { padding: "5px 11px", background: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa", borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnEdit:   { padding: "5px 11px", background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnState:  { padding: "5px 11px", background: "#ede9fe", color: "#5b21b6", border: "1px solid #c4b5fd", borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnDel:    { padding: "5px 11px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },

  empty: { padding: "52px", textAlign: "center", color: "#9ca3af", fontSize: 14 },

  // Modal
  backdrop:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalCard:   { background: "#fff", borderRadius: 16, border: "1px solid #f0e8df", width: "100%", maxWidth: 520, boxShadow: "0 24px 60px rgba(0,0,0,0.14)", maxHeight: "92vh", overflowY: "auto" },
  modalCardSm: { background: "#fff", borderRadius: 16, border: "1px solid #f0e8df", width: "100%", maxWidth: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.14)" },
  modalAccent: (color = "#f97316") => ({ height: 5, background: color, borderRadius: "14px 14px 0 0" }),
  modalHeader: { display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", borderBottom: "1px solid #f9f0e8", position: "sticky", top: 0, background: "#fff", zIndex: 2 },
  modalIconBox:{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  modalTitle:  { fontSize: 15, fontWeight: 700, color: "#1f2937" },
  modalSub:    { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  modalClose:  { marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" },
  modalBody:   { padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 },
  modalFooter: { padding: "16px 22px", borderTop: "1px solid #f9f0e8", display: "flex", justifyContent: "flex-end", gap: 10, position: "sticky", bottom: 0, background: "#fff", zIndex: 2 },

  sectionWrap:  { border: "1px solid #f0e8df", borderRadius: 12, overflow: "hidden", marginBottom: 2 },
  sectionHead:  { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fdf6ef", borderBottom: "1px solid #f0e8df" },
  sectionIcon:  { width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sectionTitle: { fontSize: 12.5, fontWeight: 700, color: "#1f2937" },
  sectionBody:  { padding: "14px 16px", background: "#fff", display: "flex", flexDirection: "column", gap: 10 },

  formGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  fieldLabel: { fontSize: 11, fontWeight: 700, color: "#374151", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".05em" },
  fieldInput: {
    width: "100%", padding: "9px 12px",
    border: "1px solid #e5e7eb", borderRadius: 9,
    fontSize: 13, color: "#1f2937", background: "#fff",
    outline: "none", fontFamily: "inherit",
  },
  fieldInputErr: {
    width: "100%", padding: "9px 12px",
    border: "1px solid #ef4444", borderRadius: 9,
    fontSize: 13, color: "#1f2937", background: "#fff",
    outline: "none", fontFamily: "inherit",
    boxShadow: "0 0 0 3px rgba(239,68,68,.08)",
  },

  prodRow:    { display: "grid", gridTemplateColumns: "1fr 60px 110px 32px", gap: 6, alignItems: "center", background: "#fdf6ef", border: "1px solid #f0e8df", borderRadius: 8, padding: "8px 10px", marginBottom: 6 },
  btnRm:      { width: 32, height: 32, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7, color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  btnAddProd: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
    width: "100%", padding: 7,
    border: "1.5px dashed #fed7aa", borderRadius: 8,
    background: "transparent", color: "#f97316",
    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
  totalBox: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 14px", background: "#fff7ed",
    borderRadius: 9, border: "1px solid #fed7aa", marginTop: 4,
  },

  statusGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 },
  statusBtn: (active, s) => ({
    padding: "10px 4px", borderRadius: 10, textAlign: "center", cursor: "pointer",
    fontFamily: "inherit", fontSize: 11, fontWeight: active ? 600 : 400,
    border: `1.5px solid ${active ? s.border : "#e5e7eb"}`,
    background: active ? s.bg : "#fafafa",
    color: active ? s.color : "#9ca3af",
  }),

  amountBanner: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "#1f2937", borderRadius: 12, padding: "14px 18px", marginBottom: 12,
  },

  stateItem: (active, s) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px",
    border: `1px solid ${active ? s.border : "#e5e7eb"}`,
    borderRadius: 9,
    background: active ? s.bg : "#fafafa",
    cursor: "pointer", fontFamily: "inherit",
    marginBottom: 5, transition: "all .15s",
  }),

  btnCancel:  { padding: "9px 20px", background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnPrimary: { display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", background: "#f97316", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnDanger:  { padding: "9px 20px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnViolet:  { padding: "9px 20px", background: "#6d28d9", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSaveDisabled: { opacity: .55, cursor: "not-allowed" },

  warnBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#fef2f2", border: "1px solid #fecaca",
    borderRadius: 8, padding: "10px 12px",
    fontSize: 12, color: "#b91c1c", marginTop: 12,
  },
  delIcon: {
    width: 56, height: 56, borderRadius: 14,
    background: "#fef2f2", border: "1.5px solid #fca5a5",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 14px",
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || DEFAULT_STATUS;
  return (
    <span style={S.badge(cfg)}>
      <span style={S.dot(cfg.color)} />
      {cfg.label}
    </span>
  );
}

function ProductTags({ products }) {
  if (!products?.length) return <span style={{ color: "#9ca3af", fontSize: 12 }}>—</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((p, i) => (
        <span key={i} style={S.prodTag}>
          <span style={S.prodName}>{p.name || "Produit"}</span>
          {p.dimension && <span style={S.prodDim}>{p.dimension}</span>}
          <span style={S.prodQty}>×{p.quantity || 1}</span>
        </span>
      ))}
    </div>
  );
}

function Section({ icon, iconBg, iconColor, title, children }) {
  return (
    <div style={S.sectionWrap}>
      <div style={S.sectionHead}>
        <div style={{ ...S.sectionIcon, background: iconBg }}>
          <Ico d={icon} size={15} color={iconColor} />
        </div>
        <span style={S.sectionTitle}>{title}</span>
      </div>
      <div style={S.sectionBody}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", error }) {
  return (
    <div>
      <label style={S.fieldLabel}>{label}</label>
      <input
        type={type}
        style={error ? S.fieldInputErr : S.fieldInput}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={e => { e.target.style.borderColor = "#f97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.12)"; }}
        onBlur={e  => { e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb"; e.target.style.boxShadow = "none"; }}
      />
      {error && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>{error}</div>}
    </div>
  );
}

// ─── STATUS_VISUAL ─────────────────────────────────────────────────────────────

const STATUS_VISUAL = [
  { key: "en attente", label: "En attente", color: "#b45309", bg: "#fef3c7", border: "#fcd34d" },
  { key: "en cours",   label: "En cours",   color: "#6d28d9", bg: "#ede9fe", border: "#c4b5fd" },
  { key: "expédié",    label: "Expédié",    color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" },
  { key: "livré",      label: "Livré",      color: "#15803d", bg: "#dcfce7", border: "#86efac" },
  { key: "annulé",     label: "Annulé",     color: "#b91c1c", bg: "#fee2e2", border: "#fca5a5" },
];

// ─── ViewModal ─────────────────────────────────────────────────────────────────

function ViewModal({ order, onClose }) {
  if (!order) return null;
  const cfg = STATUS_CONFIG[order.status] || DEFAULT_STATUS;
  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modalCard} onClick={e => e.stopPropagation()}>
        <div style={S.modalAccent()} />
        <div style={S.modalHeader}>
          <div style={{ ...S.modalIconBox, background: "#fff7ed" }}>
            <Ico d={ICO.eye} size={17} color="#f97316" />
          </div>
          <div>
            <div style={S.modalTitle}>Commande #{fmtId(order._id)}</div>
            <div style={S.modalSub}>Détails complets</div>
          </div>
          <button style={S.modalClose} onClick={onClose}>
            <Ico d={ICO.x} size={16} color="#9ca3af" />
          </button>
        </div>
        <div style={S.modalBody}>
          <Section icon={ICO.user} iconBg="#fff7ed" iconColor="#f97316" title="Informations client">
            <div style={S.formGrid}>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af", fontWeight: 700, marginBottom: 3 }}>Nom / Prénom</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>{order.customerName || "—"}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{order.customerEmail || "—"}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af", fontWeight: 700, marginBottom: 3 }}>Téléphone</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>{order.phone || "—"}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{order.address || "Adresse non précisée"}</div>
              </div>
            </div>
          </Section>

          <Section icon={ICO.pkg} iconBg="#fff7ed" iconColor="#f97316" title="Produits commandés">
            {!order.products?.length ? (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>Aucun produit enregistré.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Produit", "Qté", "Dimension"].map(h => (
                      <th key={h} style={{ textAlign: "left", fontSize: 10, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af", fontWeight: 700, padding: "6px 0", borderBottom: "1px solid #f0e8df" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((p, i) => (
                    <tr key={i}>
                      <td style={{ padding: "8px 0", fontSize: 13, fontWeight: 700, color: "#1f2937", borderBottom: "1px solid #fdf6ef" }}>{p.name || "Produit"}</td>
                      <td style={{ padding: "8px 0", borderBottom: "1px solid #fdf6ef" }}>
                        <span style={{ ...S.prodQty, padding: "2px 8px", borderRadius: 6, fontSize: 11 }}>×{p.quantity || 1}</span>
                      </td>
                      <td style={{ padding: "8px 0", borderBottom: "1px solid #fdf6ef" }}>
                        <span style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 5, padding: "2px 7px", fontSize: 11, color: "#374151" }}>{p.dimension || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          <div style={S.amountBanner}>
            <div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.6)", fontWeight: 600, marginBottom: 4 }}>Montant total</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.04em" }}>
                {(order.total || 0).toLocaleString("fr-TN")} DT
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.6)", fontWeight: 600, marginBottom: 4 }}>Date de commande</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{fmtDate(order.createdAt)}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: cfg.bg, borderRadius: 10, border: `1px solid ${cfg.border}` }}>
            <div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".07em", color: cfg.color, fontWeight: 700, opacity: 0.7, marginBottom: 4 }}>État actuel</div>
              <StatusBadge status={order.status} />
            </div>
            <span style={{ fontSize: 28 }}>
              {order.status === "livré" ? "✅" : order.status === "annulé" ? "❌" : order.status === "expédié" ? "🚚" : order.status === "en cours" ? "⚙️" : "⏳"}
            </span>
          </div>
        </div>
        <div style={S.modalFooter}>
          <button style={S.btnCancel} onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

// ─── AddEditModal ──────────────────────────────────────────────────────────────

function AddEditModal({ order, onClose, onSave }) {
  const isEdit = Boolean(order);
  const [form, setForm] = useState(
    isEdit
      ? {
          customerName:  order.customerName  || "",
          customerEmail: order.customerEmail || "",
          phone:         order.phone         || "",
          address:       order.address       || "",
          total:         order.total         || "",
          status:        order.status        || "en attente",
          products: order.products?.length
            ? order.products.map(p => ({ name: p.name || "", quantity: p.quantity || 1, dimension: p.dimension || DIMENSIONS[0] }))
            : [{ ...EMPTY_PRODUCT }],
        }
      : { ...EMPTY_FORM, products: [{ ...EMPTY_PRODUCT }] }
  );
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouch]   = useState({});

  const setField   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const touchField = (k)    => setTouch(t => ({ ...t, [k]: true }));
  const setProduct = (i, k, v) => {
    const prods = [...form.products];
    prods[i] = { ...prods[i], [k]: v };
    setForm(f => ({ ...f, products: prods }));
  };
  const addProduct    = () => setForm(f => ({ ...f, products: [...f.products, { ...EMPTY_PRODUCT }] }));
  const removeProduct = (i) => {
    if (form.products.length > 1)
      setForm(f => ({ ...f, products: f.products.filter((_, idx) => idx !== i) }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Requis";
    if (!form.phone.trim())        e.phone = "Requis";
    if (!form.total || isNaN(Number(form.total))) e.total = "Montant invalide";
    form.products.forEach((p, i) => { if (!p.name.trim()) e[`prod_${i}`] = "Nom requis"; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    setTouch({ customerName: true, phone: true, total: true });
    if (!validate()) return;
    setSaving(true);
    await onSave({ ...form, total: Number(form.total) }, order?._id);
    setSaving(false);
  };

  const isValid = form.customerName.trim() && form.phone.trim() && form.total && !isNaN(Number(form.total));

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modalCard} onClick={e => e.stopPropagation()}>
        <div style={S.modalAccent()} />
        <div style={S.modalHeader}>
          <div style={{ ...S.modalIconBox, background: isEdit ? "#fff7ed" : "#fff7ed" }}>
            <Ico d={isEdit ? ICO.edit : ICO.plus} size={17} color="#f97316" />
          </div>
          <div>
            <div style={S.modalTitle}>{isEdit ? `Modifier la commande #${fmtId(order._id)}` : "Nouvelle commande"}</div>
            <div style={S.modalSub}>{isEdit ? "Modifiez les informations et sauvegardez." : "Remplissez les informations ci-dessous."}</div>
          </div>
          <button style={S.modalClose} onClick={onClose}>
            <Ico d={ICO.x} size={16} color="#9ca3af" />
          </button>
        </div>

        <div style={{ overflowY: "auto", maxHeight: "calc(92vh - 140px)" }}>
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 14 }}>

            <Section icon={ICO.user} iconBg="#fff7ed" iconColor="#f97316" title="Informations client">
              <div style={S.formGrid}>
                <Field label="Nom / Prénom *" value={form.customerName} onChange={v => setField("customerName", v)} placeholder="Ex : Yasmine Khelifi" error={touched.customerName && errors.customerName} />
                <Field label="Email" value={form.customerEmail} onChange={v => setField("customerEmail", v)} placeholder="client@email.com" type="email" />
              </div>
              <div style={S.formGrid}>
                <Field label="Téléphone *" value={form.phone} onChange={v => setField("phone", v)} placeholder="+216 XX XXX XXX" type="tel" error={touched.phone && errors.phone} />
                <Field label="Adresse" value={form.address} onChange={v => setField("address", v)} placeholder="Rue, Ville, Code postal" />
              </div>
            </Section>

            <Section icon={ICO.pkg} iconBg="#fff7ed" iconColor="#f97316" title="Produits commandés">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 110px 32px", gap: 6, padding: "0 2px", marginBottom: 4 }}>
                {["Nom du produit", "Qté", "Dimension", ""].map((h, i) => (
                  <span key={i} style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af", fontWeight: 700 }}>{h}</span>
                ))}
              </div>
              {form.products.map((p, i) => (
                <div key={i} style={S.prodRow}>
                  <div>
                    <input
                      style={{ ...S.fieldInput, height: 34, fontSize: 12, ...(errors[`prod_${i}`] ? { borderColor: "#ef4444" } : {}) }}
                      type="text" placeholder="Ex : Matelas confort" value={p.name}
                      onChange={e => setProduct(i, "name", e.target.value)}
                    />
                    {errors[`prod_${i}`] && <div style={{ fontSize: 10, color: "#ef4444", marginTop: 2 }}>{errors[`prod_${i}`]}</div>}
                  </div>
                  <input
                    style={{ ...S.fieldInput, height: 34, fontSize: 12, textAlign: "center", fontWeight: 700 }}
                    type="number" min="1" value={p.quantity}
                    onChange={e => setProduct(i, "quantity", Math.max(1, Number(e.target.value)))}
                  />
                  <select
                    style={{ ...S.fieldInput, height: 34, fontSize: 12, cursor: "pointer" }}
                    value={p.dimension}
                    onChange={e => setProduct(i, "dimension", e.target.value)}
                  >
                    {DIMENSIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <button style={S.btnRm} onClick={() => removeProduct(i)} disabled={form.products.length === 1} aria-label="Supprimer">
                    <Ico d={ICO.trash} size={13} color="#dc2626" />
                  </button>
                </div>
              ))}
              <button style={S.btnAddProd} onClick={addProduct}>
                <Ico d={ICO.plus} size={13} color="#f97316" sw={2.5} /> Ajouter un produit
              </button>
              <div style={S.totalBox}>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af", fontWeight: 700, marginBottom: 2 }}>
                    Montant total * {touched.total && errors.total && <span style={{ color: "#ef4444", fontSize: 10, textTransform: "none" }}> — {errors.total}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>En dinars tunisiens</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <input
                    type="number" placeholder="0.00" min="0" step="0.5"
                    value={form.total}
                    onChange={e => setField("total", e.target.value)}
                    onBlur={() => { touchField("total"); validate(); }}
                    style={{ ...S.fieldInput, width: 110, textAlign: "right", fontWeight: 700, fontSize: 15, ...(touched.total && errors.total ? { borderColor: "#ef4444" } : { borderColor: "#fed7aa" }) }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>DT</span>
                </div>
              </div>
            </Section>

            <Section icon={ICO.flag} iconBg="#ede9fe" iconColor="#6d28d9" title="État de la commande">
              <div style={S.statusGrid}>
                {STATUS_VISUAL.map(s => (
                  <button key={s.key} onClick={() => setField("status", s.key)} style={S.statusBtn(form.status === s.key, s)}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", margin: "0 auto 6px", background: form.status === s.key ? s.color : "#d1d5db" }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </Section>

          </div>
        </div>

        <div style={{ ...S.modalFooter, justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>* Champs obligatoires</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.btnCancel} onClick={onClose}>Annuler</button>
            <button
              style={{ ...S.btnPrimary, ...(saving || !isValid ? S.btnSaveDisabled : {}) }}
              onClick={handleSave}
              disabled={saving || !isValid}
            >
              <Ico d={ICO.check} size={14} color="#fff" />
              {saving ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer la commande"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StatusModal ───────────────────────────────────────────────────────────────

function StatusModal({ order, onClose, onSave }) {
  const [newStatus, setNewStatus] = useState(order?.status || "en attente");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (order) setNewStatus(order.status); }, [order]);
  if (!order) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave(order._id, newStatus);
    setSaving(false);
  };

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modalCardSm} onClick={e => e.stopPropagation()}>
        <div style={S.modalAccent()} />
        <div style={S.modalHeader}>
          <div style={{ ...S.modalIconBox, background: "#ede9fe" }}>
            <Ico d={ICO.refresh} size={17} color="#6d28d9" />
          </div>
          <div>
            <div style={S.modalTitle}>Changer l'état</div>
            <div style={S.modalSub}>Commande #{fmtId(order._id)}</div>
          </div>
          <button style={S.modalClose} onClick={onClose}>
            <Ico d={ICO.x} size={16} color="#9ca3af" />
          </button>
        </div>
        <div style={S.modalBody}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#fdf6ef", borderRadius: 9, border: "1px solid #f0e8df" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af", fontWeight: 700 }}>État actuel</span>
            <StatusBadge status={order.status} />
          </div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".07em", color: "#9ca3af", fontWeight: 700 }}>Choisir le nouvel état</div>
          <div>
            {STATUS_VISUAL.map(s => {
              const active = newStatus === s.key;
              return (
                <div key={s.key} style={S.stateItem(active, s)} onClick={() => setNewStatus(s.key)}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? s.color : "#d1d5db", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? s.color : "#6b7280" }}>{s.label}</span>
                  {active && (
                    <span style={{ marginLeft: "auto", fontSize: 11, color: s.color, background: "#fff", padding: "2px 8px", borderRadius: 999, border: `1px solid ${s.border}`, fontWeight: 600 }}>
                      Sélectionné
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={S.modalFooter}>
          <button style={S.btnCancel} onClick={onClose}>Annuler</button>
          <button style={{ ...S.btnViolet, ...(saving ? S.btnSaveDisabled : {}) }} onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DeleteModal ───────────────────────────────────────────────────────────────

function DeleteModal({ order, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  if (!order) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm(order._id);
    setDeleting(false);
  };

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modalCardSm} onClick={e => e.stopPropagation()}>
        <div style={S.modalAccent("#ef4444")} />
        <div style={S.modalHeader}>
          <div style={{ ...S.modalIconBox, background: "#fef2f2" }}>
            <Ico d={ICO.warn} size={17} color="#dc2626" />
          </div>
          <div>
            <div style={S.modalTitle}>Confirmer la suppression</div>
            <div style={S.modalSub}>Cette action est irréversible</div>
          </div>
          <button style={S.modalClose} onClick={onClose}>
            <Ico d={ICO.x} size={16} color="#9ca3af" />
          </button>
        </div>
        <div style={{ ...S.modalBody, alignItems: "center" }}>
          <div style={S.delIcon}>
            <Ico d={ICO.trash} size={24} color="#dc2626" />
          </div>
          <p style={{ fontSize: 14, color: "#374151", textAlign: "center", lineHeight: 1.7 }}>
            Voulez-vous vraiment supprimer la commande de{" "}
            <strong style={{ color: "#1f2937" }}>{order.customerName || "ce client"}</strong> d'un montant de{" "}
            <strong style={{ color: "#1f2937" }}>{(order.total || 0).toLocaleString("fr-TN")} DT</strong> ?
          </p>
          <div style={S.warnBox}>
            <Ico d={ICO.warn} size={15} color="#b91c1c" />
            <span>Cette action est <strong>irréversible</strong>. Toutes les données seront perdues.</span>
          </div>
          <div style={{ width: "100%", padding: "10px 14px", background: "#fdf6ef", borderRadius: 9, border: "1px solid #f0e8df" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Client</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1f2937" }}>{order.customerName || "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Montant</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1f2937" }}>{(order.total || 0).toLocaleString("fr-TN")} DT</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Statut</span>
              <StatusBadge status={order.status} />
            </div>
          </div>
        </div>
        <div style={S.modalFooter}>
          <button style={S.btnCancel} onClick={onClose}>Annuler</button>
          <button style={{ ...S.btnDanger, ...(deleting ? S.btnSaveDisabled : {}) }} onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Suppression…" : "Supprimer définitivement"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OrderRow ──────────────────────────────────────────────────────────────────

function OrderRow({ order, onView, onEdit, onStatus, onDelete }) {
  return (
    <tr
      style={S.tr}
      onMouseEnter={e => e.currentTarget.style.background = "#fffbf7"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <td style={{ ...S.td, ...S.tdId }}>{fmtId(order._id)}</td>
      <td style={{ ...S.td, fontSize: 12, color: "#374151", whiteSpace: "nowrap" }}>{fmtDate(order.createdAt)}</td>
      <td style={S.td}>
        <div style={S.tdName}>{order.customerName || "Client inconnu"}</div>
        <div style={S.tdSub}>{order.customerEmail || ""}</div>
      </td>
      <td style={{ ...S.td, fontSize: 12.5, color: "#374151", whiteSpace: "nowrap" }}>{order.phone || "—"}</td>
      <td style={S.td}>{order.address || "—"}</td>
      <td style={S.td}><ProductTags products={order.products} /></td>
      <td style={{ ...S.td, fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", color: "#1f2937" }}>
        {(order.total || 0).toLocaleString("fr-TN")} DT
      </td>
      <td style={S.td}><StatusBadge status={order.status} /></td>
      <td style={S.td}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <button style={S.btnView}   onClick={onView}>Voir</button>
          <button style={S.btnEdit}   onClick={onEdit}>Modifier</button>
          <button style={S.btnState}  onClick={onStatus}>État</button>
          <button style={S.btnDel}    onClick={onDelete}>Supprimer</button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function ManageOrders({
  Sidebar = EmployeeSidebar,
  sidebarWidth = 220,
  sidebarProps = {},
}) {
  const [orders,        setOrders]        = useState([]);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("Tous");
  const [loading,       setLoading]       = useState(false);
  const [refreshing,    setRefreshing]    = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showView,      setShowView]      = useState(false);
  const [showAdd,       setShowAdd]       = useState(false);
  const [showEdit,      setShowEdit]      = useState(false);
  const [showStatus,    setShowStatus]    = useState(false);
  const [showDelete,    setShowDelete]    = useState(false);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await getAllOrders({ force: isRefresh, limit: 100 });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur récupération commandes :", err);
      const cachedOrders = getCachedOrders();
      if (cachedOrders.length) {
        setOrders(cachedOrders);
        toast.warning("Serveur lent: affichage des dernières commandes en cache.");
      } else {
        toast.error("Le serveur met trop de temps à récupérer les commandes.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const createOrder = async (data) => {
    try {
      await addOrder(data);
      await fetchOrders(true);
      setShowAdd(false);
      toast.success("Commande créée avec succès.");
    } catch (err) {
      toast.error("Impossible de créer la commande.");
    }
  };

  const editOrder = async (data, orderId) => {
    try {
      await updateOrder(orderId, data);
      await fetchOrders(true);
      setShowEdit(false);
      setSelectedOrder(null);
      toast.success("Commande mise à jour.");
    } catch {
      toast.error("Impossible de modifier la commande.");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateOrder(orderId, { status });
      await fetchOrders(true);
      setShowStatus(false);
      setSelectedOrder(null);
      toast.success("Statut mis à jour.");
    } catch {
      toast.error("Impossible de mettre à jour le statut.");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await removeOrder(orderId);
      await fetchOrders(true);
      setShowDelete(false);
      setSelectedOrder(null);
      toast.success("Commande supprimée.");
    } catch {
      toast.error("Impossible de supprimer la commande.");
    }
  };

  const filteredOrders = orders.filter(order => {
    const q = search.toLowerCase();
    return (
      (!q || [order.customerName, order.customerEmail, order.phone, order._id].some(v => (v || "").toLowerCase().includes(q))) &&
      (filterStatus === "Tous" || order.status === filterStatus)
    );
  });

  const stats = {
    total:     orders.length,
    enAttente: orders.filter(o => o.status === "en attente").length,
    enCours:   orders.filter(o => o.status === "en cours").length,
    expedié:   orders.filter(o => o.status === "expédié").length,
    livré:     orders.filter(o => o.status === "livré").length,
  };

  const pick  = (order, setter) => { setSelectedOrder(order); setter(true); };
  const close = (setter) => () => { setter(false); setSelectedOrder(null); };

  return (
    <div style={S.root}>
      <Sidebar {...sidebarProps} />

      <main style={S.main}>

        {/* ── Topbar ── */}
        <div style={S.topbar}>
          <div>
            <p style={S.topbarSub}>Star Mousse · Employé</p>
            <h1 style={S.topbarTitle}>Gestion des commandes</h1>
          </div>
          <button
            style={S.btnAdd}
            onClick={() => setShowAdd(true)}
            onMouseEnter={e => e.currentTarget.style.background = "#ea580c"}
            onMouseLeave={e => e.currentTarget.style.background = "#f97316"}
          >
            <Ico d={ICO.plus} size={15} color="#fff" sw={2.5} />
            Nouvelle commande
          </button>
        </div>

        {/* ── KPI strip ── */}
        <div style={S.kpiStrip}>
          {[
            { label: "Total commandes", value: stats.total,     color: "#f97316" },
            { label: "En attente",      value: stats.enAttente, color: "#b45309" },
            { label: "En cours",        value: stats.enCours,   color: "#6d28d9" },
            { label: "Expédiées",       value: stats.expedié,   color: "#1d4ed8" },
            { label: "Livrées",         value: stats.livré,     color: "#15803d" },
          ].map((k, i, arr) => (
            <React.Fragment key={k.label}>
              <div style={S.kpiItem}>
                <div style={{ ...S.kpiIcon, background: k.color }}>
                  <Ico d={ICO.tag} size={18} color="#fff" />
                </div>
                <div>
                  <div style={S.kpiVal}>{k.value}</div>
                  <div style={S.kpiLbl}>{k.label}</div>
                </div>
              </div>
              {i < arr.length - 1 && <div style={S.kpiDivider} />}
            </React.Fragment>
          ))}
        </div>

        {/* ── Controls ── */}
        <div style={S.controls}>
          <div style={S.searchWrap}>
            <Ico d={ICO.search} size={15} color="#9ca3af" />
            <input
              style={S.searchInput}
              placeholder="Rechercher client, téléphone, ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16, padding: 2 }}>×</button>
            )}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                style={S.pill(filterStatus === s)}
                onClick={() => setFilterStatus(s)}
              >
                {s === "Tous" ? "Tous" : STATUS_CONFIG[s]?.label || s}
              </button>
            ))}
          </div>
          <button
            style={S.refreshBtn}
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
          >
            <Ico d={ICO.refresh} size={14} color="#6b7280" />
            {refreshing ? "Actualisation…" : "Rafraîchir"}
          </button>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div style={S.empty}>Chargement des commandes…</div>
        ) : (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div>
                <h2 style={S.cardTitle}>Liste des commandes</h2>
                <p style={S.cardSub}>{filteredOrders.length} résultat{filteredOrders.length !== 1 ? "s" : ""} sur {orders.length}</p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["ID", "Date", "Client", "Téléphone", "Adresse", "Produits", "Montant", "État", "Actions"].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={9} style={S.empty}>
                      {search || filterStatus !== "Tous"
                        ? "Aucune commande ne correspond à votre recherche."
                        : "Aucune commande disponible."}
                    </td></tr>
                  ) : (
                    filteredOrders.map(order => (
                      <OrderRow
                        key={order._id || Math.random()}
                        order={order}
                        onView={() => pick(order, setShowView)}
                        onEdit={() => pick(order, setShowEdit)}
                        onStatus={() => pick(order, setShowStatus)}
                        onDelete={() => pick(order, setShowDelete)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {showView   && <ViewModal   order={selectedOrder} onClose={close(setShowView)} />}
      {showAdd    && <AddEditModal order={null}          onClose={() => setShowAdd(false)} onSave={createOrder} />}
      {showEdit   && <AddEditModal order={selectedOrder} onClose={close(setShowEdit)}  onSave={editOrder} />}
      {showStatus && <StatusModal  order={selectedOrder} onClose={close(setShowStatus)} onSave={updateOrderStatus} />}
      {showDelete && <DeleteModal  order={selectedOrder} onClose={close(setShowDelete)} onConfirm={deleteOrder} />}
    </div>
  );
}
