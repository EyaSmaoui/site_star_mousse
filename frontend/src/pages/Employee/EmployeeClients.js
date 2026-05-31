import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmployeeSidebar from "./EmployeeSidebar";
import { getAllOrders } from "../../services/apiOrder";
import { hasAccess, ROLES } from "../../utils/authUtils";

const clientKey = (order) =>
  (order.customerEmail || "").trim().toLowerCase() ||
  (order.phone || "").trim() ||
  order.customerName ||
  order._id;

const formatMoney = (value) => `${Number(value || 0).toLocaleString("fr-TN")} DT`;

export default function EmployeeClients() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login/employee");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (!hasAccess(user, [ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.ADMIN, "employeur"])) {
        navigate("/login");
        return;
      }
    } catch {
      navigate("/login/employee");
      return;
    }

    getAllOrders({ limit: 100 })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Impossible de charger les clients"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const clients = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      const key = clientKey(order);
      const current = map.get(key) || {
        key,
        name: order.customerName || "Client",
        email: order.customerEmail || "",
        phone: order.phone || "",
        address: order.address || "",
        orders: 0,
        total: 0,
        lastOrderAt: order.createdAt,
      };
      current.orders += 1;
      current.total += Number(order.total || 0);
      if (order.createdAt && (!current.lastOrderAt || new Date(order.createdAt) > new Date(current.lastOrderAt))) {
        current.lastOrderAt = order.createdAt;
      }
      map.set(key, current);
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.lastOrderAt || 0) - new Date(a.lastOrderAt || 0));
  }, [orders]);

  const filtered = clients.filter((client) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [client.name, client.email, client.phone, client.address].join(" ").toLowerCase().includes(q);
  });

  return (
    <div style={S.root}>
      <EmployeeSidebar />
      <main className="employee-main sm-internal-main" style={S.main}>
        <div style={S.header}>
          <div>
            <p style={S.eyebrow}>Employé / Clients</p>
            <h1 style={S.title}>Clients commandés</h1>
            <p style={S.subtitle}>Vue lecture seule construite depuis les commandes existantes.</p>
          </div>
          <input
            style={S.search}
            placeholder="Rechercher client..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div style={S.grid}>
          <Kpi label="Clients" value={clients.length} />
          <Kpi label="Commandes" value={orders.length} />
          <Kpi label="Chiffre total" value={formatMoney(clients.reduce((sum, client) => sum + client.total, 0))} />
        </div>

        <section style={S.card}>
          {loading ? (
            <div style={S.empty}>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div style={S.empty}>Aucun client trouvé.</div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  {["Client", "Contact", "Adresse", "Commandes", "Total", "Dernière commande"].map((head) => (
                    <th key={head} style={S.th}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.key} style={S.tr}>
                    <td style={S.tdStrong}>{client.name}</td>
                    <td style={S.td}>{client.email || "-"}<br /><span style={S.muted}>{client.phone || "-"}</span></td>
                    <td style={S.td}>{client.address || "-"}</td>
                    <td style={S.tdStrong}>{client.orders}</td>
                    <td style={S.tdStrong}>{formatMoney(client.total)}</td>
                    <td style={S.td}>{client.lastOrderAt ? new Date(client.lastOrderAt).toLocaleDateString("fr-FR") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div style={S.kpi}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

const S = {
  root: { display: "flex", minHeight: "100vh", background: "#fdf6ef", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1f2937" },
  main: { marginLeft: 220, flex: 1, padding: "28px 32px" },
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, marginBottom: 22 },
  eyebrow: { margin: 0, color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: ".12em" },
  title: { margin: "6px 0", fontSize: 32, color: "#1f2937" },
  subtitle: { margin: 0, color: "#6b7280", fontSize: 14 },
  search: { minWidth: 280, padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 10, outline: 0, font: "inherit" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginBottom: 20 },
  kpi: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 4 },
  card: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 12, overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f9fafb", color: "#9ca3af", textAlign: "left", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", padding: "12px 16px" },
  tr: { borderTop: "1px solid #f3f4f6" },
  td: { padding: "13px 16px", fontSize: 13, color: "#374151", verticalAlign: "top" },
  tdStrong: { padding: "13px 16px", fontSize: 13, fontWeight: 800, color: "#1f2937", verticalAlign: "top" },
  muted: { color: "#9ca3af" },
  empty: { padding: 40, textAlign: "center", color: "#9ca3af" },
};
