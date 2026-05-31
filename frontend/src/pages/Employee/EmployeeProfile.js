import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmployeeSidebar from "./EmployeeSidebar";
import { hasAccess, ROLES } from "../../utils/authUtils";
import { changePassword, updateProfile } from "../../services/apiUser";

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "Utilisateur", email: "user@starmousse.tn", phone: "+216 20 123 456" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(true);

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
      toast.error("Accès non autorisé");
      navigate("/login");
      return;
    }

    setUser((prev) => ({ ...prev, username: parsedUser.username || prev.username, email: parsedUser.email || prev.email }));
    setLoading(false);
  }, [navigate]);

  const handleChange = (field, value) => {
    setUser((current) => ({ ...current, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((current) => ({ ...current, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        username: user.username,
        phone: user.phone,
        address: user.address || ''
      });
      toast.success("Profil mis à jour avec succès");
      // Mettre à jour localStorage
      const updatedUser = { ...JSON.parse(localStorage.getItem('user')), ...user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleSavePassword = async () => {
    if (passwords.next !== passwords.confirm) {
      toast.error("Les nouveaux mots de passe doivent correspondre");
      return;
    }
    if (!passwords.current || !passwords.next) {
      toast.error("Veuillez compléter tous les champs de sécurité");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
        confirmPassword: passwords.confirm,
      });
      toast.success("Mot de passe modifié avec succès");
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors du changement de mot de passe");
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
            <p style={styles.breadcrumb}>Employé / Profil</p>
            <h1 style={styles.title}>Mon profil</h1>
            <p style={styles.subtitle}>Gérez vos informations de contact et changez votre mot de passe en toute sécurité.</p>
          </div>
        </div>

        <div style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Informations personnelles</h2>
            <label style={styles.label}>Nom</label>
            <input style={styles.input} value={user.username} onChange={(e) => handleChange("username", e.target.value)} />
            <label style={styles.label}>Email</label>
            <input style={styles.input} value={user.email} onChange={(e) => handleChange("email", e.target.value)} />
            <label style={styles.label}>Téléphone</label>
            <input style={styles.input} value={user.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            <button style={styles.actionButton} onClick={handleSaveProfile}>Enregistrer mes informations</button>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Sécurité</h2>
            <p style={styles.helperText}>Changez votre mot de passe après la création du compte par l’administrateur.</p>
            <label style={styles.label}>Mot de passe actuel</label>
            <input style={styles.input} type="password" value={passwords.current} onChange={(e) => handlePasswordChange("current", e.target.value)} />
            <label style={styles.label}>Nouveau mot de passe</label>
            <input style={styles.input} type="password" value={passwords.next} onChange={(e) => handlePasswordChange("next", e.target.value)} />
            <label style={styles.label}>Confirmer le mot de passe</label>
            <input style={styles.input} type="password" value={passwords.confirm} onChange={(e) => handlePasswordChange("confirm", e.target.value)} />
            <button style={styles.actionButton} onClick={handleSavePassword}>Mettre à jour le mot de passe</button>
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
  helperText: { margin: "0 0 18px", color: "#7a6956", fontSize: 13, lineHeight: 1.6 },
  actionButton: { width: "100%", marginTop: 4, background: "#c8651a", border: "none", color: "#fff", borderRadius: 14, padding: "14px 16px", cursor: "pointer", fontWeight: 700 },
  loading: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6e5f52" },
};
