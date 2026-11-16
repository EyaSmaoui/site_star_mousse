import axios from 'axios';
import { API_URL } from '../utils/env';

const localApiCandidates = ['', 'http://localhost:5000', 'http://127.0.0.1:5000'];

const normalizeApiUrl = (url) => {
  const value = String(url || '').trim().replace(/\/$/, '');

  if (!value || value === '/api') {
    return '';
  }

  return value.replace(/\/api$/, '');
};

const baseURL = normalizeApiUrl(API_URL);

const isLocalApiBase = (url) => {
  if (!url) return true;
  return localApiCandidates.some((candidate) => {
    if (!candidate) return true;
    return url === candidate || url.startsWith(`${candidate}/`);
  });
};

const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

const shouldRetryWithFallback = (error) => {
  if (error.config?.__retriedWithFallback) return false;
  if (!isLocalApiBase(baseURL)) return false;

  const status = error.response?.status;
  if (status && [408, 429, 500, 502, 503, 504].includes(status)) {
    return true;
  }

  return ['ERR_NETWORK', 'ECONNABORTED'].includes(error.code);
};

const getResponseMessage = (error) => {
  const data = error.response?.data;
  if (typeof data === 'string') return data;
  return data?.error || data?.message || '';
};

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
    console.error('Request interceptor error:', error.message);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : Gestion des erreurs de Token
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (shouldRetryWithFallback(error)) {
      const retryConfig = {
        ...error.config,
        baseURL: '',
        __retriedWithFallback: true,
      };
      console.warn('Retrying API request against the configured API base URL', {
        url: error.config?.url,
        status: error.response?.status,
        code: error.code,
      });
      return httpClient.request(retryConfig);
    }

    const responseMessage = getResponseMessage(error);
    if (responseMessage) {
      error.message = responseMessage;
    }

    if (error.response?.status === 401) {
      const message = responseMessage;
      if (message.includes('Token invalide') || message.includes('Token not found')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Meilleur handling des erreurs
    if (error.code === 'ECONNABORTED') {
      error.message = 'Timeout - Le serveur met trop de temps à répondre';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Erreur réseau - Impossible de contacter le serveur';
    }
    
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

export const apiPath = (path = '') => `${baseURL}${path.startsWith('/') ? path : `/${path}`}`;

export default httpClient;
