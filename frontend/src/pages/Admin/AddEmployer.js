import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createEmployer } from '../../services/apiAdmin';
import AdminSidebar from './AdminSidebar';

const FONT_HEAD = "'Syne', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";
const ACCENT    = "#3b82f6";
const SIDEBAR_W = "260px";

const AddEmployer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'employeur',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.email.trim() ||
        !formData.password.trim() || !formData.phone.trim()) {
      toast.error('Tous les champs sont requis.');
      return;
    }
    try {
      setLoading(true);
      await createEmployer(formData);
      toast.success('Employé créé avec succès !');
      setFormData({ username: '', email: '', password: '', phone: '', role: 'employeur' });
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message;
      toast.error(message || "Erreur lors de la création de l'employé.");
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { label: 'Nom complet',           field: 'username', type: 'text',     placeholder: 'Ex : Mohamed Ben Ali' },
    { label: 'Email professionnel',   field: 'email',    type: 'email',    placeholder: 'exemple@starmousse.tn' },
    { label: 'Mot de passe temporaire', field: 'password', type: 'password', placeholder: '••••••••' },
    { label: 'Téléphone',             field: 'phone',    type: 'text',     placeholder: '+216 XX XXX XXX' },
  ];

  return (
    <div style={s.root}>
      <AdminSidebar />

      <main className="admin-main sm-internal-main" style={s.main}>

        {/* Header */}
        <header style={s.header}>
          <div>
            <p style={s.headerSub}>Gestion des gestionnaires</p>
            <h1 style={s.headerTitle}>Créer un employé</h1>
          </div>
        </header>

        {/* Card formulaire */}
        <div style={s.card}>

          {/* Card header */}
          <div style={s.cardHeader}>
            <span style={s.cardIcon}>👤</span>
            <div>
              <div style={s.cardTitle}>Nouvel employé / employeur</div>
              <div style={s.cardSub}>Remplissez les informations ci-dessous</div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>

            <div style={s.fieldsGrid}>
              {FIELDS.map(({ label, field, type, placeholder }) => (
                <div key={field} style={s.fieldGroup}>
                  <label style={s.label}>{label}</label>
                  <input
                    type={type}
                    value={formData[field]}
                    onChange={handleChange(field)}
                    placeholder={placeholder}
                    required
                    style={s.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = ACCENT;
                      e.target.style.boxShadow = `0 0 0 3px rgba(59,130,246,0.12)`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={s.divider} />

            {/* Actions */}
            <div style={s.actions}>
              <button
                type="submit"
                disabled={loading}
                style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#2563eb"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ACCENT; }}
              >
                {loading ? '⏳ Enregistrement...' : '✓ Enregistrer l\'employé'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/manage-managers')}
                style={s.btnSecondary}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                ← Retour
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default AddEmployer;

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const s = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: FONT_BODY,
    color: "#1e293b",
  },
  main: {
    marginLeft: SIDEBAR_W,
    flex: 1,
    padding: "32px 36px",
    maxWidth: `calc(100% - ${SIDEBAR_W})`,
  },

  /* Header */
  header:      { marginBottom: "28px" },
  headerSub:   { fontSize: "13px", color: "#94a3b8", margin: "0 0 4px" },
  headerTitle: { fontFamily: FONT_HEAD, fontSize: "26px", fontWeight: 700, margin: 0 },

  /* Card */
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    maxWidth: "680px",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "20px 28px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  cardIcon: {
    width: "42px",
    height: "42px",
    background: "#eff6ff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "#1e293b" },
  cardSub:   { fontSize: "12px", color: "#94a3b8", marginTop: "2px" },

  /* Form */
  form:       { padding: "28px" },
  fieldsGrid: { display: "flex", flexDirection: "column", gap: "20px" },

  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    outline: "none",
    color: "#1e293b",
    background: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },

  divider: { height: "1px", background: "#f1f5f9", margin: "24px 0" },

  /* Buttons */
  actions: { display: "flex", gap: "12px", alignItems: "center" },
  btnPrimary: {
    padding: "10px 22px",
    background: ACCENT,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  btnSecondary: {
    padding: "10px 20px",
    background: "#fff",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};
