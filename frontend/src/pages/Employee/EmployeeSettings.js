import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmployeeSidebar from "./EmployeeSidebar";
import { changePassword } from "../../services/apiUser";
import { hasAccess, ROLES } from "../../utils/authUtils";

export default function EmployeeSettings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

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
      }
    } catch {
      navigate("/login/employee");
    }
  }, [navigate]);

  const saveTheme = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    toast.success("Préférence enregistrée");
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.warning("Complétez tous les champs.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.warning("Les mots de passe ne correspondent pas.");
      return;
    }
    setSaving(true);
    try {
      await changePassword(passwords);
      toast.success("Mot de passe mis à jour");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.error || "Impossible de changer le mot de passe.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.root}>
      <EmployeeSidebar />
      <main className="employee-main sm-internal-main" style={S.main}>
        <p style={S.eyebrow}>Employé / Paramètres</p>
        <h1 style={S.title}>Paramètres</h1>
        <div className="sm-settings-grid" style={S.grid}>
          <section className="sm-settings-card" style={S.card}>
            <h2 style={S.cardTitle}>Apparence</h2>
            <p style={S.text}>Choisissez le thème utilisé dans les espaces internes.</p>
            <div style={S.segment}>
              {["light", "dark"].map((item) => (
                <button
                  key={item}
                  type="button"
                  style={{ ...S.segmentBtn, ...(theme === item ? S.segmentActive : {}) }}
                  onClick={() => saveTheme(item)}
                >
                  {item === "light" ? "Clair" : "Sombre"}
                </button>
              ))}
            </div>
          </section>

          <form className="sm-settings-card" style={S.card} onSubmit={submitPassword}>
            <h2 style={S.cardTitle}>Sécurité</h2>
            <p style={S.text}>Changez votre mot de passe sans passer par l'administrateur.</p>
            <PasswordField label="Mot de passe actuel" value={passwords.currentPassword} onChange={(value) => setPasswords((p) => ({ ...p, currentPassword: value }))} />
            <PasswordField label="Nouveau mot de passe" value={passwords.newPassword} onChange={(value) => setPasswords((p) => ({ ...p, newPassword: value }))} />
            <PasswordField label="Confirmation" value={passwords.confirmPassword} onChange={(value) => setPasswords((p) => ({ ...p, confirmPassword: value }))} />
            <button style={S.submit} disabled={saving}>{saving ? "Enregistrement..." : "Mettre à jour"}</button>
          </form>
        </div>
      </main>
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  return (
    <label style={S.field}>
      <span>{label}</span>
      <input type="password" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

const S = {
  root: { display: "flex", minHeight: "100vh", background: "#fdf6ef", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1f2937" },
  main: { marginLeft: 220, flex: 1, padding: "30px 34px" },
  eyebrow: { margin: 0, color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: ".12em" },
  title: { margin: "8px 0 24px", fontSize: 32 },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18 },
  card: { background: "#fff", border: "1px solid #f0e8df", borderRadius: 12, padding: 22, boxShadow: "0 18px 46px rgba(21,21,34,.06)" },
  cardTitle: { margin: "0 0 8px", fontSize: 18 },
  text: { margin: "0 0 18px", color: "#6b7280", fontSize: 14 },
  segment: { display: "inline-flex", border: "1px solid #e5e7eb", borderRadius: 999, padding: 4, background: "#f9fafb" },
  segmentBtn: { border: 0, borderRadius: 999, background: "transparent", padding: "9px 18px", cursor: "pointer", fontWeight: 800, color: "#6b7280" },
  segmentActive: { background: "#b52f2f", color: "#fff" },
  field: { display: "flex", flexDirection: "column", gap: 7, marginBottom: 12, fontSize: 13, fontWeight: 800, color: "#6b7280" },
  submit: { width: "100%", marginTop: 8, border: 0, borderRadius: 8, padding: "12px 16px", background: "#b52f2f", color: "#fff", cursor: "pointer", fontWeight: 900 },
};
