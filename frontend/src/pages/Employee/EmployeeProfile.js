import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmployeeSidebar from "./EmployeeSidebar";
import { hasAccess, ROLES } from "../../utils/authUtils";
import { changePassword, updateProfile } from "../../services/apiUser";

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", phone: "", role: "", address: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      toast.error("Veuillez vous connecter");
      navigate("/login/employee");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (!hasAccess(parsedUser, [ROLES.MANAGER, ROLES.EMPLOYEE, "employeur"])) {
      toast.error("Acces non autorise");
      navigate("/login");
      return;
    }

    setUser({
      username: parsedUser.username || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      role: parsedUser.role || "",
      address: parsedUser.address || ""
    });
    setLoading(false);
  }, [navigate]);

  const handlePhoneChange = (value) => {
    const digits = (value || "").toString().replace(/\D/g, "").slice(0, 8);
    setUser((prev) => ({ ...prev, phone: digits }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((current) => ({ ...current, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await updateProfile({
        username: user.username,
        phone: user.phone,
        address: user.address,
      });
      toast.success(response.message || "Profil mis à jour avec succès");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...storedUser,
        username: response.user?.username || user.username,
        phone: response.user?.phone || user.phone,
        address: response.user?.address || user.address,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de la mise à jour du profil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    if (!passwords.current) {
      toast.error("Veuillez saisir le mot de passe actuel");
      return;
    }
    if (!passwords.next) {
      toast.error("Veuillez saisir le nouveau mot de passe");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("La confirmation du nouveau mot de passe ne correspond pas");
      return;
    }
    setPasswordUpdating(true);
    try {
      const response = await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
        confirmPassword: passwords.confirm,
      });
      toast.success(response.message || "Mot de passe modifié avec succès");
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors du changement de mot de passe");
    } finally {
      setPasswordUpdating(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <EmployeeSidebar />
      <main className="employee-main sm-internal-main" style={styles.main}>
        <div style={styles.header}>
          <div>
            <p style={styles.breadcrumb}>Employe / Profil</p>
            <h1 style={styles.title}>Mon profil</h1>
            <p style={styles.subtitle}>Nom, email, téléphone, adresse et mot de passe</p>
          </div>
        </div>

        <div style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Informations</h2>
            <label style={styles.label}>Nom complet</label>
            <input
              style={styles.input}
              type="text"
              value={user.username}
              onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
            />
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={user.email} disabled />
            <label style={styles.label}>Telephone</label>
            <input style={styles.input} type="tel" inputMode="numeric" pattern="\\d{8}" maxLength={8} value={user.phone} onChange={(e) => handlePhoneChange(e.target.value)} />
            <label style={styles.label}>Adresse</label>
            <input
              style={styles.input}
              type="text"
              value={user.address}
              onChange={(e) => setUser((prev) => ({ ...prev, address: e.target.value }))}
            />
            <label style={styles.label}>Role</label>
            <input style={styles.input} type="text" value={user.role} disabled />
            <button style={styles.actionButton} type="button" onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? "Enregistrement..." : "Enregistrer"}
            </button>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Mot de passe</h2>
            <label style={styles.label}>Mot de passe actuel</label>
            <div style={styles.passwordContainer}>
              <input style={styles.input} type={showPasswords.current ? "text" : "password"} value={passwords.current} onChange={(e) => handlePasswordChange("current", e.target.value)} />
              <button style={styles.toggleButton} onClick={() => togglePasswordVisibility("current")} type="button">{showPasswords.current ? "👁️" : "🔒"}</button>
            </div>
            <label style={styles.label}>Nouveau mot de passe</label>
            <div style={styles.passwordContainer}>
              <input style={styles.input} type={showPasswords.next ? "text" : "password"} value={passwords.next} onChange={(e) => handlePasswordChange("next", e.target.value)} />
              <button style={styles.toggleButton} onClick={() => togglePasswordVisibility("next")} type="button">{showPasswords.next ? "👁️" : "🔒"}</button>
            </div>
            <label style={styles.label}>Confirmer mot de passe</label>
            <div style={styles.passwordContainer}>
              <input style={styles.input} type={showPasswords.confirm ? "text" : "password"} value={passwords.confirm} onChange={(e) => handlePasswordChange("confirm", e.target.value)} />
              <button style={styles.toggleButton} onClick={() => togglePasswordVisibility("confirm")} type="button">{showPasswords.confirm ? "👁️" : "🔒"}</button>
            </div>
            <button style={styles.actionButton} onClick={handleSavePassword} type="button" disabled={passwordUpdating}>
              {passwordUpdating ? "Mise a jour..." : "Mettre a jour mot de passe"}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", minHeight: "100vh", background: "#f5f0e8", fontFamily: "'DM Sans', sans-serif" },
  main: { marginLeft: 220, flex: 1, padding: "32px 34px 48px" },
  header: { marginBottom: 24 },
  breadcrumb: { margin: 0, fontSize: 12, color: "#8f7a63", textTransform: "uppercase", letterSpacing: ".12em" },
  title: { margin: "8px 0 8px", fontSize: 32, fontWeight: 800, color: "#1a1714" },
  subtitle: { margin: 0, fontSize: 14, color: "#5f5246", maxWidth: 620 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  card: { background: "#fff", borderRadius: 20, border: "1px solid #e7ddd1", padding: 24, boxShadow: "0 10px 35px rgba(0,0,0,0.03)" },
  sectionTitle: { fontSize: 18, marginBottom: 16, color: "#3f352e" },
  label: { display: "block", marginBottom: 8, fontSize: 12, textTransform: "uppercase", color: "#8f7a63", letterSpacing: ".08em" },
  input: { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #d6c9b7", marginBottom: 18, fontSize: 14, color: "#3f352e" },
  passwordContainer: { position: "relative", marginBottom: 18 },
  toggleButton: { position: "absolute", right: 12, top: 12, background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "4px 8px", color: "#8f7a63", transition: "color 0.2s" },
  helperText: { margin: "0 0 18px", color: "#7a6956", fontSize: 13, lineHeight: 1.6 },
  actionButton: { width: "100%", marginTop: 4, background: "#c8651a", border: "none", color: "#fff", borderRadius: 14, padding: "14px 16px", cursor: "pointer", fontWeight: 700 },
  loading: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6e5f52" },
};
