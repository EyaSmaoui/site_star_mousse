const readEnv = (key, fallback = '') => {
  const value = import.meta.env[key];
  if (value !== undefined && value !== '') return value;
  return fallback;
};

export const API_URL = readEnv('VITE_API_URL', '');
export const CHATBOT_API_URL = readEnv('VITE_CHATBOT_API_URL', 'https://starmousse-chatbot.onrender.com');
export const CHATBOT_USE_MOCK = readEnv('VITE_CHATBOT_USE_MOCK') === 'true';
export const SITE_URL = readEnv('VITE_SITE_URL', 'https://site-star-mousse.vercel.app').replace(/\/$/, '');
export const IS_DEV = import.meta.env.DEV;
