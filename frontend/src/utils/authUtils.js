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

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  return token && token !== 'null' && token !== 'undefined' ? token : null;
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

export const clearAuth = () => {
  clearToken();
  clearStoredUser();
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
