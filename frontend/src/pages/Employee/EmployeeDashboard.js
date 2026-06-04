import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import EmployeeSidebar from "./EmployeeSidebar";
import AdvancedFilters from "../../components/AdvancedFilters";
import { hasAccess, ROLES } from "../../utils/authUtils";
import { getAllOrders } from "../../services/apiOrder";
import { getAll as getAllProducts } from "../../services/apiProduct";
import "../Admin/AdminDashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const PERIOD_OPTIONS = ["7 derniers jours", "30 derniers jours", "Ce mois-ci", "Ce trimestre", "Cette année"];
const TABS = ["Aperçu", "Commandes", "Stock"];

const STATUS_STYLES = {
  livré: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "en transit": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  confirmé: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "en attente": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  "en cours": { bg: "#ede9fe", color: "#6d28d9", border: "#c4b5fd" },
  expédié: { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  annulé: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const STATUS_COLORS = {
  livré: "#10b981",
  "en attente": "#fb923c",
  "en cours": "#8b5cf6",
  expédié: "#3b82f6",
  annulé: "#ef4444",
  inconnu: "#94a3b8",
};

const KPI_CONFIG = [
  {
    label: "Chiffre d'affaires",
    valueKey: "totalRevenue",
    format: (v) => `${Number(v || 0).toLocaleString("fr-TN")} DT`,
    change: "+55%",
    changeLabel: "mois précédent",
    iconColor: "#10b981",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: "Commandes",
    valueKey: "totalOrders",
    format: (v) => String(v || 0),
    change: "+12%",
    changeLabel: "activité",
    iconColor: "#3b82f6",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Commandes actives",
    valueKey: "activeOrders",
    format: (v) => String(v || 0),
    change: "En cours",
    changeLabel: "suivi",
    iconColor: "#7c3aed",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      </svg>
    ),
  },
];

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: "rgba(0,0,0,.05)", drawBorder: false }, ticks: { color: "#9ca3af" } },
    y: { grid: { color: "rgba(0,0,0,.05)", drawBorder: false }, ticks: { color: "#9ca3af" } },
  },
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: { legend: { display: false } },
};

const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};
const orderId = (order) => (order._id ? order._id.slice(-6).toUpperCase() : order.id || "TEMP");
const orderAmount = (order) => order.total != null ? `${Number(order.total).toLocaleString("fr-TN")} DT` : order.amount || "0 DT";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Aperçu");
  const [selectedPeriod, setSelectedPeriod] = useState("Ce mois-ci");
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 900 : false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterConfig, setFilterConfig] = useState({
    search: '',
    status: [],
    sort: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      toast.error("Veuillez vous connecter");
      navigate("/login");
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (!hasAccess(parsedUser, [ROLES.MANAGER, ROLES.EMPLOYEE, "employeur"])) {
          toast.error("Accès non autorisé");
          navigate("/login");
          return;
        }
        setUser(parsedUser);
      } catch {
        navigate("/login");
        return;
      }
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersData, productsData] = await Promise.all([getAllOrders({ limit: 50 }), getAllProducts()]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        toast.error("Impossible de récupérer les données.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || order.amount || 0), 0);
    const avgBasket = totalOrders ? totalRevenue / totalOrders : 0;
    const activeOrders = orders.filter((order) =>
      ["en attente", "en cours", "confirmé", "expédié", "pending"].includes(String(order.status || "").toLowerCase())
    ).length;
    return { totalOrders, totalRevenue, avgBasket, activeOrders };
  }, [orders]);

  const statusCounts = useMemo(() => orders.reduce((acc, order) => {
    const key = String(order.status || "inconnu").toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}), [orders]);

  const q = filterConfig.search?.trim().toLowerCase() || '';
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (q) {
      result = result.filter((order) =>
        [order._id, order.id, order.customerName, order.address, order.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (filterConfig.status && filterConfig.status.length > 0) {
      result = result.filter(order =>
        filterConfig.status.includes(order.status?.toLowerCase())
      );
    }

    if (filterConfig.sort) {
      switch (filterConfig.sort) {
        case 'recent':
          result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'older':
          result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'amount_high':
          result = [...result].sort((a, b) => (b.total || 0) - (a.total || 0));
          break;
        case 'amount_low':
          result = [...result].sort((a, b) => (a.total || 0) - (b.total || 0));
          break;
        default:
          break;
      }
    }

    return result;
  }, [orders, filterConfig]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      !q || [product.name, product.productId, product._id, product.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [products, q]);

  const dateStr = time.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const employeeName = user?.name || user?.firstName || user?.username || "";
  const avatarLetters = (employeeName || "EM").slice(0, 2).toUpperCase();

  const statusLabels = Object.keys(statusCounts);
  const donutData = {
    labels: statusLabels.length ? statusLabels.map((label) => label.charAt(0).toUpperCase() + label.slice(1)) : ["Aucune"],
    datasets: [{
      data: statusLabels.length ? statusLabels.map((label) => statusCounts[label]) : [1],
      backgroundColor: statusLabels.length ? statusLabels.map((label) => STATUS_COLORS[label] || "#94a3b8") : ["#e5e7eb"],
      borderWidth: 4,
      borderColor: "#ffffff",
    }],
  };

  const lineData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû"],
    datasets: [{
      label: "Commandes",
      data: [8, 14, 11, 18, Math.max(stats.totalOrders, 3), 15, 20, 16],
      borderColor: "#f97316",
      backgroundColor: "rgba(249, 115, 22, .08)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#f97316",
      pointBorderWidth: 2,
      borderWidth: 2.5,
    }],
  };

  return (
    <div style={S.root}>
      <EmployeeSidebar />

      <main className="employee-main" style={S.main}>
        <div style={S.topbar}>
          <div>
            <h1 style={S.title}>Star Mousse • Espace Employé</h1>
            <div style={S.subtitle}>Gestion & Suivi des Commandes</div>
          </div>

          <div style={S.topbarRight}>
            <div style={S.clock}>{timeStr}</div>
            <div style={S.notifBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span style={S.notifDot}>{stats.activeOrders}</span>
            </div>
            <div style={S.avatar}>{avatarLetters}</div>
            <span style={S.userName}>{dateStr}</span>
          </div>
        </div>

        <div style={S.periodRow}>
          {PERIOD_OPTIONS.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                ...S.periodBtn,
                ...(selectedPeriod === period ? S.periodBtnActive : S.periodBtnInactive),
              }}
            >
              {period}
            </button>
          ))}

          <button onClick={() => navigate("/employer/orders")} style={S.allOrdersBtn}>
            Voir toutes les commandes →
          </button>
        </div>

        <div style={S.kpiGrid}>
          {KPI_CONFIG.map((kpi) => (
            <div key={kpi.valueKey} style={S.kpiCard}>
              <div style={{ ...S.kpiIconBox, background: kpi.iconColor }}>{kpi.icon}</div>
              <div style={S.kpiBody}>
                <div style={S.kpiMeta}>
                  <span style={S.kpiLabel}>{kpi.label}</span>
                  <span style={S.kpiDate}>Mai 2026</span>
                </div>
                <div style={S.kpiValue}>{loading ? "..." : kpi.format(stats[kpi.valueKey])}</div>
                <div style={S.kpiChange}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                  {kpi.change} {kpi.changeLabel}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={S.tabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...S.tabBtn,
                ...(activeTab === tab ? S.tabBtnActive : S.tabBtnInactive),
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Aperçu" && (
          <div style={S.overviewGrid}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h2 style={S.cardTitle}>Activité des commandes</h2>
                  <div style={S.chartLegend}>
                    <span style={S.legendItem}>
                      <span style={{ ...S.legendDot, background: "#f97316" }} />
                      Commandes
                    </span>
                  </div>
                </div>
                <div style={{ height: 220, padding: "12px 20px 16px" }}>
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>

              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h2 style={S.cardTitle}>Commandes récentes</h2>
                  <button style={S.smallLink} onClick={() => setActiveTab("Commandes")}>Voir tout</button>
                </div>
                <OrdersTable orders={filteredOrders.slice(0, 5)} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h2 style={S.cardTitle}>État des commandes</h2>
                </div>
                <div style={{ height: 210, padding: 18 }}>
                  <Doughnut data={donutData} options={donutOptions} />
                </div>
                <div style={S.donutLegend}>
                  {(statusLabels.length ? statusLabels : ["inconnu"]).map((label) => (
                    <div key={label} style={S.donutRow}>
                      <span style={S.donutLabel}>
                        <span style={{ ...S.legendDot, background: STATUS_COLORS[label] || "#94a3b8" }} />
                        {label}
                      </span>
                      <span style={S.donutPct}>{statusCounts[label] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h2 style={S.cardTitle}>Actions rapides</h2>
                </div>
                {[
                  { label: "Gestion des commandes", path: "/employer/orders" },
                  { label: "Consulter le stock", path: "/employer/inventory" },
                  { label: "Mon profil", path: "/employer/profile" },
                ].map((action) => (
                  <button key={action.path} style={S.actionItem} onClick={() => navigate(action.path)}>
                    <span>{action.label}</span>
                    <span>→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Commandes" && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h2 style={S.cardTitle}>🔍 Gestion des commandes</h2>
            </div>
            <AdvancedFilters
              searchPlaceholder="Rechercher par numéro, client, email..."
              filters={[
                {
                  key: 'status',
                  label: 'Statut',
                  type: 'checkbox',
                  options: ['en attente', 'en cours', 'expédié', 'livré', 'annulé', 'confirmé']
                }
              ]}
              sortOptions={[
                { value: 'recent', label: 'Plus récentes' },
                { value: 'older', label: 'Plus anciennes' },
                { value: 'amount_high', label: 'Montant décroissant' },
                { value: 'amount_low', label: 'Montant croissant' }
              ]}
              onFilterChange={(filters) => setFilterConfig(filters)}
            />
            <OrdersTable orders={filteredOrders} />
          </div>
        )}

        {activeTab === "Stock" && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h2 style={S.cardTitle}>📦 Catalogue stock</h2>
            </div>
            <AdvancedFilters
              searchPlaceholder="Rechercher par SKU, nom, catégorie..."
              filters={[
                {
                  key: 'category',
                  label: 'Catégorie',
                  type: 'select',
                  options: [...new Set(products.map(p => p.category).filter(Boolean))]
                }
              ]}
              sortOptions={[
                { value: 'name_asc', label: 'Nom (A-Z)' },
                { value: 'name_desc', label: 'Nom (Z-A)' },
                { value: 'price_high', label: 'Prix décroissant' },
                { value: 'price_low', label: 'Prix croissant' }
              ]}
              onFilterChange={(filters) => setFilterConfig(filters)}
            />
            <StockTable products={filteredProducts} />
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  const key = String(status || "inconnu").toLowerCase();
  const st = STATUS_STYLES[key] || { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };
  return (
    <span style={{ ...S.badge, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
      {key}
    </span>
  );
}

function OrdersTable({ orders }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={S.table}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {["ID", "Client", "Montant", "Date", "Statut"].map((h) => <th key={h} style={S.th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {orders.length ? orders.map((order, i) => (
            <tr key={order._id || order.id || i} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={S.tdStrong}>{orderId(order)}</td>
              <td style={S.td}>{order.customerName || "Client inconnu"}</td>
              <td style={S.tdAmount}>{orderAmount(order)}</td>
              <td style={S.tdMuted}>{fmtDate(order.createdAt || order.date)}</td>
              <td style={S.td}><StatusBadge status={order.status} /></td>
            </tr>
          )) : (
            <tr><td colSpan={5} style={S.emptyCell}>Aucune commande trouvée</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StockTable({ products }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={S.table}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {["SKU / ID", "Nom du produit", "Prix", "Stock"].map((h) => <th key={h} style={S.th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {products.length ? products.map((product, i) => {
            const stock = Number(product.stock || 0);
            return (
              <tr key={product._id || i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={S.tdMuted}>{product.productId || product._id || "-"}</td>
                <td style={S.tdStrong}>{product.name || "Produit"}</td>
                <td style={S.tdAmount}>{product.price ? `${Number(product.price).toLocaleString("fr-TN")} DT` : "N/A"}</td>
                <td style={S.td}>
                  <span style={{
                    ...S.badge,
                    background: stock > 10 ? "#f0fdf4" : "#fffbeb",
                    color: stock > 10 ? "#16a34a" : "#d97706",
                    border: `1px solid ${stock > 10 ? "#bbf7d0" : "#fde68a"}`,
                  }}>
                    {stock} pièces
                  </span>
                </td>
              </tr>
            );
          }) : (
            <tr><td colSpan={4} style={S.emptyCell}>Aucun article trouvé</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const S = {
  root: { display: "flex", minHeight: "100vh", background: "#fdf6ef", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#111827" },
  main: { flex: 1 },
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
  allOrdersBtn: { marginLeft: "auto", padding: "7px 16px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 },
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
  overviewGrid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 },
  card: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 12, overflow: "hidden", padding: 0 },
  cardHeader: { padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 13, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".05em", margin: 0 },
  chartLegend: { display: "flex", gap: 14 },
  legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" },
  legendDot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block", flexShrink: 0 },
  smallLink: { border: "none", background: "transparent", color: "#f97316", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "10px 20px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textAlign: "left", textTransform: "uppercase", letterSpacing: ".05em", borderBottom: "1px solid #e5e7eb" },
  td: { padding: "13px 20px", fontSize: 13, color: "#374151" },
  tdStrong: { padding: "13px 20px", fontSize: 13, fontWeight: 600, color: "#374151" },
  tdAmount: { padding: "13px 20px", fontSize: 13, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" },
  tdMuted: { padding: "13px 20px", fontSize: 12, color: "#9ca3af" },
  badge: { fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 999 },
  emptyCell: { padding: 20, textAlign: "center", color: "#9ca3af" },
  donutLegend: { padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: 10 },
  donutRow: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 },
  donutLabel: { display: "flex", alignItems: "center", gap: 6, color: "#374151" },
  donutPct: { fontWeight: 600, color: "#374151" },
  actionItem: { width: "100%", padding: "14px 20px", border: "none", borderBottom: "1px solid #f3f4f6", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#374151", cursor: "pointer", fontFamily: "inherit", textAlign: "left" },
};
