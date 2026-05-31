import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../../services/apiAuth';
import { addReview, getMyReviews } from '../../services/apiReview';
import { getMyOrders } from '../../services/orderService';
import { hasAccess, ROLES } from '../../utils/authUtils';
import './ClientDashboard.css';
import ClientSidebar from './ClientSidebar';

const KPI_CONFIG = [
  {
    label: "Commandes totales",
    valueKey: "totalOrders",
    format: (v) => String(v || 0),
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
    iconColor: "#7c3aed",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      </svg>
    ),
  },
  {
    label: "Note moyenne",
    valueKey: "averageRating",
    format: (v) => `${v || 0}/5`,
    iconColor: "#10b981",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
];

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [editedProfile, setEditedProfile] = useState({
    username: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    orderProductKey: '',
    comment: '',
    rating: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [dataSyncedAt, setDataSyncedAt] = useState(null);
  const [time, setTime] = useState(new Date());

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    if (!userData) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (!hasAccess(parsedUser, [ROLES.CLIENT, ROLES.USER])) {
        toast.error('Accès non autorisé à cette interface');
        navigate('/login');
        return;
      }
      setIsAuthorized(true);
    } catch {
      toast.error('Veuillez vous connecter');
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [ordersData, profileData, reviewsData] = await Promise.all([
        getMyOrders(),
        getProfile(),
        getMyReviews()
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setProfile(profileData);
      setEditedProfile({
        username: profileData.username,
        phone: profileData.phone,
        address: profileData.address || ''
      });
      setDataSyncedAt(new Date());
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    fetchUserData();
  }, [isAuthorized]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab === 'reviews' || tab === 'orders' || tab === 'profile') {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search]);

  const orderProductOptions = orders.flatMap((order) =>
    (order.products || []).map((product, index) => ({
      key: `${order._id}:${index}`,
      orderId: order._id,
      productId: product.product || product.productId || product._id || '',
      productName: product.name,
      label: `Commande #${order._id.slice(-6).toUpperCase()} - ${product.name}`,
    }))
  );

  const selectedReviewProduct = orderProductOptions.find(
    (option) => option.key === reviewForm.orderProductKey
  );

  const filteredReviews = reviews.filter((review) => {
    const normalizedText = `${review.product?.name || review.productName || ''} ${review.comment || ''}`.toLowerCase();
    const matchesSearch = normalizedText.includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || String(review.rating) === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const filteredOrders = orders.filter((order) => {
    const normalizedText = `${order._id || ''} ${order.customerName || ''} ${order.customerEmail || ''}`.toLowerCase();
    const matchesSearch = normalizedText.includes(orderSearch.toLowerCase());
    const statusValue = (order.status || '').toLowerCase();
    const matchesStatus = orderStatusFilter === 'all' || statusValue === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const activeOrdersCount = orders.filter((order) => {
    const status = (order.status || '').toLowerCase();
    return ['pending', 'en attente', 'en cours', 'expédié'].includes(status);
  }).length;
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const statsSummary = {
    totalOrders,
    activeOrders: activeOrdersCount,
    averageRating: parseFloat(averageRating)
  };

  useEffect(() => {
    if (loading || isReviewModalOpen || !orderProductOptions.length) return;

    let pendingReview = null;
    try {
      pendingReview = JSON.parse(sessionStorage.getItem('pendingReviewOrder') || 'null');
    } catch {
      pendingReview = null;
    }

    if (!pendingReview?.orderId) return;

    const isFresh = !pendingReview.createdAt || Date.now() - pendingReview.createdAt < 10 * 60 * 1000;
    if (!isFresh) {
      sessionStorage.removeItem('pendingReviewOrder');
      return;
    }

    const matchingOption = orderProductOptions.find((option) => (
      option.orderId === pendingReview.orderId &&
      (!pendingReview.productName || option.productName === pendingReview.productName)
    )) || orderProductOptions.find((option) => option.orderId === pendingReview.orderId);

    if (matchingOption) {
      setActiveTab('reviews');
      setReviewForm({
        orderProductKey: matchingOption.key,
        comment: '',
        rating: 0
      });
      setIsReviewModalOpen(true);
      sessionStorage.removeItem('pendingReviewOrder');
    }
  }, [loading, isReviewModalOpen, orderProductOptions]);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#FFA500',
      'en attente': '#FFA500',
      'en cours': '#1890FF',
      expédié: '#722ED1',
      livré: '#52C41A',
      annulé: '#FF4D4F'
    };
    return colors[status] || '#666';
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setEditedProfile((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        username: editedProfile.username,
        phone: editedProfile.phone,
        address: editedProfile.address
      });

      setProfile((current) => ({
        ...current,
        username: editedProfile.username,
        phone: editedProfile.phone,
        address: editedProfile.address
      }));

      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const openReviewModal = (optionKey = '') => {
    setReviewForm({
      orderProductKey: optionKey || orderProductOptions[0]?.key || '',
      comment: '',
      rating: 0
    });
    setIsReviewModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    const selected = orderProductOptions.find((option) => option.key === reviewForm.orderProductKey);

    if (!selected) {
      toast.warning('Veuillez choisir une commande.');
      return;
    }

    if (!reviewForm.rating) {
      toast.warning('Veuillez sélectionner une note.');
      return;
    }

    try {
      await addReview({
        order: selected.orderId,
        product: selected.productId || undefined,
        productName: selected.productName,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim()
      });
      toast.success('Avis envoyé avec succès.');
      setIsReviewModalOpen(false);
      setReviews(await getMyReviews());
    } catch (error) {
      console.error('Erreur avis:', error);
      toast.error("Erreur lors de l'envoi de l'avis.");
    }
  };

  if (loading) {
    return (
      <div style={S.root}>
        <ClientSidebar />
        <main style={S.main}>
          <div className="dashboard-container">
            <div className="loading">Chargement...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={S.root}>
      <ClientSidebar />
      <main style={{ ...S.main, marginLeft: isMobile ? 0 : 240, padding: isMobile ? '18px 16px 80px' : S.main.padding }}>
        <div className="dashboard-container">
          <div style={S.topbar} className="dashboard-topbar">
            <div>
              <h1 style={S.title}>Bienvenue, {profile.username} !</h1>
              <div style={S.subtitle}>Tableau de bord client</div>
            </div>

            <div style={S.topbarRight}>
              <div style={S.clock}>{timeStr}</div>
              <div style={S.avatar}>{profile.username ? profile.username.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() : 'CL'}</div>
              <span style={S.userName}>{dateStr}</span>
            </div>
          </div>

          <div style={S.kpiGrid}>
            {KPI_CONFIG.map((kpi, i) => (
              <div key={i} style={S.kpiCard}>
                <div style={{...S.kpiIconBox, background: kpi.iconColor}}>
                  {kpi.icon}
                </div>
                <div style={S.kpiBody}>
                  <div style={S.kpiMeta}>
                    <span style={S.kpiLabel}>{kpi.label}</span>
                  </div>
                  <div style={S.kpiValue}>
                    {loading ? "…" : kpi.format(statsSummary[kpi.valueKey])}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={S.tabsRow} className="dashboard-tabs">
            <button
              type="button"
              className={activeTab === 'orders' ? 'active' : ''}
              style={{ ...S.tabBtn, ...(activeTab === 'orders' ? S.tabBtnActive : S.tabBtnInactive) }}
              onClick={() => handleTabClick('orders')}
            >
              Mes commandes
            </button>
            <button
              type="button"
              className={activeTab === 'reviews' ? 'active' : ''}
              style={{ ...S.tabBtn, ...(activeTab === 'reviews' ? S.tabBtnActive : S.tabBtnInactive) }}
              onClick={() => handleTabClick('reviews')}
            >
              Mes avis
            </button>
            <button
              type="button"
              className={activeTab === 'profile' ? 'active' : ''}
              style={{ ...S.tabBtn, ...(activeTab === 'profile' ? S.tabBtnActive : S.tabBtnInactive) }}
              onClick={() => handleTabClick('profile')}
            >
              Mon profil
            </button>
          </div>

      {activeTab === 'orders' && (
        <div className="tab-content">
          <div className="reviews-head">
            <div>
              <h2>Historique des commandes</h2>
              <p>Choisissez un produit commandé pour partager votre expérience.</p>
            </div>
            <button type="button" className="btn-save btn-review-main" onClick={() => openReviewModal()}>
              Laisser un avis
            </button>
          </div>

          <div className="dashboard-filters">
            <input
              type="text"
              className="filter-input"
              placeholder="Rechercher une commande par numéro, nom ou email..."
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
            />
            <select
              className="filter-select"
              value={orderStatusFilter}
              onChange={(event) => setOrderStatusFilter(event.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="en attente">En attente</option>
              <option value="en cours">En cours</option>
              <option value="expédié">Expédié</option>
              <option value="livré">Livré</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p>Vous n'avez pas encore de commandes correspondant aux filtres.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h3>Commande #{order._id.slice(-6).toUpperCase()}</h3>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="order-details">
                    <div className="detail-row">
                      <span className="label">Statut:</span>
                      <span className="status order-badge" style={{ color: getStatusColor(order.status), borderColor: getStatusColor(order.status), backgroundColor: `${getStatusColor(order.status)}22` }}>
                        {order.status}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Client:</span>
                      <span>{order.customerName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span>{order.customerEmail}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Téléphone:</span>
                      <span>{order.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Adresse:</span>
                      <span>{order.address}</span>
                    </div>
                  </div>

                  <div className="order-products">
                    <h4>Articles:</h4>
                    <ul>
                      {(order.products || []).map((product, index) => (
                        <li key={`${order._id}-${index}`}>
                          {product.name} x{product.quantity} - {Number(product.price || 0) * Number(product.quantity || 1)} DT
                          <button
                            type="button"
                            className="btn-review-inline"
                            onClick={() => openReviewModal(`${order._id}:${index}`)}
                          >
                            Avis
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-total">
                    <strong>Total: {order.total} DT</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="tab-content">
          <div className="reviews-head">
            <div>
              <h2>Historique des avis</h2>
              <p>Vos commentaires alimentent les recommandations intelligentes.</p>
            </div>
            <button type="button" className="btn-save btn-review-main" onClick={() => openReviewModal()}>
              Nouvel avis
            </button>
          </div>

          <div className="reviews-filter">
            <input
              type="text"
              className="filter-input"
              placeholder="Rechercher par produit ou commentaire..."
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

          {reviews.length === 0 ? (
            <div className="empty-state">
              <p>Vous n'avez pas encore laissé d'avis.</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="empty-state">
              <p>Aucun avis ne correspond à vos critères.</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {filteredReviews.map((review) => (
                <article key={review._id} className="review-card">
                  <div className="review-card-top">
                    <div>
                      <strong>{review.product?.name || review.productName || 'Produit Star Mousse'}</strong>
                      <p className="review-subtitle">Avis client</p>
                    </div>
                    <span className="review-stars-summary">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <p className="review-text">{review.comment || 'Aucun commentaire renseigné.'}</p>
                  <div className="review-card-meta">
                    <span>{formatDate(review.reviewDate || review.createdAt)}</span>
                    <span>{review.sentiment?.source === 'bert' ? 'BERT' : review.sentiment?.label || 'Analyse interne'}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="tab-content">
          <h2>Modifier mon profil</h2>
          <form className="profile-form" onSubmit={(event) => { event.preventDefault(); handleSaveProfile(); }}>
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                value={editedProfile.username}
                onChange={handleProfileChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Email (non modifiable)</label>
              <input type="email" value={profile.email} disabled className="form-input disabled" />
            </div>

            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={editedProfile.phone}
                onChange={handleProfileChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <textarea
                name="address"
                value={editedProfile.address}
                onChange={handleProfileChange}
                className="form-input form-textarea"
                rows="4"
              />
            </div>

            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      )}

      {isReviewModalOpen && (
        <div className="review-modal-backdrop" role="presentation" onClick={() => setIsReviewModalOpen(false)}>
          <form className="review-modal" onSubmit={handleReviewSubmit} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="review-modal-close" onClick={() => setIsReviewModalOpen(false)} aria-label="Fermer">
              ×
            </button>
            <h2>Laisser un avis</h2>
            <p>Sur {selectedReviewProduct?.productName || 'un produit Star Mousse'}</p>

            <label>Choisissez une commande :</label>
            <select
              value={reviewForm.orderProductKey}
              onChange={(event) => setReviewForm((current) => ({ ...current, orderProductKey: event.target.value }))}
              required
              disabled={!orderProductOptions.length}
            >
              <option value="">Sélectionnez une commande</option>
              {orderProductOptions.map((option) => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
            {!orderProductOptions.length && (
              <small className="review-modal-help">Vous devez avoir une commande avant de laisser un avis produit.</small>
            )}

            <label>Votre commentaire <small style={{fontWeight:400, fontSize:12, marginLeft:6}}>(facultatif)</small> :</label>
            <textarea
              value={reviewForm.comment}
              onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
              placeholder="Exprimez votre expérience..."
              rows="4"
            />

            <label id="review-rating-label">Laissez votre note</label>
            <div className="review-stars" role="radiogroup" aria-labelledby="review-rating-label">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= reviewForm.rating ? 'active' : ''}
                  onClick={() => setReviewForm((current) => ({ ...current, rating: star }))}
                  role="radio"
                  aria-checked={reviewForm.rating === star}
                  aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="selected-rating">Note sélectionnée : {reviewForm.rating} étoile(s)</div>
            <button type="submit" className="btn-save" disabled={!orderProductOptions.length || !reviewForm.rating}>
              Envoyer
            </button>
          </form>
        </div>
      )}
        </div>
      </main>
    </div>
  );
};

const S = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#fdf6ef',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#111827',
  },
  main: {
    flex: 1,
    marginLeft: 240,
    padding: '28px 32px',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 700,
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 600,
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  clock: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '10px 14px',
    fontVariantNumeric: 'tabular-nums',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f97316, #ef4444)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
  },
  userName: {
    fontSize: 13,
    color: '#6b7280',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    background: '#fff',
    border: '1px solid #f0e8df',
    borderRadius: 12,
    padding: '18px 20px',
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  kpiIconBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  kpiBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  kpiMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
  },
  kpiLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1f2937',
  },
  tabsRow: {
    display: 'flex',
    gap: 0,
    marginBottom: 24,
    flexWrap: 'wrap',
    borderBottom: '1px solid #e5e7eb',
  },
  tabBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: 0,
    borderBottom: '2px solid transparent',
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all .15s ease',
    marginBottom: '-1px',
    color: '#9ca3af',
    fontWeight: 400,
  },
  tabBtnActive: {
    borderBottom: '2px solid #f97316',
    color: '#f97316',
    fontWeight: 600,
  },
  tabBtnInactive: {
    borderBottom: '2px solid transparent',
    color: '#9ca3af',
    fontWeight: 400,
  },
};

export default ClientDashboard;
