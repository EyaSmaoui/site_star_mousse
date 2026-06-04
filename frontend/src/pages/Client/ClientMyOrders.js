import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClientSidebar from "./ClientSidebar";
import { getMyOrders } from "../../services/orderService";
import { getProfile } from "../../services/apiAuth";
import { hasAccess, ROLES } from "../../utils/authUtils";
import { getCachedProfile, subscribeToProfileChanges } from "../../services/profileSyncService";

const applyProfileToOrders = (orders, profile) => {
  if (!Array.isArray(orders)) return [];
  if (!profile) return orders;
  const has = (key) => Object.prototype.hasOwnProperty.call(profile, key);

  return orders.map((order) => ({
    ...order,
    customerName: has("username") || has("name") ? (profile.username || profile.name || "") : order.customerName,
    customerEmail: has("email") ? profile.email : order.customerEmail,
    phone: has("phone") ? profile.phone : order.phone,
    address: has("address") ? profile.address : order.address,
  }));
};

export default function ClientMyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(() => getCachedProfile() || { username: "" });
  const [loading, setLoading] = useState(true);

  // Fonction pour rafraîchir les commandes
  const refreshOrders = async (profileOverride = profile) => {
    try {
      console.log('🔄 Rafraîchissement des commandes... (forceRefresh=true)');
      const ordersData = await getMyOrders(true); // ✅ FORCE REFRESH
      setOrders(applyProfileToOrders(ordersData, profileOverride));
      console.log('✅ Commandes rafraîchies! Nombre:', ordersData.length);
      if (ordersData.length > 0) {
        console.log('📊 Nouvelle première commande:', {
          customerName: ordersData[0].customerName,
          phone: ordersData[0].phone,
          address: ordersData[0].address
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      toast.error("Veuillez vous connecter");
      navigate("/login/client");
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (!hasAccess(parsedUser, [ROLES.CLIENT, ROLES.USER])) {
        toast.error("Accès non autorisé");
        navigate("/login/client");
        return;
      }
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, ordersData] = await Promise.all([getProfile(), getMyOrders(true)]);
        setProfile(profileData);
        setOrders(applyProfileToOrders(ordersData, profileData));
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger vos commandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 🔔 S'abonner aux changements de profil GLOBAL
  useEffect(() => {
    console.log('👂 ClientMyOrders: Écoute les changements de profil global');
    const unsubscribe = subscribeToProfileChanges((updatedProfile) => {
      console.log('🔔 ClientMyOrders: Profil changé globalement! Mise à jour:', updatedProfile);
      setProfile(updatedProfile);
      // Rafraîchir les commandes aussi
      setOrders((currentOrders) => applyProfileToOrders(currentOrders, updatedProfile));
      refreshOrders(updatedProfile);
    });

    return () => {
      console.log('👋 ClientMyOrders: Arrêt de l\'écoute des changements');
      unsubscribe();
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const avatarLetters = profile.username
    ? profile.username
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CL";

  return (
    <div style={S.root}>
      <ClientSidebar />
      <main className="client-main sm-internal-main" style={S.main}>
        <div className="sm-page-topbar" style={S.topbar}>
          <div>
            <h1 style={S.title}>Mes commandes</h1>
            <div style={S.subtitle}>Retrouvez l'historique complet de vos achats.</div>
          </div>
          <div style={S.topbarRight}>
            <div style={S.clock}>{formatDate(new Date())}</div>
            <div style={S.avatar}>{avatarLetters}</div>
          </div>
        </div>

        {loading ? (
          <div style={S.loading}>Chargement...</div>
        ) : orders.length === 0 ? (
          <div style={S.emptyState}>
            <p>Vous n'avez pas encore de commandes.</p>
          </div>
        ) : (
          <div className="sm-card-grid" style={S.ordersGrid}>
            {orders.map((order) => (
              <div key={order._id} style={S.orderCard}>
                <div style={S.orderHeader}>
                  <div>
                    <h2 style={S.orderTitle}>Commande #{order._id.slice(-6).toUpperCase()}</h2>
                    <p style={S.orderDate}>{formatDate(order.createdAt)}</p>
                  </div>
                  <span style={{ ...S.statusBadge, background: order.status === "livré" ? "#dcfce7" : "#fef3c7", color: order.status === "livré" ? "#166534" : "#92400e" }}>
                    {order.status}
                  </span>
                </div>
                <div style={S.orderDetails}>
                  <div style={S.detailRow}>
                    <span style={S.detailLabel}>Nom</span>
                    <span>{order.customerName}</span>
                  </div>
                  <div style={S.detailRow}>
                    <span style={S.detailLabel}>Email</span>
                    <span>{order.customerEmail}</span>
                  </div>
                  <div style={S.detailRow}>
                    <span style={S.detailLabel}>Téléphone</span>
                    <span>{order.phone}</span>
                  </div>
                  <div style={S.detailRow}>
                    <span style={S.detailLabel}>Adresse</span>
                    <span>{order.address}</span>
                  </div>
                </div>
                <div style={S.orderProducts}>
                  <h3 style={S.sectionTitle}>Articles</h3>
                  <ul style={S.productList}>
                    {(order.products || []).map((product, index) => (
                      <li key={`${order._id}-${index}`} style={S.productItem}>
                        <span>{product.name} x{product.quantity}</span>
                        <strong>{Number(product.price || 0) * Number(product.quantity || 1)} DT</strong>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={S.orderTotal}>
                  <strong>Total :</strong> {order.total} DT
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

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
    marginLeft: 220,
    padding: "28px 32px",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 14,
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexShrink: 0,
  },
  clock: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 600,
    color: "#374151",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f97316, #ef4444)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  loading: {
    padding: 40,
    background: "#fff",
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 16px 42px rgba(17, 24, 39, 0.07)",
  },
  emptyState: {
    padding: 40,
    background: "#fff",
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 16px 42px rgba(17, 24, 39, 0.07)",
  },
  ordersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },
  orderCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 16px 42px rgba(17, 24, 39, 0.07)",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  orderTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  orderDate: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: 13,
  },
  statusBadge: {
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 700,
  },
  orderDetails: {
    display: "grid",
    gap: 10,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#374151",
    fontSize: 14,
  },
  detailLabel: {
    color: "#6b7280",
    fontWeight: 600,
  },
  orderProducts: {
    borderTop: "1px solid #f3f4f6",
    paddingTop: 16,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  productList: {
    margin: "16px 0 0",
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: 12,
  },
  productItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 12,
    padding: "12px 16px",
    background: "#f8fafc",
    fontSize: 14,
  },
  orderTotal: {
    marginTop: 12,
    textAlign: "right",
    color: "#111827",
    fontSize: 16,
    fontWeight: 700,
  },
};
