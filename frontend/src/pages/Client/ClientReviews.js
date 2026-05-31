import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClientSidebar from "./ClientSidebar";
import { getMyReviews } from "../../services/apiReview";
import { getProfile } from "../../services/apiAuth";
import { hasAccess, ROLES } from "../../utils/authUtils";
import "./ClientDashboard.css";

export default function ClientReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState({ username: "" });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

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
      if (!hasAccess(parsedUser, [ROLES.CLIENT])) {
        toast.error("Accès non autorisé");
        navigate("/login/client");
        return;
      }
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, reviewsData] = await Promise.all([getProfile(), getMyReviews()]);
        setProfile(profileData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger vos avis.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredReviews = reviews.filter((review) => {
    const normalizedText = `${review.product?.name || review.productName || ''} ${review.comment || ''}`.toLowerCase();
    const matchesSearch = normalizedText.includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || String(review.rating) === ratingFilter;
    return matchesSearch && matchesRating;
  });

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
            <h1 style={S.title}>Mes avis</h1>
            <div style={S.subtitle}>Vos retours aident à améliorer votre expérience.</div>
          </div>
          <div style={S.topbarRight}>
            <div style={S.clock}>{formatDate(new Date())}</div>
            <div style={S.avatar}>{avatarLetters}</div>
          </div>
        </div>

        {loading ? (
          <div style={S.loading}>Chargement...</div>
        ) : reviews.length === 0 ? (
          <div style={S.emptyState}>
            <p>Vous n'avez pas encore publié d'avis.</p>
          </div>
        ) : (
          <>
            <div className="reviews-filter">
              <input
                type="text"
                className="filter-input"
                placeholder="Rechercher par produit ou contenu..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <select
                className="filter-select"
                value={ratingFilter}
                onChange={(event) => setRatingFilter(event.target.value)}
              >
                <option value="all">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>
            </div>
            {filteredReviews.length === 0 ? (
              <div style={S.emptyState}>
                <p>Aucun avis ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="reviews-grid">
                {filteredReviews.map((review) => (
                  <div key={review._id || review.id || Math.random()} className="review-card">
                    <div className="review-card-top">
                      <div>
                        <h2 style={S.reviewTitle}>{review.product?.name || review.productName || 'Produit Star Mousse'}</h2>
                        <p className="review-subtitle">Avis client</p>
                      </div>
                      <span className="review-stars-summary">{'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}</span>
                    </div>
                    <p className="review-text">{review.comment || 'Aucun commentaire.'}</p>
                    <div className="review-card-meta">
                      <span>{formatDate(review.reviewDate || review.createdAt || review.date)}</span>
                      <span>{review.sentiment?.source === 'bert' ? 'BERT' : review.sentiment?.label || 'note client'}</span>
                      <span style={S.reviewScore}>Score: {review.sentiment?.score ? review.sentiment.score.toFixed(2) : '--'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
  reviewsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },
  reviewCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 16px 42px rgba(17, 24, 39, 0.07)",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  reviewTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  reviewDate: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: 13,
  },
  reviewRating: {
    color: "#f97316",
    fontSize: 16,
    fontWeight: 700,
  },
  reviewText: {
    margin: 0,
    color: "#374151",
    lineHeight: 1.7,
    fontSize: 14,
  },
  reviewMeta: {
    display: "flex",
    justifyContent: "space-between",
    color: "#6b7280",
    fontSize: 13,
  },
  reviewScore: {
    fontWeight: 600,
    color: "#111827",
  },
};
