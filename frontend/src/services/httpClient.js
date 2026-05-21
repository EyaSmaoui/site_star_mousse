import axios from 'axios';

// Puisque tu utilises le "proxy" dans package.json, l'URL de base est simplement '/api'
const baseURL = '/api';

const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercepteur de requête : Ajout propre du Token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Initialisation sécurisée des en-têtes
    config.headers = config.headers || {};

    // Nettoyage pour éviter les doublons accidentels et l'erreur 431
    delete config.headers['Authorization'];
    delete config.headers['authorization'];

    if (token && token !== 'null' && token !== 'undefined') {
      const bearer = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      // On utilise UNIQUEMENT la norme standard avec la majuscule
      config.headers['Authorization'] = bearer;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : Gestion des erreurs de Token
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.error || error.response?.data?.message || '';
      if (message.includes('Token invalide') || message.includes('Token not found')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optionnel : Rediriger vers la page de login si nécessaire
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;