import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../../services/apiAuth';
import { getMyOrders } from '../../services/orderService';
import { hasAccess, ROLES } from '../../utils/authUtils';
import AdvancedFilters from '../../components/AdvancedFilters';
import ClientSidebar from './ClientSidebar';
import { notifyProfileChanged } from '../../services/profileSyncService';

const KPI_CONFIG = [
  {
    label: "Commandes totales",
    valueKey: "totalOrders",
    format: (v) => String(v || 0),
    change: "au total",
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
    label: "Commandes en cours",
    valueKey: "activeOrders",
    format: (v) => String(v || 0),
    change: "en attente",
    iconColor: "#7c3aed",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      </svg>
    ),
  },
  {
    label: "Dépense totale",
    valueKey: "totalSpent",
    format: (v) => `${Number(v || 0).toLocaleString('fr-TN')} DT`,
    change: "investi",
    iconColor: "#10b981",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <path d="M12 8v-1" />
        <path d="M12 17v1" />
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      </svg>
    ),
  },
];

const STATUS_STYLES = {
  livré: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "en attente": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  "en cours": { bg: "#ede9fe", color: "#6d28d9", border: "#c4b5fd" },
  expédié: { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  annulé: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterConfig, setFilterConfig] = useState({
    search: '',
    status: [],
    sort: ''
  });
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [time, setTime] = useState(new Date());
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

  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (!hasAccess(parsedUser, [ROLES.CLIENT, ROLES.USER])) {
        toast.error('Accès non autorisé');
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
      const [ordersData, profileData] = await Promise.all([
        getMyOrders(),
        getProfile()
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProfile(profileData);
      setEditedProfile({
        username: profileData.username,
        phone: profileData.phone,
        address: profileData.address || ''
      });
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
    // Support both 'tab' and 'section' parameters for flexibility
    let tabParam = new URLSearchParams(location.search).get('tab');
    if (!tabParam) {
      tabParam = new URLSearchParams(location.search).get('section');
    }
    if (tabParam === 'profile' || tabParam === 'overview') {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const activeOrders = orders.filter((order) => {
      const status = (order.status || '').toLowerCase();
      return ['pending', 'en attente', 'en cours', 'expédié'].includes(status);
    }).length;
    return { totalOrders, totalSpent, activeOrders };
  }, [orders]);

  const recentOrders = useMemo(() => {
    let result = orders;

    // Recherche
    if (filterConfig.search) {
      const q = filterConfig.search.toLowerCase();
      result = result.filter(order => {
        const text = `${order._id} ${order.customerName} ${order.customerEmail}`.toLowerCase();
        return text.includes(q);
      });
    }

    // Filtrer par statut
    if (filterConfig.status && filterConfig.status.length > 0) {
      result = result.filter(order =>
        filterConfig.status.includes(order.status?.toLowerCase())
      );
    }

    // Tri
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
    } else {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result.slice(0, 10);
  }, [orders, filterConfig]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0,8);
      setEditedProfile(current => ({ ...current, [name]: digits }));
    } else {
      setEditedProfile(current => ({ ...current, [name]: value }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Validations
      if (!editedProfile.username || !editedProfile.username.trim()) {
        toast.error('❌ Le nom d\'utilisateur est requis');
        return;
      }
      if (!editedProfile.phone || !editedProfile.phone.trim()) {
        toast.error('❌ Le numéro de téléphone est requis');
        return;
      }
      if ((editedProfile.phone || '').toString().replace(/\D/g, '').length !== 8) {
        toast.error('❌ Le numéro de téléphone doit contenir exactement 8 chiffres');
        return;
      }

      setIsSaving(true);
      console.log('📤 Envoi des données:', {
        username: editedProfile.username,
        phone: editedProfile.phone,
        address: editedProfile.address
      });

      const result = await updateProfile({
        username: editedProfile.username,
        phone: editedProfile.phone,
        address: editedProfile.address
      });

      console.log('✅ Réponse du serveur:', result);

      const updatedProfile = result?.user || {
        id: profile.id || profile._id,
        username: editedProfile.username,
        email: profile.email,
        phone: editedProfile.phone,
        address: editedProfile.address,
        role: profile.role
      };
      setProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));

      // 🔔 IMPORTANT: Notifier TOUTE l'application que le profil a changé
      notifyProfileChanged(updatedProfile);
      console.log('🔔 Notification globale envoyée - Le profil a changé partout dans l\'app');

      // 🔄 IMPORTANT: Rafraîchir les commandes après la mise à jour du profil
      console.log('🔄 Rafraîchissement des commandes...');
      try {
        const updatedOrders = await getMyOrders();
        setOrders(Array.isArray(updatedOrders) ? updatedOrders : []);
        setFilterConfig({ search: '', status: [], sort: '' }); // Réinitialiser les filtres
        console.log('✅ Commandes rafraîchies! Nombre:', updatedOrders.length);
        
        // Afficher les commandes avec les nouvelles infos
        if (updatedOrders.length > 0) {
          console.log('📋 Première commande mise à jour:', {
            customerName: updatedOrders[0].customerName,
            phone: updatedOrders[0].phone,
            address: updatedOrders[0].address
          });
        }
      } catch (error) {
        console.error('⚠️ Erreur lors du rafraîchissement des commandes:', error);
      }

      toast.success('✅ Profil enregistré! Les commandes sont maintenant à jour.');
      
      // 🔄 Passer automatiquement à l'onglet Aperçu pour voir les changements
      setTimeout(() => {
        setActiveTab('overview');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      toast.error(`❌ Erreur: ${error.message || 'Impossible de mettre à jour le profil'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={S.root}>
        <ClientSidebar />
        <main className="client-main sm-internal-main" style={S.main}>
          <div style={S.loadingContainer}>
            <div style={S.spinner} />
            <p>Chargement...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={S.root}>
      <ClientSidebar />
      <main className="client-main" style={S.main}>
        <div style={S.container}>
          {/* Header */}
          <div style={S.header}>
            <div>
              <h1 style={S.title}>Bienvenue, {profile.username}!</h1>
              <p style={S.subtitle}>Gérez votre compte et vos commandes</p>
            </div>
            <div style={S.headerRight}>
              <div style={S.timeBox}>{timeStr}</div>
              <div style={S.avatar}>{profile.username ? profile.username.charAt(0).toUpperCase() : 'C'}</div>
              <div style={S.date}>{dateStr}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={S.tabsContainer}>
            <button
              onClick={() => handleTabClick('overview')}
              style={{ ...S.tabButton, ...(activeTab === 'overview' ? S.tabButtonActive : S.tabButtonInactive) }}
            >
              Aperçu
            </button>
            <button
              onClick={() => handleTabClick('profile')}
              style={{ ...S.tabButton, ...(activeTab === 'profile' ? S.tabButtonActive : S.tabButtonInactive) }}
            >
              Mon profil
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={S.content}>
              {/* KPI Cards */}
              <div style={S.kpiGrid}>
                {KPI_CONFIG.map((kpi, i) => (
                  <div key={i} style={S.kpiCard}>
                    <div style={{ ...S.kpiIcon, background: kpi.iconColor }}>
                      {kpi.icon}
                    </div>
                    <div style={S.kpiInfo}>
                      <p style={S.kpiLabel}>{kpi.label}</p>
                      <div style={S.kpiValue}>{kpi.format(stats[kpi.valueKey])}</div>
                      <p style={S.kpiChange}>{kpi.change}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div style={S.recentOrdersSection}>
                <div style={S.sectionHeader}>
                  <h2 style={S.sectionTitle}>📦 Mes commandes</h2>
                </div>

                {/* Advanced Filters */}
                <AdvancedFilters
                  searchPlaceholder="Rechercher par numéro, nom, email..."
                  filters={[
                    {
                      key: 'status',
                      label: 'Statut',
                      type: 'checkbox',
                      options: ['en attente', 'en cours', 'expédié', 'livré', 'annulé']
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

                {recentOrders.length === 0 ? (
                  <div style={S.emptyState}>
                    <p>Aucune commande correspondant aux filtres</p>
                  </div>
                ) : (
                  <div style={S.ordersList}>
                    {recentOrders.map((order) => {
                      const statusStyle = STATUS_STYLES[order.status?.toLowerCase()] || STATUS_STYLES['en attente'];
                      return (
                        <div key={order._id} style={S.orderItem}>
                          <div style={S.orderInfo}>
                            <div>
                              <p style={S.orderId}>Commande #{order._id.slice(-6).toUpperCase()}</p>
                              <p style={S.orderDate}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                          <div style={S.orderMiddle}>
                            <p style={S.orderProducts}>{order.products?.length || 0} article(s)</p>
                          </div>
                          <div style={S.orderRight}>
                            <p style={S.orderTotal}>{Number(order.total).toLocaleString('fr-TN')} DT</p>
                            <span style={{ ...S.statusBadge, ...statusStyle }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={S.content}>
              <div style={S.profileCard}>
                <h2 style={S.profileTitle}>📋 Modifier mon profil</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                  <div style={S.formGrid}>
                    <div style={S.formGroup}>
                      <label style={S.label}>Nom d'utilisateur</label>
                      <input
                        type="text"
                        name="username"
                        value={editedProfile.username}
                        onChange={handleProfileChange}
                        style={S.input}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-card-border)'}
                      />
                    </div>

                    <div style={S.formGroup}>
                      <label style={S.label}>Email (non modifiable)</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        style={{ ...S.input, opacity: 0.6, cursor: 'not-allowed' }}
                      />
                    </div>

                    <div style={S.formGroup}>
                      <label style={S.label}>Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        pattern="\\d{8}"
                        maxLength={8}
                        value={editedProfile.phone}
                        onChange={handleProfileChange}
                        style={S.input}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-card-border)'}
                      />
                    </div>

                    <div style={{ ...S.formGroup, gridColumn: '1 / -1' }}>
                      <label style={S.label}>Adresse</label>
                      <textarea
                        name="address"
                        value={editedProfile.address}
                        onChange={handleProfileChange}
                        style={{ ...S.input, minHeight: '100px', resize: 'vertical' }}
                        rows="4"
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-card-border)'}
                      />
                    </div>
                  </div>

                  <div style={S.buttonGroup}>
                    <button
                      type="button" disabled={isSaving} onClick={(e) => { e.preventDefault(); handleSaveProfile(); }}
                      style={{
                        ...S.submitButton,
                        opacity: isSaving ? 0.6 : 1,
                        cursor: isSaving ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => !isSaving && (e.target.style.background = 'var(--color-primary-600)')}
                      onMouseLeave={(e) => (e.target.style.background = 'var(--color-primary)')}
                    >
                      {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              </div>
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
    minHeight: '100vh',
    background: 'transparent',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 18px',
    width: '100%',
    boxSizing: 'border-box',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  timeBox: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-600))',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
  },
  date: {
    fontSize: '13px',
    color: '#6b7280',
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-card-border)',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '12px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s ease',
    marginBottom: '-1px',
  },
  tabButtonActive: {
    color: 'var(--color-primary)',
    borderBottomColor: 'var(--color-primary)',
    fontWeight: '600',
  },
  tabButtonInactive: {
    color: '#6b7280',
  },
  content: {
    marginTop: '20px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  kpiCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
  },
  kpiIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  kpiInfo: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    margin: '0 0 4px 0',
    letterSpacing: '0.05em',
  },
  kpiValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '4px 0',
  },
  kpiChange: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    margin: '4px 0 0 0',
  },
  recentOrdersSection: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
    color: '#1f2937',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b7280',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    flexWrap: 'wrap',
    gap: '12px',
  },
  orderInfo: {
    flex: 1,
    minWidth: '180px',
  },
  orderId: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0',
  },
  orderDate: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
  },
  orderMiddle: {
    flex: 1,
    textAlign: 'center',
    minWidth: '120px',
  },
  orderProducts: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },
  orderRight: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    flexDirection: 'column',
  },
  orderTotal: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid',
    textTransform: 'capitalize',
  },
  profileCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
  },
  profileTitle: {
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 28px 0',
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '12px 14px',
    border: '1px solid var(--color-card-border)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    background: 'var(--color-surface)',
    color: '#1f2937',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
    flexWrap: 'wrap',
  },
  submitButton: {
    padding: '12px 28px',
    background: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
  },
};

export default ClientDashboard;

