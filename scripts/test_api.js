const { setTimeout: delay } = require('timers/promises');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@starmousse.tn';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin1234';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { status: res.status, ok: res.ok, data };
}

async function main() {
  console.log('🔎 Vérification de l’API...');
  const health = await fetchJson(`${BASE_URL}/api/health`);
  console.log('GET /api/health =>', health.status, health.data || health.statusText || '');

  if (!health.ok) {
    console.error('❌ Le backend n’est pas accessible sur le port 5000.');
    process.exit(1);
  }

  try {
    const login = await fetchJson(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });

    console.log('POST /api/users/login =>', login.status, login.data || '');

    const token = login.data?.token || login.data?.accessToken;
    if (!token) {
      console.warn('⚠️ Login non disponible : base MongoDB absente ou compte admin introuvable.');
      return;
    }

    const clients = await fetchJson(`${BASE_URL}/api/clients/getAllClients`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('GET /api/clients/getAllClients =>', clients.status, clients.data || '');
  } catch (err) {
    console.error('❌ Erreur pendant le test d’API:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Crash du script de test:', err.stack || err.message);
  process.exit(1);
});
