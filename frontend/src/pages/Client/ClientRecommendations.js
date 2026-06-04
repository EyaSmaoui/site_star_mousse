import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClientSidebar from "./ClientSidebar";
import { getRecommended } from "../../services/apiProduct";
import { getProfile } from "../../services/apiAuth";
import { hasAccess, ROLES } from "../../utils/authUtils";
import { subscribeToProfileChanges } from "../../services/profileSyncService";
import { PRODUCTS } from "../../data/products";
import formatPrice from "../../utils/formatPrice";

const normalizeName = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const featuredProducts = PRODUCTS.slice(0, 6).map((product, index) => ({
  ...product,
  recommendation: {
    averageRating: 4.8 - Math.min(index, 3) * 0.1,
    reviewCount: 12 - index,
    reason: "Selection confort recommandee pour mieux dormir et profiter d'un soutien adapte.",
  },
}));

const getLocalProductMatch = (product) => {
  const productName = normalizeName(product?.name);
  return PRODUCTS.find((localProduct) => {
    const localName = normalizeName(localProduct.name);
    return localName === productName || localName.includes(productName) || productName.includes(localName);
  });
};

const normalizeProduct = (product, index) => {
  const localProduct = getLocalProductMatch(product) || PRODUCTS[index % PRODUCTS.length];
  const sizes = Array.isArray(localProduct.sizes) ? localProduct.sizes : [];
  const defaultSize = sizes[localProduct.defaultSizeIndex ?? 0] || sizes[0];

  return {
    ...localProduct,
    ...product,
    slug: product.slug || localProduct.slug,
    image: product.image || product.img || product.images?.[0] || localProduct.images?.[0] || "/relax1.png",
    category: product.category?.name || product.categoryName || product.category || localProduct.category || "Produit",
    description: product.description || product.desc || localProduct.description || "Un produit recommande pour ameliorer votre confort de sommeil.",
    displayPrice: Number(product.price ?? defaultSize?.price ?? localProduct.price ?? 0),
    recommendation: product.recommendation || localProduct.recommendation || {
      averageRating: product.averageRating || 4.6,
      reviewCount: product.reviewCount || 0,
      reason: "Selection catalogue adaptee au confort et au sommeil.",
    },
  };
};

export default function ClientRecommendations() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [profile, setProfile] = useState({ username: "" });
  const [loading, setLoading] = useState(true);

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
        const profileData = await getProfile();
        setProfile(profileData);

        try {
          const recommended = await getRecommended(6);
          const normalizedRecommendations = Array.isArray(recommended)
            ? recommended.map(normalizeProduct)
            : [];
          setRecommendations(normalizedRecommendations.length ? normalizedRecommendations : featuredProducts.map(normalizeProduct));
        } catch (recommendationError) {
          console.error(recommendationError);
          setRecommendations(featuredProducts.map(normalizeProduct));
          toast.warning("Recommandations catalogue affichees en attendant le serveur.");
        }
      } catch (error) {
        console.error(error);
        setRecommendations(featuredProducts.map(normalizeProduct));
        toast.error("Impossible de charger votre profil. Recommandations catalogue affichees.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = subscribeToProfileChanges((updatedProfile) => {
      setProfile((current) => ({ ...current, ...updatedProfile }));
    });

    return unsubscribe;
  }, []);

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
            <h1 style={S.title}>Recommandations personnalisées</h1>
            <div style={S.subtitle}>Produits recommandés pour vous d'après les avis de nos clients.</div>
          </div>
          <div style={S.topbarRight}>
            <div style={S.clock}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</div>
            <div style={S.avatar}>{avatarLetters}</div>
          </div>
        </div>

        {loading ? (
          <div style={S.loading}>Chargement...</div>
        ) : recommendations.length === 0 ? (
          <div style={S.emptyState}>
            <p>Aucune recommandation disponible pour le moment.</p>
          </div>
        ) : (
          <div className="sm-card-grid" style={S.grid}>
            {recommendations.map((product) => (
              <article key={product._id || product.id || product.name} style={S.card}>
                <img
                  src={product.image || "/relax1.png"}
                  alt={product.name}
                  style={S.cardImage}
                />
                <div style={S.cardBody}>
                  <div style={S.badge}>{product.category || "Produit"}</div>
                  <h2 style={S.cardTitle}>{product.name}</h2>
                  <p style={S.cardDesc}>{product.description || product.desc || "Un produit recommandé par notre système d'avis."}</p>
                  <div style={S.cardMeta}>
                    <span style={S.price}>{formatPrice(product.displayPrice)}</span>
                    {(product.recommendation?.reviewCount || product.reviewCount) ? (
                      <span style={S.rating}>
                        ⭐ {Number(product.recommendation?.averageRating || product.averageRating || 0).toFixed(1)} · {product.recommendation?.reviewCount || product.reviewCount} avis
                      </span>
                    ) : (
                      <span style={S.ratingMuted}>Sélection catalogue</span>
                    )}
                  </div>
                  {product.recommendation?.reason && <p style={S.reason}>{product.recommendation.reason}</p>}
                  <a href={product.path || `/product/${product.slug}` } style={S.cta}>Voir le produit</a>
                </div>
              </article>
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
    gap: 16,
    marginBottom: 28,
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 16px 42px rgba(17, 24, 39, 0.07)",
    display: "flex",
    flexDirection: "column",
  },
  cardImage: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    objectPosition: "center",
  },
  cardBody: {
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  badge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background: "#fdf2f8",
    color: "#be185d",
    width: "fit-content",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
  },
  cardDesc: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 1.65,
    minHeight: 54,
  },
  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  price: {
    fontSize: 18,
    fontWeight: 700,
  },
  rating: {
    fontSize: 14,
    color: "#f97316",
    fontWeight: 700,
  },
  ratingMuted: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 700,
  },
  reason: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
  },
  cta: {
    marginTop: "auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    background: "#f97316",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 12,
    fontWeight: 700,
    transition: "background .2s",
  },
};
