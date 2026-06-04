// Fonction utilitaire pour rediriger selon le rôle
export const redirectByRole = (user, navigate) => {
  switch (user.role) {
    case 'admin':
      navigate('/admin-dashboard');
      break;
    case 'gestionnaire':
    case 'manager':
    case 'employee':
    case 'employeur':
      navigate('/employee-dashboard');
      break;
    case 'client':
    case 'user':
    default:
      navigate('/client-dashboard');
      break;
  }
};

// Fonction pour vérifier si l'utilisateur a accès à une interface
export const hasAccess = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  return requiredRoles.includes(user.role);
};

// Rôles disponibles
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  GESTIONNAIRE: 'gestionnaire',
  EMPLOYEE: 'employee',
  CLIENT: 'client',
  USER: 'user'
};
