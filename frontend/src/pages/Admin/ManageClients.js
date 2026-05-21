import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSidebar from "./AdminSidebar";
import { createClient, deleteClient, getAllClients, updateClient } from "../../services/apiCustomers";
import { getAllOrders } from "../../services/apiOrder";

const EMPTY_FORM = { name: "", email: "", phone: "" };
const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "actif", label: "Actifs" },
  { key: "inactif", label: "Inactifs" },
  { key: "auto", label: "Depuis commandes" },
];

const STATUS_STYLE = {
  actif: { bg: "#dcfce7", color: "#15803d", border: "#86efac", label: "Actif" },
  inactif: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5", label: "Inactif" },
};

const Ico = ({ d, size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICO = {
  search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  plus: ["M12 5v14", "M5 12h14"],
  refresh: ["M21 12a9 9 0 11-2.64-6.36", "M21 3v6h-6"],
  edit: ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash: ["M3 6h18", "M19 6l-1 14H6L5 6", "M9 6V4h6v2"],
  x: ["M18 6L6 18", "M6 6l12 12"],
  warn: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
  user: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
  order: ["M6 2l1.5 3L10 2l2 3 2-3 2.5 3L18 2v20l-2-1.5L14 22l-2-1.5L10 22l-2.5-1.5L6 22V2z", "M9 10h6", "M9 14h5"],
  wallet: ["M20 7H5a3 3 0 000 6h15v6H5a3 3 0 010-6h15V7z", "M16 13h.01"],
};

const normalizeEmail = (email) => (email || "").trim().toLowerCase();
const normalizePhone = (phone) => (phone || "").trim();
const formatMoney = (amount) => `${Number(amount || 0).toLocaleString("fr-TN")} DT`;
const getNumericTotal = (client) => Number(String(client.total || "0").replace(/[^\d.]/g, "")) || 0;

const getClientKey = (client) =>
  normalizeEmail(client.email) || (normalizePhone(client.phone) ? `phone:${normalizePhone(client.phone)}` : `client:${client._id}`);

const getOrderClientKey = (order) =>
  normalizeEmail(order.customerEmail) || (normalizePhone(order.phone) ? `phone:${normalizePhone(order.phone)}` : `order:${order._id}`);

const formatDate = (date) => {
  if (!date) return "Aucune commande";
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const buildClientRows = (clients, orders) => {
  const statsByKey = new Map();

  orders.forEach(order => {
    const key = getOrderClientKey(order);
    const stats = statsByKey.get(key) || {
      name: order.customerName || "Client",
      email: order.customerEmail || "",
      phone: order.phone || "",
      orders: 0,
      totalAmount: 0,
      lastOrderAt: order.createdAt || "",
    };

    stats.orders += 1;
    stats.totalAmount += Number(order.total || 0);
    if (order.createdAt && (!stats.lastOrderAt || new Date(order.createdAt) > new Date(stats.lastOrderAt))) {
      stats.lastOrderAt = order.createdAt;
    }
    statsByKey.set(key, stats);
  });

  const used = new Set();
  const savedRows = clients.map(client => {
    const key = getClientKey(client);
    const stats = statsByKey.get(key);
    used.add(key);

    return {
      ...client,
      source: "manual",
      orders: stats?.orders ?? client.orders ?? 0,
      total: stats ? formatMoney(stats.totalAmount) : client.total || "0 DT",
      status: stats?.orders ? "actif" : client.status || "inactif",
      lastOrderAt: stats?.lastOrderAt || client.lastOrderAt || "",
    };
  });

  const autoRows = Array.from(statsByKey.entries())
    .filter(([key]) => !used.has(key))
    .map(([key, stats]) => ({
      _id: `auto-${key}`,
      name: stats.name,
      email: stats.email,
      phone: stats.phone,
      orders: stats.orders,
      total: formatMoney(stats.totalAmount),
      status: "actif",
      source: "auto",
      isAuto: true,
      lastOrderAt: stats.lastOrderAt,
    }));

  return [...savedRows, ...autoRows].sort((a, b) => {
    const aTime = a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0;
    const bTime = b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0;
    return bTime - aTime;
  });
};

export default function ManageClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmClient, setConfirmClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => buildClientRows(clients, orders), [clients, orders]);

  const stats = useMemo(() => {
    const totalSpent = rows.reduce((sum, client) => sum + getNumericTotal(client), 0);
    return {
      total: rows.length,
      active: rows.filter(client => client.status === "actif").length,
      auto: rows.filter(client => client.isAuto).length,
      orders: rows.reduce((sum, client) => sum + Number(client.orders || 0), 0),
      totalSpent,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(client => {
      const matchesSearch = !q || [client.name, client.email, client.phone].some(value => (value || "").toLowerCase().includes(q));
      const matchesFilter =
        filter === "all" ||
        (filter === "auto" && client.isAuto) ||
        client.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, rows, search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [clientsData, ordersData] = await Promise.all([getAllClients(), getAllOrders()]);
      setClients(Array.isArray(clientsData) ? clientsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Impossible de charger les clients.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      toast.error("Connectez-vous en tant qu'administrateur");
      navigate("/login/admin");
      return;
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role !== "admin") {
          toast.error("Accès réservé à l'administrateur");
          navigate("/");
          return;
        }
      } catch {
        navigate("/login/admin");
        return;
      }
    }

    fetchData();
  }, [fetchData, navigate]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal("add");
  };

  const openEdit = (client) => {
    if (client.isAuto) return;
    setForm({ name: client.name || "", email: client.email || "", phone: client.phone || "" });
    setModal({ mode: "edit", client });
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_FORM);
    setSaving(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Nom, email et téléphone sont obligatoires.");
      return;
    }

    setSaving(true);
    try {
      if (modal === "add") {
        await createClient(form);
        toast.success("Client ajouté");
      } else {
        await updateClient(modal.client._id, form);
        toast.success("Client mis à jour");
      }
      closeModal();
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmClient || confirmClient.isAuto) return;

    try {
      await deleteClient(confirmClient._id);
      toast.success("Client supprimé");
      setConfirmClient(null);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div style={S.root}>
      <AdminSidebar />

      <main style={S.main}>
        <div style={S.topbar}>
          <div>
            <p style={S.eyebrow}>Star Mousse · Administration</p>
            <h1 style={S.title}>Clients</h1>
          </div>
          <div style={S.actions}>
            <button style={S.btnGhost} onClick={fetchData} disabled={loading}>
              <Ico d={ICO.refresh} size={15} />
              {loading ? "Chargement..." : "Rafraîchir"}
            </button>
            <button style={S.btnPrimary} onClick={openAdd}>
              <Ico d={ICO.plus} size={15} color="#fff" sw={2.5} />
              Nouveau client
            </button>
          </div>
        </div>

        <div style={S.kpiGrid}>
          <Kpi icon={ICO.user} label="Clients" value={stats.total} color="#3b82f6" />
          <Kpi icon={ICO.order} label="Commandes liées" value={stats.orders} color="#f97316" />
          <Kpi icon={ICO.wallet} label="Total dépensé" value={formatMoney(stats.totalSpent)} color="#f97316" />
          <Kpi icon={ICO.user} label="Clients auto" value={stats.auto} color="#10b981" />
        </div>

        <section style={S.panel}>
          <div style={S.panelHead}>
            <div>
              <h2 style={S.panelTitle}>Liste des clients</h2>
              <p style={S.panelSub}>{filteredRows.length} résultat{filteredRows.length !== 1 ? "s" : ""} sur {rows.length}</p>
            </div>
            <div style={S.tools}>
              <div style={S.searchWrap}>
                <Ico d={ICO.search} size={15} color="#94a3b8" />
                <input
                  style={S.searchInput}
                  placeholder="Rechercher nom, email, téléphone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && <button style={S.clearBtn} onClick={() => setSearch("")}>×</button>}
              </div>
              <div style={S.filters}>
                {FILTERS.map(item => (
                  <button key={item.key} style={S.filterBtn(filter === item.key)} onClick={() => setFilter(item.key)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={S.empty}>Chargement des clients...</div>
          ) : filteredRows.length === 0 ? (
            <div style={S.empty}>Aucun client trouvé.</div>
          ) : (
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["Client", "Contact", "Commandes", "Total dépensé", "Dernière commande", "Statut", "Actions"].map(title => (
                      <th key={title} style={S.th}>{title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map(client => (
                    <ClientRow
                      key={client._id}
                      client={client}
                      onEdit={() => openEdit(client)}
                      onDelete={() => !client.isAuto && setConfirmClient(client)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modal && (
        <ClientModal
          mode={modal === "add" ? "add" : "edit"}
          form={form}
          setForm={setForm}
          saving={saving}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {confirmClient && (
        <ConfirmDeleteModal
          client={confirmClient}
          onClose={() => setConfirmClient(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function Kpi({ icon, label, value, color }) {
  return (
    <div style={S.kpi}>
      <div style={{ ...S.kpiIcon, background: color }}>
        <Ico d={icon} size={18} color="#fff" />
      </div>
      <div>
        <div style={S.kpiValue}>{value}</div>
        <div style={S.kpiLabel}>{label}</div>
      </div>
    </div>
  );
}

function ClientRow({ client, onEdit, onDelete }) {
  const status = STATUS_STYLE[client.status] || STATUS_STYLE.inactif;
  const initials = (client.name || "Client")
    .split(" ")
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <tr style={S.tr}>
      <td style={S.td}>
        <div style={S.clientCell}>
          <div style={S.avatar}>{initials || "C"}</div>
          <div>
            <div style={S.clientName}>{client.name || "Client"}</div>
            <div style={S.source}>{client.isAuto ? "Créé depuis commandes" : "Fiche client"}</div>
          </div>
        </div>
      </td>
      <td style={S.td}>
        <div style={S.primaryText}>{client.email || "Email non renseigné"}</div>
        <div style={S.mutedText}>{client.phone || "Téléphone non renseigné"}</div>
      </td>
      <td style={S.td}>
        <span style={S.orderBadge}>{client.orders || 0}</span>
      </td>
      <td style={S.td}>
        <strong style={S.amount}>{client.total || "0 DT"}</strong>
      </td>
      <td style={S.td}>
        <span style={S.mutedText}>{formatDate(client.lastOrderAt)}</span>
      </td>
      <td style={S.td}>
        <span style={{ ...S.status, background: status.bg, color: status.color, borderColor: status.border }}>
          {status.label}
        </span>
      </td>
      <td style={S.td}>
        <div style={S.rowActions}>
          <button style={{ ...S.btnSmall, ...(client.isAuto ? S.disabled : {}) }} onClick={onEdit} disabled={client.isAuto}>
            <Ico d={ICO.edit} size={13} />
            Modifier
          </button>
          <button style={{ ...S.btnSmallDanger, ...(client.isAuto ? S.disabled : {}) }} onClick={onDelete} disabled={client.isAuto}>
            <Ico d={ICO.trash} size={13} />
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
}

function ClientModal({ mode, form, setForm, saving, onClose, onSave }) {
  const isAdd = mode === "add";
  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalBar} />
        <div style={S.modalHead}>
          <div style={S.modalIcon}>
            <Ico d={isAdd ? ICO.plus : ICO.edit} size={18} color="#f97316" />
          </div>
          <div>
            <h3 style={S.modalTitle}>{isAdd ? "Nouveau client" : "Modifier le client"}</h3>
            <p style={S.modalSub}>Les champs nom, email et téléphone sont obligatoires.</p>
          </div>
          <button style={S.iconBtn} onClick={onClose}>
            <Ico d={ICO.x} size={16} />
          </button>
        </div>
        <div style={S.modalBody}>
          <Field label="Nom complet" value={form.name} onChange={value => setForm(f => ({ ...f, name: value }))} placeholder="Ex : Amira Ben Salah" />
          <Field label="Email" type="email" value={form.email} onChange={value => setForm(f => ({ ...f, email: value }))} placeholder="amira@example.com" />
          <Field label="Téléphone" value={form.phone} onChange={value => setForm(f => ({ ...f, phone: value }))} placeholder="+216 71 234 567" />
        </div>
        <div style={S.modalFoot}>
          <button style={S.btnCancel} onClick={onClose}>Annuler</button>
          <button style={{ ...S.btnPrimary, ...(saving ? S.disabled : {}) }} onClick={onSave} disabled={saving}>
            {saving ? "Enregistrement..." : isAdd ? "Ajouter" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ client, onClose, onConfirm }) {
  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 430 }} onClick={e => e.stopPropagation()}>
        <div style={{ ...S.modalBar, background: "#dc2626" }} />
        <div style={S.modalHead}>
          <div style={{ ...S.modalIcon, background: "#fee2e2" }}>
            <Ico d={ICO.warn} size={18} color="#dc2626" />
          </div>
          <div>
            <h3 style={S.modalTitle}>Supprimer le client</h3>
            <p style={S.modalSub}>Cette action est irréversible.</p>
          </div>
          <button style={S.iconBtn} onClick={onClose}>
            <Ico d={ICO.x} size={16} />
          </button>
        </div>
        <div style={S.modalBody}>
          <p style={S.confirmText}>
            Voulez-vous vraiment supprimer <strong>{client.name}</strong> ?
          </p>
        </div>
        <div style={S.modalFoot}>
          <button style={S.btnCancel} onClick={onClose}>Annuler</button>
          <button style={S.btnDanger} onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={S.field}>
      <span style={S.fieldLabel}>{label}</span>
      <input
        type={type}
        style={S.fieldInput}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

const S = {
  root: { display: "flex", minHeight: "100vh", background: "#fdf6ef", color: "#1f2937", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main: { marginLeft: 220, flex: 1, padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 },
  topbar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 },
  eyebrow: { margin: "0 0 4px", fontSize: 13, color: "#9ca3af", fontWeight: 500 },
  title: { margin: 0, fontSize: 22, lineHeight: 1.1, color: "#1f2937", fontWeight: 700 },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" },
  btnPrimary: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 20px", border: 0, borderRadius: 10, background: "#f97316", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnGhost: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 },
  kpi: { display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", background: "#fff", border: "1px solid #f0e8df", borderRadius: 12 },
  kpiIcon: { width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  kpiValue: { fontSize: 24, fontWeight: 700, color: "#1f2937", lineHeight: 1 },
  kpiLabel: { marginTop: 4, fontSize: 12, color: "#9ca3af", fontWeight: 500 },
  panel: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 14, overflow: "hidden" },
  panelHead: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: "1px solid #f9f0e8" },
  panelTitle: { margin: "0 0 2px", fontSize: 13, textTransform: "uppercase", letterSpacing: ".06em", color: "#6b7280", fontWeight: 700 },
  panelSub: { margin: 0, fontSize: 12, color: "#9ca3af" },
  tools: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" },
  searchWrap: { display: "flex", alignItems: "center", gap: 8, minWidth: 290, padding: "9px 14px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#f9fafb" },
  searchInput: { flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", color: "#1f2937", fontSize: 13, fontFamily: "inherit" },
  clearBtn: { border: 0, background: "transparent", color: "#9ca3af", fontSize: 18, lineHeight: 1, cursor: "pointer" },
  filters: { display: "flex", gap: 6, flexWrap: "wrap" },
  filterBtn: (active) => ({ padding: "7px 14px", borderRadius: 999, border: `1px solid ${active ? "#f97316" : "#e5e7eb"}`, background: active ? "#f97316" : "#fff", color: active ? "#fff" : "#6b7280", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }),
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 16px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", textAlign: "left", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".06em", whiteSpace: "nowrap", fontWeight: 700 },
  tr: { borderBottom: "1px solid #fdf3ea", transition: "background .12s" },
  td: { padding: "11px 16px", verticalAlign: "middle" },
  clientCell: { display: "flex", alignItems: "center", gap: 10, minWidth: 210 },
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "#fff7ed", color: "#f97316", border: "1.5px solid #fed7aa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  clientName: { fontSize: 14, fontWeight: 700, color: "#1f2937" },
  source: { marginTop: 2, fontSize: 11, color: "#9ca3af" },
  primaryText: { fontSize: 13, color: "#374151", whiteSpace: "nowrap" },
  mutedText: { marginTop: 2, fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" },
  orderBadge: { display: "inline-flex", minWidth: 34, height: 26, alignItems: "center", justifyContent: "center", padding: "0 9px", borderRadius: 999, background: "#fff7ed", color: "#f97316", fontSize: 12, fontWeight: 700, border: "1px solid #fed7aa" },
  amount: { fontSize: 13, color: "#1f2937", whiteSpace: "nowrap" },
  status: { display: "inline-flex", padding: "4px 10px", border: "1px solid", borderRadius: 999, fontSize: 12, fontWeight: 600 },
  rowActions: { display: "flex", gap: 7, flexWrap: "wrap" },
  btnSmall: { display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", border: "1px solid #fed7aa", borderRadius: 7, background: "#fff7ed", color: "#f97316", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSmallDanger: { display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", border: "1px solid #fecaca", borderRadius: 7, background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  disabled: { opacity: .55, cursor: "not-allowed" },
  empty: { padding: 54, textAlign: "center", color: "#9ca3af", fontSize: 14 },
  backdrop: { position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(0,0,0,0.4)" },
  modal: { width: "100%", maxWidth: 500, background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f0e8df", boxShadow: "0 24px 60px rgba(0,0,0,0.14)" },
  modalBar: { height: 5, background: "#f97316" },
  modalHead: { display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", borderBottom: "1px solid #f9f0e8" },
  modalIcon: { width: 40, height: 40, borderRadius: 10, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  modalTitle: { margin: 0, fontSize: 15, color: "#1f2937", fontWeight: 700 },
  modalSub: { margin: "3px 0 0", fontSize: 12, color: "#9ca3af" },
  iconBtn: { marginLeft: "auto", border: 0, background: "transparent", color: "#9ca3af", cursor: "pointer", display: "flex", padding: 5 },
  modalBody: { padding: 20, display: "flex", flexDirection: "column", gap: 13 },
  modalFoot: { display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 22px", borderTop: "1px solid #f9f0e8", background: "#fff" },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 13, color: "#374151", fontWeight: 600 },
  fieldInput: { padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 10, outline: 0, fontSize: 13, color: "#1f2937", fontFamily: "inherit" },
  btnCancel: { padding: "9px 20px", border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnDanger: { padding: "9px 20px", border: 0, borderRadius: 9, background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  confirmText: { margin: 0, color: "#374151", lineHeight: 1.6, fontSize: 14 },
};
