import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEdit, FiPackage, FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { createProduct, deleteProduct, getAll, updateProduct } from "../../services/apiProduct";
import { getAllCategories } from "../../services/apiCategory";
import { hasAccess, ROLES } from "../../utils/authUtils";

const EMPTY_FORM = { name: "", size: "", price: "", stock: "0", category: "" };

const getDimension = (product) => {
  if (product.size) return product.size;
  const match = product.name?.match(/(\d+x\d+)/i);
  return match ? match[1] : "-";
};

const getDisplayName = (product) => {
  if (!product.name) return "-";
  // Remove dimension from name (e.g., "soft 190/100" -> "soft")
  const cleaned = product.name.replace(/\s+(\d+x\d+|\d+\/\d+)$/i, "").trim();
  return cleaned || product.name;
};

const stockBadge = (stock) => {
  const qty = Number(stock) || 0;
  if (qty === 0) return { label: "Rupture", bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
  if (qty < 20) return { label: `${qty} en stock`, bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
  return { label: `${qty} en stock`, bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
};

const categoryName = (product) =>
  typeof product.category === "string" ? product.category : product.category?.name || "-";

const pad = (n) => String(n).padStart(2, "0");

export default function Stock({
  Sidebar = AdminSidebar,
  sidebarWidth = 220,
  sidebarProps = {},
  allowedRoles = [ROLES.ADMIN],
  loginPath = "/login/admin",
  unauthorizedMessage = "Accès réservé à l'administrateur",
  unauthorizedRedirect = "/",
  defaultStock = 0,
}) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM, stock: String(defaultStock) });
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([getAll(), getAllCategories()]);
      const categoryMap = {};
      if (Array.isArray(categoriesData)) {
        categoriesData.forEach(cat => {
          categoryMap[cat._id] = cat.name;
        });
      }
      const enrichedProducts = (Array.isArray(productsData) ? productsData : []).map(product => ({
        ...product,
        category: typeof product.category === "string" ? categoryMap[product.category] || product.category : product.category?.name || product.category
      }));
      setProducts(enrichedProducts);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      toast.error("Impossible de charger le stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      toast.error("Veuillez vous connecter");
      navigate(loginPath);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (!hasAccess(user, allowedRoles)) {
        toast.error(unauthorizedMessage);
        navigate(unauthorizedRedirect);
        return;
      }
    } catch {
      navigate(loginPath);
      return;
    }

    fetchData();
  }, [navigate, loginPath, unauthorizedMessage, unauthorizedRedirect, allowedRoles]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const defaultCategoryId = categories[0]?._id || "";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.productId, p._id, categoryName(p), getDimension(p)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [products, search]);

  const stats = useMemo(() => {
    const totalUnits = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
    const lowStock = products.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) < 20).length;
    const outStock = products.filter((p) => Number(p.stock || 0) === 0).length;
    return { totalProducts: products.length, totalUnits, lowStock, outStock };
  }, [products]);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, stock: String(defaultStock), category: defaultCategoryId });
    setModal("add");
  };

  const openEdit = (product) => {
    setForm({
      name: getDisplayName(product),
      size: getDimension(product) === "-" ? "" : getDimension(product),
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0),
      category: product.category?._id || product.category || defaultCategoryId,
    });
    setModal({ mode: "edit", product });
  };

  const closeModal = () => {
    setModal(null);
    setForm({ ...EMPTY_FORM, stock: String(defaultStock) });
  };

  const handleSave = async () => {
    if (!form.name.trim() || form.price === "" || form.stock === "" || !form.category) {
      toast.warning("Remplissez tous les champs obligatoires");
      return;
    }

    const payload = {
      name: form.size.trim() ? `${form.name.trim()} ${form.size.trim()}` : form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      size: form.size.trim() || undefined,
    };

    setSaving(true);
    try {
      if (modal === "add") {
        await createProduct(payload);
        toast.success("Produit ajouté");
      } else {
        await updateProduct(modal.product._id, payload);
        toast.success("Produit mis à jour");
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("Produit supprimé");
      setConfirmId(null);
      fetchData();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const dateStr = time.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <div style={S.root}>
      <Sidebar {...sidebarProps} />

      <main className="admin-main sm-internal-main" style={{ ...S.main, marginLeft: sidebarWidth }}>
        <div style={S.topbar}>
          <div>
            <h1 style={S.title}>Gestion du stock</h1>
            <div style={S.subtitle}>Produits et disponibilités</div>
          </div>

          <div style={S.topbarRight}>
            <div style={S.avatar}>SM</div>
            <span style={S.userName}>{dateStr}</span>
          </div>
        </div>

        <div style={S.periodRow}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 14px", flex: 1 }}>
              <svg className="search" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ width: 16, height: 16, flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Rechercher produit, catégorie…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1f2937", flex: 1, fontFamily: "inherit" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16, padding: 2 }}>×</button>
              )}
            </div>
          </div>

          <button type="button" onClick={fetchData} style={S.allOrdersBtn}>
            <FiRefreshCw size={14} /> Actualiser
          </button>
          <button type="button" onClick={openAdd} style={S.addBtn}>
            <FiPlus size={15} /> Ajouter un produit
          </button>
        </div>

        <div style={S.kpiGrid}>
          <KpiCard icon={<FiPackage size={24} color="#fff" />} color="#10b981" label="Références" value={stats.totalProducts} />
          <KpiCard icon={<FiPackage size={24} color="#fff" />} color="#3b82f6" label="Unités totales" value={stats.totalUnits} />
          <KpiCard icon={<FiPackage size={24} color="#fff" />} color="#f97316" label="Stock faible" value={stats.lowStock} />
          <KpiCard icon={<FiPackage size={24} color="#fff" />} color="#ef4444" label="Ruptures" value={stats.outStock} />
        </div>

        <div style={S.tabsRow}>
          <button type="button" style={{ ...S.tabBtn, ...S.tabBtnActive }}>Catalogue</button>
          <button type="button" style={{ ...S.tabBtn, ...S.tabBtnInactive }}>Alertes</button>
          <button type="button" style={{ ...S.tabBtn, ...S.tabBtnInactive }}>Catégories</button>
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}>
            <h2 style={S.cardTitle}>Catalogue produits</h2>
            <span style={S.cardSub}>
              {loading ? "Chargement..." : `${filtered.length} produit(s) · ${stats.totalUnits} unités`}
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Produit", "Dimensions", "Catégorie", "Prix HT", "Quantité", "Actions"].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} style={S.emptyCell}>Chargement...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6} style={S.emptyCell}>Aucun produit trouvé.</td></tr>
                )}
                {!loading && filtered.map((product) => {
                  const badge = stockBadge(product.stock);
                  return (
                    <tr key={product._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={S.tdStrong}>{getDisplayName(product)}</td>
                      <td style={S.tdMuted}>{getDimension(product)}</td>
                      <td style={S.td}>{categoryName(product)}</td>
                      <td style={S.tdAmount}>{Number(product.price || 0).toLocaleString("fr-TN")} DT</td>
                      <td style={S.td}>
                        <span style={{ ...S.badge, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={S.td}>
                        <div style={S.rowActions}>
                          <button type="button" onClick={() => openEdit(product)} style={S.iconEdit}>
                            <FiEdit size={13} />
                          </button>
                          <button type="button" onClick={() => setConfirmId(product._id)} style={S.iconDelete}>
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modal && (
        <ProductModal
          modal={modal}
          form={form}
          setForm={setForm}
          categories={categories}
          saving={saving}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {confirmId && (
        <ConfirmDelete
          onClose={() => setConfirmId(null)}
          onConfirm={() => handleDelete(confirmId)}
        />
      )}
    </div>
  );
}

function KpiCard({ icon, color, label, value }) {
  return (
    <div style={S.kpiCard}>
      <div style={{ ...S.kpiIconBox, background: color }}>{icon}</div>
      <div style={S.kpiBody}>
        <div style={S.kpiMeta}>
          <span style={S.kpiLabel}>{label}</span>
          <span style={S.kpiDate}>Mai 2026</span>
        </div>
        <div style={S.kpiValue}>{value}</div>
        <div style={S.kpiChange}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          Actualisé
        </div>
      </div>
    </div>
  );
}

function ProductModal({ modal, form, setForm, categories, saving, onClose, onSave }) {
  return (
    <div style={S.backdrop}>
      <div style={S.modal}>
        <div style={S.modalBar} />
        <div style={S.modalHead}>
          <div style={S.modalIcon}><FiPackage size={18} color="#f97316" /></div>
          <div>
            <h3 style={S.modalTitle}>{modal === "add" ? "Nouveau produit" : "Modifier le produit"}</h3>
            <p style={S.modalSub}>Renseignez les informations du produit.</p>
          </div>
        </div>

        <div style={S.modalBody}>
          {[
            { label: "Nom", key: "name", type: "text", placeholder: "Nom du produit" },
            { label: "Dimensions", key: "size", type: "text", placeholder: "160x200" },
            { label: "Prix (DT)", key: "price", type: "number", placeholder: "" },
            { label: "Stock", key: "stock", type: "number", placeholder: "" },
          ].map(({ label, key, type, placeholder }) => (
            <label key={key} style={S.field}>
              <span style={S.fieldLabel}>{label}</span>
              <input
                type={type}
                placeholder={placeholder}
                style={S.fieldInput}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </label>
          ))}
          <label style={S.field}>
            <span style={S.fieldLabel}>Catégorie</span>
            <select
              style={S.fieldInput}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              <option value="">- Choisir -</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={S.modalFoot}>
          <button type="button" onClick={onClose} style={S.btnCancel}>Annuler</button>
          <button type="button" onClick={onSave} disabled={saving} style={{ ...S.btnPrimary, ...(saving ? S.disabled : {}) }}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDelete({ onClose, onConfirm }) {
  return (
    <div style={S.backdrop}>
      <div style={{ ...S.modal, maxWidth: 390 }}>
        <div style={{ ...S.modalBar, background: "#dc2626" }} />
        <div style={S.modalHead}>
          <div style={{ ...S.modalIcon, background: "#fef2f2" }}>
            <FiTrash2 size={18} color="#dc2626" />
          </div>
          <div>
            <h3 style={S.modalTitle}>Supprimer ce produit ?</h3>
            <p style={S.modalSub}>Cette action est irréversible.</p>
          </div>
        </div>
        <div style={S.modalFoot}>
          <button type="button" onClick={onClose} style={S.btnCancel}>Annuler</button>
          <button type="button" onClick={onConfirm} style={S.btnDanger}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

const S = {
  root: { display: "flex", minHeight: "100vh", background: "#fdf6ef", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#111827" },
  main: { flex: 1, padding: "28px 32px" },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 },
  title: { fontSize: 38, fontWeight: 700, color: "#1f2937", margin: "0 0 6px", whiteSpace: "nowrap" },
  subtitle: { fontSize: 13, color: "#6b7280", fontWeight: 600 },
  topbarRight: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  clock: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "7px 14px", fontVariantNumeric: "tabular-nums", fontSize: 15, fontWeight: 600, color: "#374151", letterSpacing: 1 },
  notifBtn: { position: "relative", cursor: "pointer", padding: 4 },
  notifDot: { position: "absolute", top: 0, right: 0, minWidth: 16, height: 16, padding: "0 4px", background: "#f97316", borderRadius: 999, fontSize: 9, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #fb923c, #ef4444)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, flexShrink: 0 },
  userName: { fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" },
  periodRow: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" },
  periodBtn: { padding: "7px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer", fontFamily: "inherit", border: "1px solid transparent", transition: "all .15s" },
  periodBtnActive: { background: "#111827", color: "#fff", border: "1px solid #111827" },
  periodBtnInactive: { background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb" },
  searchWrap: { flex: "none", width: "auto", marginLeft: 12 },
  allOrdersBtn: { marginLeft: "auto", padding: "7px 16px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, display: "flex", alignItems: "center", gap: 6 },
  addBtn: { padding: "8px 16px", background: "#f97316", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  kpiCard: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 },
  kpiIconBox: { width: 54, height: 54, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  kpiBody: { flex: 1, minWidth: 0 },
  kpiMeta: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  kpiLabel: { fontSize: 12, color: "#9ca3af", fontWeight: 500 },
  kpiDate: { fontSize: 11, color: "#d1d5db" },
  kpiValue: { fontSize: 22, fontWeight: 700, color: "#1f2937", marginBottom: 4 },
  kpiChange: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#10b981", fontWeight: 500 },
  tabsRow: { display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: 24 },
  tabBtn: { padding: "10px 20px", border: "none", background: "transparent", fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginBottom: -1, transition: "all .15s" },
  tabBtnActive: { borderBottom: "2px solid #f97316", color: "#f97316", fontWeight: 600 },
  tabBtnInactive: { borderBottom: "2px solid transparent", color: "#9ca3af", fontWeight: 400 },
  card: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 12, overflow: "hidden", padding: 0 },
  cardHeader: { padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 13, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".05em", margin: 0 },
  cardSub: { fontSize: 12, color: "#9ca3af" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textAlign: "left", textTransform: "uppercase", letterSpacing: ".05em", borderBottom: "1px solid #e5e7eb" },
  td: { padding: "13px 20px", fontSize: 13, color: "#374151" },
  tdStrong: { padding: "13px 20px", fontSize: 13, fontWeight: 600, color: "#374151" },
  tdAmount: { padding: "13px 20px", fontSize: 13, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" },
  tdMuted: { padding: "13px 20px", fontSize: 12, color: "#9ca3af" },
  badge: { fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap" },
  rowActions: { display: "flex", gap: 6 },
  iconEdit: { background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, padding: "5px 8px", color: "#d97706", cursor: "pointer" },
  iconDelete: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 8px", color: "#dc2626", cursor: "pointer" },
  emptyCell: { padding: 32, color: "#9ca3af", textAlign: "center" },
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fff", borderRadius: 16, border: "1px solid #f0e8df", width: "100%", maxWidth: 460, boxShadow: "0 24px 60px rgba(0,0,0,0.14)", overflow: "hidden" },
  modalBar: { height: 5, background: "#f97316" },
  modalHead: { display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", borderBottom: "1px solid #f9f0e8" },
  modalIcon: { width: 40, height: 40, borderRadius: 10, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  modalTitle: { margin: 0, fontSize: 15, color: "#1f2937", fontWeight: 700 },
  modalSub: { margin: "3px 0 0", fontSize: 12, color: "#9ca3af" },
  modalBody: { padding: 20, display: "flex", flexDirection: "column", gap: 13 },
  modalFoot: { display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 22px", borderTop: "1px solid #f9f0e8", background: "#fff" },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 13, color: "#374151", fontWeight: 600 },
  fieldInput: { padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 10, outline: 0, fontSize: 13, color: "#1f2937", fontFamily: "inherit", background: "#fff" },
  btnCancel: { padding: "9px 20px", border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnPrimary: { padding: "9px 20px", border: 0, borderRadius: 9, background: "#f97316", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnDanger: { padding: "9px 20px", border: 0, borderRadius: 9, background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  disabled: { opacity: .55, cursor: "not-allowed" },
};
