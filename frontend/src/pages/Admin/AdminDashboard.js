import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { hasAccess, ROLES } from "../../utils/authUtils";
import { checkApiHealth } from "../../services/apiHealth";
import { getAllOrders } from "../../services/apiOrder";
import { getAll as getAllProducts } from "../../services/apiProduct";
import { getAllUsers } from "../../services/apiUser";
import { deleteReview, getAllReviews } from "../../services/apiReview";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

/* ─── Constantes ──────────────────────────────────────────────────────────── */
const PERIOD_OPTIONS = [
  "7 derniers jours",
  "30 derniers jours",
  "Ce mois-ci",
  "Ce trimestre",
  "Cette année",
];
const TABS = ["Aperçu", "Statistiques", "Commandes", "Matelas", "Clients", "Avis"];

const MOCK_ORDERS = [
  {
    id: "#7841",
    name: "Amira Ben Salah",
    amount: "1 890 DT",
    status: "livré",
    date: "18/05/2024",
  },
  {
    id: "#7840",
    name: "Imed Trabelsi",
    amount: "1 590 DT",
    status: "en transit",
    date: "19/05/2024",
  },
  {
    id: "#7839",
    name: "Sonia Mejri",
    amount: "1 290 DT",
    status: "livré",
    date: "17/05/2024",
  },
];

const STOCK_ALERTS = [
  {
    id: 1,
    name: "Super Siesta Orthopédique",
    sku: "SS-ORTHO-01",
    tag: "Rupture",
    tagStyle: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  },
  {
    id: 2,
    name: "Super Siesta Aloe Vera",
    sku: "SS-ALOE-07",
    tag: "3 restants",
    tagStyle: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  },
];

const STATUS_STYLES = {
  livré: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "en transit": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  confirmé: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  annulé: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const STATUS_COLORS = {
  livré: "#10b981",
  "en transit": "#f97316",
  confirmé: "#3b82f6",
  annulé: "#ef4444",
  "en attente": "#fb923c",
  expédié: "#8b5cf6",
  inconnu: "#94a3b8",
};

const KPI_CONFIG = [
  {
    label: "Chiffre d'affaires",
    valueKey: "totalRevenue",
    format: (v) => `${Number(v || 0).toLocaleString("fr-TN")} DT`,
    change: "+55%",
    changeLabel: "mois précédent",
    trend: "up",
    iconColor: "#10b981",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
    changeLabel: "mois précédent",
    trend: "up",
    iconColor: "#3b82f6",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Clients actifs",
    valueKey: "clientsActifs",
    format: (v) => String(v || 0),
    change: "+8%",
    changeLabel: "mois précédent",
    trend: "up",
    iconColor: "#7c3aed",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 11a4 4 0 00-7.88-1.34" />
      </svg>
    ),
  },
];

/* ─── Revenue Chart ───────────────────────────────────────────────────────── */
const revenueChartData = {
  labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû"],
  datasets: [
    {
      label: "Google Ads",
      data: [70, 210, 175, 140, 130, 110, 110, 25],
      borderColor: "#10b981",
      backgroundColor: "transparent",
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#10b981",
      pointBorderWidth: 2,
      borderWidth: 2.5,
    },
    {
      label: "Facebook Ads",
      data: [25, 110, 55, 50, 105, 305, 120, 170],
      borderColor: "#f97316",
      backgroundColor: "transparent",
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2.5,
    },
  ],
};

const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1f2937",
      titleColor: "#f9fafb",
      bodyColor: "#d1d5db",
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(0,0,0,.05)", drawBorder: false },
      ticks: { font: { size: 12 }, color: "#9ca3af" },
    },
    y: {
      grid: { color: "rgba(0,0,0,.05)", drawBorder: false },
      ticks: { font: { size: 12 }, color: "#9ca3af" },
      min: 0,
      max: 400,
    },
  },
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
};

/* ─── Composant Principal ─────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Aperçu");
  const [selectedPeriod, setSelectedPeriod] = useState("Ce mois-ci");
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 900 : false);
  const [statsSummary, setStatsSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgBasket: 0,
    clientsActifs: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");

  /* ── Auth + data fetch ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      toast.error("Veuillez vous connecter");
      navigate("/login/admin");
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAdminName(
          parsedUser?.name ||
            parsedUser?.firstName ||
            parsedUser?.username ||
            ""
        );
        if (!hasAccess(parsedUser, [ROLES.ADMIN])) {
          toast.error("Accès non autorisé");
          navigate("/login/admin");
          return;
        }
      } catch {
        navigate("/login/admin");
        return;
      }
    }

    checkApiHealth().catch(() =>
      toast.warn("API indisponible : démarrez le backend et MongoDB.")
    );

    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersData, productsData, usersData, reviewsData] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
          getAllUsers(),
          getAllReviews(),
        ]);

        const allOrders = Array.isArray(ordersData) ? ordersData : [];
        const allProducts = Array.isArray(productsData) ? productsData : [];
        const allUsers = Array.isArray(usersData) ? usersData : [];
        const allReviews = Array.isArray(reviewsData) ? reviewsData : [];

        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce(
          (sum, o) => sum + Number(o.total || o.amount || 0),
          0
        );
        const avgBasket = totalOrders ? totalRevenue / totalOrders : 0;
        const clientsActifs = new Set(
          allOrders.map((o) =>
            (
              o.customerEmail ||
              o.customerName ||
              o.phone ||
              "client"
            )
              .toString()
              .toLowerCase()
          )
        ).size;

        const usersCount = allUsers.filter(
          (u) => String(u.role).toLowerCase() === "client"
        ).length;

        const statusSummary = allOrders.reduce((acc, o) => {
          const key = String(o.status || "inconnu").toLowerCase();
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        setStatsSummary({
          totalRevenue,
          totalOrders,
          avgBasket,
          clientsActifs,
          totalProducts: allProducts.length,
          totalClients: usersCount,
        });
        setStatusCounts(statusSummary);
        setOrders(allOrders);
        setRecentOrders(allOrders.slice(0, 5));
        setProducts(allProducts);
        setUsers(allUsers);
        setReviews(allReviews);
      } catch (e) {
        console.error(e);
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

  /* ── Horloge ── */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const DAYS = [
    "Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi",
  ];
  const MONTHS = [
    "janvier","février","mars","avril","mai","juin",
    "juillet","août","septembre","octobre","novembre","décembre",
  ];
  const dateStr = `${DAYS[time.getDay()]} ${time.getDate()} ${MONTHS[time.getMonth()]}`;
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  /* ── Donut data ── */
  const orderStatusLabels = Object.keys(statusCounts).filter(Boolean);
  const orderStatusData = orderStatusLabels.map((l) => statusCounts[l] || 0);
  const orderStatusColors = orderStatusLabels.map(
    (l) => STATUS_COLORS[l] || "#94a3b8"
  );
  const orderStatusLegend = orderStatusLabels.map((l) => ({
    label: l.charAt(0).toUpperCase() + l.slice(1),
    count: statusCounts[l],
    color: STATUS_COLORS[l] || "#94a3b8",
  }));

  /* ── Stock alerts ── */
  const productStockAlerts = products.length
    ? products
        .filter((item) => Number(item.stock || 0) <= 10)
        .slice(0, 5)
        .map((item, idx) => ({
          id: item._id || item.productId || idx,
          name: item.name,
          sku: item.productId || item._id || `P-${idx}`,
          tag:
            Number(item.stock || 0) === 0
              ? "Rupture"
              : `${Number(item.stock || 0)} restants`,
          tagStyle:
            Number(item.stock || 0) === 0
              ? { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" }
              : { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
        }))
    : STOCK_ALERTS;

  const ordersDonutData = {
    labels: orderStatusLabels.length
      ? orderStatusLabels.map((l) => l.charAt(0).toUpperCase() + l.slice(1))
      : ["Livré", "En transit", "Confirmé", "Annulé"],
    datasets: [
      {
        data: orderStatusLabels.length
          ? orderStatusData
          : [38, 22, 12, 28],
        backgroundColor: orderStatusLabels.length
          ? orderStatusColors
          : ["#f97316", "#10b981", "#06b6d4", "#ef4444"],
        borderWidth: 4,
        borderColor: "#ffffff",
        hoverOffset: 6,
      },
    ],
  };

  /* ── Filtrage ── */
  const q = searchTerm.toLowerCase();

  const filteredOrders = orders.filter(
    (o) =>
      (o._id || o.id || "").toLowerCase().includes(q) ||
      (o.customerName || o.name || "").toLowerCase().includes(q)
  );

  const filteredProducts = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.productId || p._id || "").toLowerCase().includes(q)
  );

  const filteredUsers = users.filter(
    (u) =>
      (u.name || u.firstName || u.username || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
  );

  const filteredReviews = reviews.filter((review) => {
    const userName = review.user?.username || review.user?.name || review.user?.email || "";
    const productName = review.product?.name || review.productName || "";
    const matchesSearch = (
      userName.toLowerCase().includes(q) ||
      productName.toLowerCase().includes(q) ||
      (review.comment || "").toLowerCase().includes(q)
    );
    const matchesRating = reviewRatingFilter === "all" || Number(review.rating) === Number(reviewRatingFilter);
    return matchesSearch && matchesRating;
  });

  const reviewAverage = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Supprimer cet avis ?")) return;
    try {
      await deleteReview(id);
      setReviews((current) => current.filter((review) => review._id !== id));
      toast.success("Avis supprimé.");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de supprimer l'avis.");
    }
  };

  /* ── Render ── */
  return (
    <div style={S.root}>
      <AdminSidebar />

      <main className="admin-main" style={S.main}>
        {/* ── Topbar ── */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.title}>
              Bienvenue{adminName ? `, ${adminName}` : ""}
            </h1>
            <div style={S.subtitle}>Tableau de bord</div>
          </div>

          <div style={S.topbarRight}>
            <div style={S.clock}>{timeStr}</div>
            <div style={S.notifBtn}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span style={S.notifDot}>1</span>
            </div>
            <div style={S.avatar}>AM</div>
            <span style={S.userName}>{dateStr}</span>
          </div>
        </div>

        {/* ── Period selector + Search ── */}
        <div style={S.periodRow}>
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              style={{
                ...S.periodBtn,
                ...(selectedPeriod === p
                  ? S.periodBtnActive
                  : S.periodBtnInactive),
              }}
            >
              {p}
            </button>
          ))}

          <div className="dashboard-search" style={S.searchWrap}>
            <div className="fancy-bg" />
            <label>
              <svg
                className="search"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#949faa"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                required
                className="input"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                className="close-btn"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            </label>
          </div>

          <button
            onClick={() => setActiveTab("Commandes")}
            style={S.allOrdersBtn}
          >
            Voir toutes les commandes →
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <div style={S.kpiGrid}>
          {KPI_CONFIG.map((kpi, i) => (
            <div key={i} style={S.kpiCard}>
              <div style={{ ...S.kpiIconBox, background: kpi.iconColor }}>
                {kpi.icon}
              </div>
              <div style={S.kpiBody}>
                <div style={S.kpiMeta}>
                  <span style={S.kpiLabel}>{kpi.label}</span>
                  <span style={S.kpiDate}>Mai 2026</span>
                </div>
                <div style={S.kpiValue}>
                  {loading ? "…" : kpi.format(statsSummary[kpi.valueKey])}
                </div>
                <div style={S.kpiChange}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                  {kpi.change} {kpi.changeLabel}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
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

        {/* ══ Aperçu ══ */}
        {activeTab === "Aperçu" && (
          <div style={S.overviewGrid}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Revenue Chart */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h2 style={S.cardTitle}>Revenus</h2>
                  <div style={S.chartLegend}>
                    <span style={S.legendItem}>
                      <span style={{ ...S.legendDot, background: "#10b981" }} />
                      Google Ads
                    </span>
                    <span style={S.legendItem}>
                      <span style={{ ...S.legendDot, background: "#f97316" }} />
                      Facebook Ads
                    </span>
                  </div>
                </div>
                <div style={{ height: 220, padding: "12px 20px 16px" }}>
                  <Line data={revenueChartData} options={revenueChartOptions} />
                </div>
              </div>

              {/* Recent Orders */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h2 style={S.cardTitle}>Commandes récentes</h2>
                </div>
                <table style={S.table}>
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      {["ID", "Client", "Montant", "Date", "Statut"].map(
                        (h) => (
                          <th key={h} style={S.th}>
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(recentOrders.length > 0
                      ? recentOrders
                      : MOCK_ORDERS
                    ).map((o, i) => (
                      <OrderRow key={o._id || o.id || i} order={o} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Donut */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h2 style={S.cardTitle}>Commandes par statut</h2>
                </div>
                <div style={{ height: 160, padding: "12px 20px 0" }}>
                  <Doughnut data={ordersDonutData} options={donutOptions} />
                </div>
                <div style={S.donutLegend}>
                  {(orderStatusLabels.length
                    ? orderStatusLegend
                    : [
                        { label: "Livré", count: 38, color: "#f97316" },
                        { label: "En transit", count: 22, color: "#10b981" },
                        { label: "Confirmé", count: 12, color: "#06b6d4" },
                        { label: "Annulé", count: 28, color: "#ef4444" },
                      ]
                  ).map((item) => (
                    <div key={item.label} style={S.donutRow}>
                      <div style={S.donutLabel}>
                        <span
                          style={{
                            ...S.legendDot,
                            background: item.color,
                          }}
                        />
                        {item.label}
                      </div>
                      <span style={S.donutPct}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Alerts */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h2 style={S.cardTitle}>Alertes stock</h2>
                </div>
                {productStockAlerts.map((a) => (
                  <AlertItem key={a.id} alert={a} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ Statistiques ══ */}
        {activeTab === "Statistiques" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                title: "Total commandes",
                value: statsSummary.totalOrders,
                desc: "Commandes enregistrées sur la période.",
              },
              {
                title: "Chiffre d'affaires",
                value: `${statsSummary.totalRevenue.toLocaleString("fr-TN")} DT`,
                desc: "Valeur totale des commandes.",
              },
              {
                title: "Panier moyen",
                value: `${Math.round(statsSummary.avgBasket).toLocaleString("fr-TN")} DT`,
                desc: "Valeur moyenne par commande.",
              },
              {
                title: "Clients actifs",
                value: statsSummary.clientsActifs,
                desc: "Clients uniques ayant passé une commande.",
              },
            ].map((s, i) => (
              <div key={i} style={S.card}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    padding: "16px 20px 0",
                  }}
                >
                  {s.title}
                </h3>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#111827",
                    padding: "10px 20px 16px",
                  }}
                >
                  {s.value}
                </div>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: 13,
                    padding: "0 20px 16px",
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ══ Commandes ══ */}
        {activeTab === "Commandes" && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h2 style={S.cardTitle}>Gestion Générale des Commandes</h2>
            </div>
            <table style={S.table}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["ID", "Client", "Montant", "Date", "Statut"].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o, i) => (
                    <OrderRow key={o._id || o.id || i} order={o} />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#9ca3af",
                      }}
                    >
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ══ Matelas ══ */}
        {activeTab === "Matelas" && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h2 style={S.cardTitle}>
                Catalogue Matelas &amp; Oreillers Star Mousse
              </h2>
            </div>
            <table style={S.table}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {[
                    "SKU / ID",
                    "Nom du Produit",
                    "Prix Unitaire",
                    "Stock Disponible",
                  ].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p, i) => (
                    <tr
                      key={p._id || i}
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: 12,
                          color: "#6b7280",
                        }}
                      >
                        {p.productId || p._id}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {p.name}
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 13 }}>
                        {p.price
                          ? `${Number(p.price).toLocaleString("fr-TN")} DT`
                          : "N/A"}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background:
                              Number(p.stock || 0) > 10
                                ? "#e6f4ea"
                                : "#feeedb",
                            color:
                              Number(p.stock || 0) > 10
                                ? "#137333"
                                : "#b06000",
                          }}
                        >
                          {p.stock ?? 0} pièces
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#9ca3af",
                      }}
                    >
                      Aucun article trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ══ Clients ══ */}
        {activeTab === "Clients" && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h2 style={S.cardTitle}>Liste des Clients enregistrés</h2>
            </div>
            <table style={S.table}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Nom complet", "Email", "Rôle"].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, i) => (
                    <tr
                      key={u._id || i}
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {u.name || u.firstName || u.username}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: 13,
                          color: "#4b5563",
                        }}
                      >
                        {u.email}
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 12 }}>
                        <span
                          style={{
                            background: "#f3f4f6",
                            padding: "2px 6px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                          }}
                        >
                          {u.role || "client"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#9ca3af",
                      }}
                    >
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ══ Avis ══ */}
        {activeTab === "Avis" && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h2 style={S.cardTitle}>Avis des utilisateurs</h2>
              <div style={S.reviewHeaderTools}>
                <span style={S.reviewSummaryPill}>{reviews.length} avis</span>
                <span style={S.reviewSummaryPill}>{reviewAverage.toFixed(1)}/5 moyenne</span>
                <select
                  value={reviewRatingFilter}
                  onChange={(event) => setReviewRatingFilter(event.target.value)}
                  style={S.reviewSelect}
                >
                  <option value="all">Toutes les notes</option>
                  <option value="5">5 etoiles</option>
                  <option value="4">4 etoiles</option>
                  <option value="3">3 etoiles</option>
                  <option value="2">2 etoiles</option>
                  <option value="1">1 etoile</option>
                </select>
              </div>
            </div>
            <table style={S.table}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Client", "Produit", "Note", "Commentaire", "Date", "Analyse", "Action"].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <tr key={review._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 600 }}>
                        {review.user?.username || review.user?.name || review.user?.email || "Client"}
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 13 }}>
                        {review.product?.name || review.productName || "Produit Star Mousse"}
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "#b45309", whiteSpace: "nowrap" }}>
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "#4b5563", maxWidth: 360 }}>
                        {review.comment || "-"}
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 12, color: "#9ca3af" }}>
                        {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString("fr-FR") : "-"}
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 12 }}>
                        <span
                          style={{
                            background: review.sentiment?.source === "bert" ? "#ecfdf5" : "#f3f4f6",
                            color: review.sentiment?.source === "bert" ? "#047857" : "#6b7280",
                            padding: "3px 8px",
                            borderRadius: 999,
                            fontWeight: 700,
                          }}
                        >
                          {review.sentiment?.source === "bert" ? "BERT" : "Note client"}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review._id)}
                          style={{
                            border: "none",
                            borderRadius: 8,
                            padding: "7px 10px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#9ca3af",
                      }}
                    >
                      Aucun avis trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Sous-composants ─────────────────────────────────────────────────────── */
function OrderRow({ order }) {
  const id = order._id || order.id || "N/A";
  const name = order.customerName || order.name || "Client inconnu";
  const amount =
    order.total != null
      ? `${Number(order.total).toLocaleString("fr-TN")} DT`
      : order.amount || "0 DT";
  const dateValue = order.createdAt
    ? new Date(order.createdAt)
    : order.date
    ? new Date(order.date)
    : null;
  const date = dateValue
    ? dateValue.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
  const status = (order.status || "N/A").toLowerCase();
  const st = STATUS_STYLES[status] || {
    bg: "#f3f4f6",
    color: "#6b7280",
    border: "#e5e7eb",
  };

  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      <td
        style={{
          padding: "13px 20px",
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        {id}
      </td>
      <td style={{ padding: "13px 20px", fontSize: 13, color: "#374151" }}>
        {name}
      </td>
      <td
        style={{
          padding: "13px 20px",
          fontSize: 13,
          fontWeight: 600,
          color: "#111827",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {amount}
      </td>
      <td
        style={{ padding: "13px 20px", fontSize: 12, color: "#9ca3af" }}
      >
        {date}
      </td>
      <td style={{ padding: "13px 20px" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            padding: "3px 10px",
            borderRadius: 999,
            background: st.bg,
            color: st.color,
            border: `1px solid ${st.border}`,
          }}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

function AlertItem({ alert }) {
  const { bg, color, border } = alert.tagStyle;
  return (
    <div
      style={{
        padding: "14px 20px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#111827",
            marginBottom: 2,
          }}
        >
          {alert.name}
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>{alert.sku}</div>
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          padding: "3px 10px",
          borderRadius: 999,
          background: bg,
          color,
          border: `1px solid ${border}`,
        }}
      >
        {alert.tag}
      </span>
    </div>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const S = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#fdf6ef",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#111827",
  },
  main: {
    flex: 1,
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  title: {
    fontSize: 38,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 6,
    whiteSpace: "nowrap",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 600,
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  clock: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "7px 14px",
    fontVariantNumeric: "tabular-nums",
    fontSize: 15,
    fontWeight: 600,
    color: "#374151",
    letterSpacing: 1,
  },
  notifBtn: {
    position: "relative",
    cursor: "pointer",
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    background: "#f97316",
    borderRadius: "50%",
    fontSize: 9,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #fb923c, #ef4444)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 13,
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    color: "#6b7280",
    whiteSpace: "nowrap",
  },
  periodRow: {
    display: "flex",
    gap: 8,
    marginBottom: 24,
    flexWrap: "wrap",
    alignItems: "center",
  },
  periodBtn: {
    padding: "7px 16px",
    borderRadius: 999,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    border: "1px solid transparent",
    transition: "all .15s",
  },
  periodBtnActive: {
    background: "#111827",
    color: "#fff",
    border: "1px solid #111827",
  },
  periodBtnInactive: {
    background: "#fff",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
  },
  searchWrap: {
    flex: "none",
    width: "auto",
    marginLeft: 12,
  },
  allOrdersBtn: {
    marginLeft: "auto",
    padding: "7px 16px",
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    background: "#fff",
    border: "1px solid #f0e8df",
    borderRadius: 12,
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  kpiIconBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  kpiBody: {
    flex: 1,
    minWidth: 0,
  },
  kpiMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: 500,
  },
  kpiDate: {
    fontSize: 11,
    color: "#d1d5db",
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 4,
  },
  kpiChange: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    color: "#10b981",
    fontWeight: 500,
  },
  tabsRow: {
    display: "flex",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: 24,
  },
  tabBtn: {
    padding: "10px 20px",
    border: "none",
    background: "transparent",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: -1,
    transition: "all .15s",
  },
  tabBtnActive: {
    borderBottom: "2px solid #f97316",
    color: "#f97316",
    fontWeight: 600,
  },
  tabBtnInactive: {
    borderBottom: "2px solid transparent",
    color: "#9ca3af",
    fontWeight: 400,
  },
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: 20,
  },
  card: {
    background: "#fff",
    border: "1px solid #f0e8df",
    borderRadius: 12,
    overflow: "hidden",
    padding: 0,
  },
  cardHeader: {
    padding: "14px 20px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: ".05em",
    margin: 0,
  },
  chartLegend: {
    display: "flex",
    gap: 14,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    color: "#6b7280",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  th: {
    padding: "10px 20px",
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: 600,
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: ".05em",
    borderBottom: "1px solid #e5e7eb",
  },
  reviewHeaderTools: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  reviewSummaryPill: {
    border: "1px solid #eadcfb",
    background: "#faf5ff",
    color: "#7e22ce",
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  reviewSelect: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "7px 10px",
    color: "#374151",
    background: "#fff",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 600,
  },
  donutLegend: {
    padding: "12px 20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  donutRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 13,
  },
  donutLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#374151",
  },
  donutPct: {
    fontWeight: 600,
    color: "#374151",
  },
};
