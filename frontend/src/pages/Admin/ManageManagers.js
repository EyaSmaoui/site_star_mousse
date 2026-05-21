import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSidebar from "./AdminSidebar";
import { getAllManagers, createManager, updateManager, deleteManager } from "../../services/apiManagers";

/* ─── Constantes ─────────────────────────────────────────────────────────── */
const EMPTY_FORM = { name: "", email: "", phone: "", role: "Livreur", status: "actif" };

const ROLE_OPTIONS = ["Livreur", "Responsable Stock", "Vendeur", "Nettoyeur", "Agent de Sécurité"];

const ROLE_COLORS = {
  "Livreur":             { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "Responsable Stock":   { bg: "#f0fdf4", color: "#16a34a", border: "#86efac" },
  "Vendeur":             { bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff" },
  "Nettoyeur":           { bg: "#fff7ed", color: "#f97316", border: "#fed7aa" },
  "Agent de Sécurité":   { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const STATUS_STYLE = {
  actif:   { bg: "#dcfce7", color: "#16a34a", border: "#86efac" },
  inactif: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */
const Ico = ({ d, size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICO = {
  plus:  ["M12 5v14", "M5 12h14"],
  edit:  ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash: ["M3 6h18", "M19 6l-1 14H6L5 6", "M9 6V4h6v2"],
  x:     ["M18 6L6 18", "M6 6l12 12"],
  warn:  ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
  search:"M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  user:  ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
  usercog: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z", "M19 8a3 3 0 100 6 3 3 0 000-6z"],
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  check: "M20 6L9 17l-5-5",
};

/* ─── Composant Principal ────────────────────────────────────────────────── */
export default function ManageManagers() {
  const navigate = useNavigate();
  const [managers, setManagers]   = useState([]);
  const [search, setSearch]       = useState("");
  const [filterRole, setFilterRole] = useState("Tous");
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [confirmId, setConfirmId] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const data = await getAllManagers();
      setManagers(Array.isArray(data) ? data : []);
    } catch (error) {
      const msg = error.response?.status === 401
        ? "Session expirée — reconnectez-vous"
        : error.response?.data?.message || "Impossible de charger les gestionnaires";
      toast.error(msg);
      if (error.response?.status === 401) navigate("/login/admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token    = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) { toast.error("Connectez-vous en tant qu'administrateur"); navigate("/login/admin"); return; }
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role !== "admin") { toast.error("Accès réservé à l'administrateur"); navigate("/"); return; }
      } catch { navigate("/login/admin"); return; }
    }
    fetchManagers();
  }, [navigate]);

  const openAdd  = () => { setForm(EMPTY_FORM); setModal("add"); };
  const openEdit = (m) => {
    setForm({ name: m.name || "", email: m.email || "", phone: m.phone || "", role: m.role || ROLE_OPTIONS[0], status: m.status || "actif" });
    setModal({ mode: "edit", manager: m });
  };
  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.warning("Nom, email et téléphone sont obligatoires"); return;
    }
    const payload = { name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim(), role: form.role, status: form.status };
    setSaving(true);
    try {
      if (modal === "add") { await createManager(payload); toast.success("Gestionnaire ajouté"); }
      else if (modal?.manager?._id) { await updateManager(modal.manager._id, payload); toast.success("Gestionnaire mis à jour"); }
      fetchManagers(); closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Erreur lors de la sauvegarde.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteManager(id); toast.success("Gestionnaire supprimé");
      fetchManagers(); setConfirmId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  const filtered = managers.filter((m) => {
    const q      = search.trim().toLowerCase();
    const okSearch = !q || m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
    const okRole = filterRole === "Tous" || m.role === filterRole;
    return okSearch && okRole;
  });

  const actifCount = managers.filter(m => m.status === "actif").length;

  return (
    <div style={S.root}>
      <AdminSidebar />

      <main style={S.main}>

        {/* ── Topbar ── */}
        <div style={S.topbar}>
          <div>
            <p style={S.topbarSub}>Star Mousse · Administration</p>
            <h1 style={S.topbarTitle}>Gestion des Gestionnaires</h1>
          </div>
          <button style={S.btnAdd} onClick={openAdd}
            onMouseEnter={e => e.currentTarget.style.background = "#ea580c"}
            onMouseLeave={e => e.currentTarget.style.background = "#f97316"}>
            <Ico d={ICO.plus} size={15} color="#fff" sw={2.5} />
            Nouveau gestionnaire
          </button>
        </div>

        {/* ── KPI strip ── */}
        <div style={S.kpiStrip}>
          <div style={S.kpiItem}>
            <div style={{ ...S.kpiIcon, background: "#3b82f6" }}>
              <Ico d={ICO.user} size={18} color="#fff" />
            </div>
            <div>
              <div style={S.kpiVal}>{managers.length}</div>
              <div style={S.kpiLbl}>Total gestionnaires</div>
            </div>
          </div>
          <div style={S.kpiDivider} />
          <div style={S.kpiItem}>
            <div style={{ ...S.kpiIcon, background: "#10b981" }}>
              <Ico d={ICO.check} size={18} color="#fff" />
            </div>
            <div>
              <div style={S.kpiVal}>{actifCount}</div>
              <div style={S.kpiLbl}>Actifs</div>
            </div>
          </div>
          <div style={S.kpiDivider} />
          <div style={S.kpiItem}>
            <div style={{ ...S.kpiIcon, background: "#f97316" }}>
              <Ico d={ICO.shield} size={18} color="#fff" />
            </div>
            <div>
              <div style={S.kpiVal}>{ROLE_OPTIONS.length}</div>
              <div style={S.kpiLbl}>Rôles disponibles</div>
            </div>
          </div>
        </div>

        {/* ── Card ── */}
        <div style={S.card}>
          {/* Card header */}
          <div style={S.cardHeader}>
            <div>
              <h2 style={S.cardTitle}>Liste des gestionnaires</h2>
              <p style={S.cardSub}>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</p>
            </div>
            <div style={S.headerActions}>
              {/* Role filter pills */}
              <div style={S.filterRow}>
                {["Tous", ...ROLE_OPTIONS].map(role => (
                  <button key={role} onClick={() => setFilterRole(role)}
                    style={{ ...S.filterPill, ...(filterRole === role ? S.filterPillActive : S.filterPillInactive) }}>
                    {role}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div style={S.searchWrap}>
                <Ico d={ICO.search} size={15} color="#9ca3af" />
                <input
                  style={S.searchInput}
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={S.empty}>Chargement des gestionnaires…</div>
          ) : filtered.length === 0 ? (
            <div style={S.empty}>Aucun gestionnaire trouvé{search ? ` pour « ${search} »` : ""}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Nom", "Contact", "Rôle", "Statut", "Actions"].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <ManagerRow
                      key={m._id}
                      manager={m}
                      onEdit={() => openEdit(m)}
                      onDelete={() => setConfirmId(m._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Modal Ajout / Édition ── */}
        {modal && (
          <div style={S.backdrop} onClick={closeModal}>
            <div style={S.modalCard} onClick={e => e.stopPropagation()}>
              <div style={S.modalAccent} />
              <div style={S.modalHeader}>
                <div style={{ ...S.modalIconBox, background: modal === "add" ? "#fff7ed" : "#eff6ff" }}>
                  <Ico d={modal === "add" ? ICO.plus : ICO.edit} size={18}
                    color={modal === "add" ? "#f97316" : "#3b82f6"} />
                </div>
                <div>
                  <div style={S.modalTitle}>{modal === "add" ? "Nouveau gestionnaire" : "Modifier le gestionnaire"}</div>
                  <div style={S.modalSub}>Remplissez les informations ci-dessous</div>
                </div>
                <button style={S.modalClose} onClick={closeModal}>
                  <Ico d={ICO.x} size={16} color="#9ca3af" />
                </button>
              </div>

              <div style={S.modalBody}>
                <Field label="Nom complet *"  value={form.name}  onChange={v => setForm(f => ({ ...f, name: v }))}  placeholder="Ex : Amira Ben Salah" />
                <Field label="Email *"        value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="amira@example.com" type="email" />
                <Field label="Téléphone *"    value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+216 XX XXX XXX" />

                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    <label style={S.fieldLabel}>Rôle *</label>
                    <select style={S.fieldSelect} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                      {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    <label style={S.fieldLabel}>Statut</label>
                    <select style={S.fieldSelect} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={S.modalFooter}>
                <button style={S.btnCancel} onClick={closeModal}>Annuler</button>
                <button style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#ea580c"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f97316"; }}>
                  {saving ? "Enregistrement…" : modal === "add" ? "Ajouter le gestionnaire" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirmation Suppression ── */}
        {confirmId && (
          <div style={S.backdrop} onClick={() => setConfirmId(null)}>
            <div style={{ ...S.modalCard, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
              <div style={{ height: 5, background: "#ef4444", borderRadius: "14px 14px 0 0" }} />
              <div style={S.modalHeader}>
                <div style={{ ...S.modalIconBox, background: "#fef2f2" }}>
                  <Ico d={ICO.warn} size={18} color="#dc2626" />
                </div>
                <div>
                  <div style={S.modalTitle}>Confirmer la suppression</div>
                  <div style={S.modalSub}>Cette action est irréversible</div>
                </div>
                <button style={S.modalClose} onClick={() => setConfirmId(null)}>
                  <Ico d={ICO.x} size={16} color="#9ca3af" />
                </button>
              </div>
              <div style={S.modalBody}>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                  Voulez-vous vraiment supprimer le gestionnaire{" "}
                  <strong style={{ color: "#1f2937" }}>
                    {managers.find(m => m._id === confirmId)?.name}
                  </strong> ? Toutes ses données seront perdues.
                </p>
              </div>
              <div style={S.modalFooter}>
                <button style={S.btnCancel} onClick={() => setConfirmId(null)}>Annuler</button>
                <button style={S.btnDanger} onClick={() => handleDelete(confirmId)}>Supprimer définitivement</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── ManagerRow ─────────────────────────────────────────────────────────── */
function ManagerRow({ manager, onEdit, onDelete }) {
  const st = STATUS_STYLE[manager.status] || STATUS_STYLE.actif;
  const rc = ROLE_COLORS[manager.role]    || { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };
  const initials = (manager.name || "?").split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <tr style={S.tr}
      onMouseEnter={e => e.currentTarget.style.background = "#fffbf7"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <td style={S.td}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.avatar}>{initials}</div>
          <span style={S.rowName}>{manager.name}</span>
        </div>
      </td>
      <td style={S.td}>
        <div style={{ fontSize: 13, color: "#374151" }}>{manager.email}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{manager.phone || "—"}</div>
      </td>
      <td style={S.td}>
        <span style={{ ...S.badge, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
          {manager.role}
        </span>
      </td>
      <td style={S.td}>
        <span style={{ ...S.badge, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
          {manager.status}
        </span>
      </td>
      <td style={S.td}>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btnRowEdit}   onClick={onEdit}>Modifier</button>
          <button style={S.btnRowDelete} onClick={onDelete}>Supprimer</button>
        </div>
      </td>
    </tr>
  );
}

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={S.fieldLabel}>{label}</label>
      <input
        type={type}
        style={S.fieldInput}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={e => { e.target.style.borderColor = "#f97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.12)"; }}
        onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  root: { display: "flex", minHeight: "100vh", background: "#fdf6ef", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1f2937" },
  main: { marginLeft: 220, flex: 1, padding: "28px 32px" },

  /* Topbar */
  topbar:      { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  topbarSub:   { fontSize: 13, color: "#9ca3af", margin: "0 0 4px" },
  topbarTitle: { fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 },
  btnAdd: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "10px 20px", background: "#f97316", color: "#fff",
    border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", transition: "background .15s",
  },

  /* KPI strip */
  kpiStrip: {
    display: "flex", alignItems: "center",
    background: "#fff", border: "1px solid #f0e8df",
    borderRadius: 12, marginBottom: 20, overflow: "hidden",
  },
  kpiItem:   { display: "flex", alignItems: "center", gap: 14, padding: "18px 28px", flex: 1 },
  kpiDivider:{ width: 1, height: 40, background: "#f0e8df", flexShrink: 0 },
  kpiIcon:   { width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  kpiVal:    { fontSize: 24, fontWeight: 700, color: "#1f2937", lineHeight: 1 },
  kpiLbl:    { fontSize: 12, color: "#9ca3af", marginTop: 4, fontWeight: 500 },

  /* Card */
  card:      { background: "#fff", border: "1px solid #f0e8df", borderRadius: 14, overflow: "hidden" },
  cardHeader:{ padding: "16px 20px", borderBottom: "1px solid #f9f0e8", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  cardTitle: { fontSize: 13, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 2px" },
  cardSub:   { fontSize: 12, color: "#9ca3af", margin: 0 },

  /* Header actions */
  headerActions: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 },
  filterRow:     { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" },
  filterPill: {
    padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
    cursor: "pointer", border: "1px solid transparent", fontFamily: "inherit", transition: "all .12s",
  },
  filterPillActive:   { background: "#f97316", color: "#fff", border: "1px solid #f97316" },
  filterPillInactive: { background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb" },

  /* Search */
  searchWrap: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#f9fafb", border: "1px solid #e5e7eb",
    borderRadius: 10, padding: "8px 14px", minWidth: 220,
  },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1f2937", flex: 1, fontFamily: "inherit" },

  /* Table */
  table: { width: "100%", borderCollapse: "collapse" },
  th:    { padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 700, textAlign: "left", textTransform: "uppercase", letterSpacing: ".06em", borderBottom: "1px solid #e5e7eb" },
  tr:    { borderBottom: "1px solid #fdf3ea", transition: "background .12s" },
  td:    { padding: "13px 20px", verticalAlign: "middle" },

  avatar:  { width: 36, height: 36, borderRadius: "50%", background: "#fff7ed", color: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0, border: "1.5px solid #fed7aa" },
  rowName: { fontSize: 14, fontWeight: 600, color: "#1f2937" },
  badge:   { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 },

  btnRowEdit: {
    padding: "6px 14px", background: "#fff7ed", color: "#f97316",
    border: "1px solid #fed7aa", borderRadius: 7,
    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
  btnRowDelete: {
    padding: "6px 14px", background: "#fef2f2", color: "#dc2626",
    border: "1px solid #fecaca", borderRadius: 7,
    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },

  /* Modal */
  backdrop:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalCard:   { background: "#fff", borderRadius: 16, border: "1px solid #f0e8df", width: "100%", maxWidth: 480, boxShadow: "0 24px 60px rgba(0,0,0,0.14)" },
  modalAccent: { height: 5, background: "linear-gradient(90deg,#f97316,#fb923c)", borderRadius: "14px 14px 0 0" },
  modalHeader: { display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", borderBottom: "1px solid #f9f0e8" },
  modalIconBox:{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  modalTitle:  { fontSize: 15, fontWeight: 700, color: "#1f2937" },
  modalSub:    { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  modalClose:  { marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" },
  modalBody:   { padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 },
  modalFooter: { padding: "16px 22px", borderTop: "1px solid #f9f0e8", display: "flex", justifyContent: "flex-end", gap: 10 },

  fieldLabel: { fontSize: 13, fontWeight: 600, color: "#374151" },
  fieldInput: {
    padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 10,
    fontSize: 13, color: "#1f2937", background: "#fff",
    outline: "none", transition: "border-color .15s, box-shadow .15s", fontFamily: "inherit",
  },
  fieldSelect: {
    padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 10,
    fontSize: 13, color: "#1f2937", background: "#fff",
    outline: "none", fontFamily: "inherit", cursor: "pointer",
    appearance: "auto",
  },

  btnCancel:  { padding: "9px 20px", background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnPrimary: { padding: "9px 20px", background: "#f97316", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background .15s" },
  btnDanger:  { padding: "9px 20px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },

  empty: { padding: "52px", textAlign: "center", color: "#9ca3af", fontSize: 14 },
};