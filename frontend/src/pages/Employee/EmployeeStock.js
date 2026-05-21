import EmployeeSidebar from "./EmployeeSidebar";
import Stock from "../Admin/Stock";
import { ROLES } from "../../utils/authUtils";

export default function EmployeeStock() {
  const userData = localStorage.getItem("user");
  let user = null;
  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch {
      user = null;
    }
  }

  return (
    <Stock
      Sidebar={EmployeeSidebar}
      sidebarWidth={220}
      sidebarProps={{ user, badges: {} }}
      allowedRoles={[ROLES.MANAGER, ROLES.EMPLOYEE, "employeur"]}
      loginPath="/login/employee"
      unauthorizedMessage="Accès non autorisé"
      unauthorizedRedirect="/employer/dashboard"
    />
  );
}
