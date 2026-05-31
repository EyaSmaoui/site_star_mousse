const fs = require('fs');
const path = require('path');
const http = require('http');

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api/';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@starmousse.tn';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin1234';

let token = '';

function request(method, route, body, auth = false) {
  return new Promise((resolve) => {
    const url = new URL(route.replace(/^\//, ''), API_BASE);
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      timeout: 15000,
    }, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        let data = raw;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch {}
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, status: 0, data: 'timeout' });
    });
    req.on('error', (err) => resolve({ ok: false, status: 0, data: err.message }));
    if (payload) req.write(payload);
    req.end();
  });
}

async function fetchItem(item) {
  const startedAt = Date.now();
  const res = await request('GET', item.route, null, item.auth);
  return {
    key: item.key,
    route: item.route,
    status: res.status,
    ok: res.ok,
    durationMs: Date.now() - startedAt,
    count: Array.isArray(res.data) ? res.data.length : null,
    data: res.data,
  };
}

async function main() {
  const startedAt = new Date();
  const login = await request('POST', 'users/login', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (!login.ok || !login.data?.token) {
    console.error(`Login admin failed: status ${login.status}`);
    console.error(login.data);
    process.exit(1);
  }

  token = login.data.token;

  const items = [
    { key: 'health', route: 'health', auth: false },
    { key: 'products', route: 'products', auth: false },
    { key: 'recommendedProducts', route: 'products/recommended?limit=12', auth: false },
    { key: 'categories', route: 'categories/getAllCategories', auth: false },
    { key: 'reviews', route: 'reviews/getAllReviews', auth: false },
    { key: 'clients', route: 'clients/getAllClients', auth: true },
    { key: 'managers', route: 'managers/getAllManagers', auth: true },
    { key: 'orders', route: 'orders/getAllOrders', auth: true },
    { key: 'users', route: 'users/getAllUsers', auth: true },
  ];

  const fetched = await Promise.all(items.map(fetchItem));
  const exportData = {
    exportedAt: startedAt.toISOString(),
    apiBase: API_BASE,
    summary: fetched.map(({ key, route, status, ok, durationMs, count }) => ({
      key,
      route,
      status,
      ok,
      durationMs,
      count,
    })),
    data: Object.fromEntries(fetched.map((item) => [item.key, item.data])),
  };

  const outDir = path.resolve(__dirname, '..', 'exports');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = startedAt.toISOString().replace(/[:.]/g, '-');
  const outFile = path.join(outDir, `star-mousse-data-${stamp}.json`);
  fs.writeFileSync(outFile, JSON.stringify(exportData, null, 2), 'utf8');

  console.log(`Export saved: ${outFile}`);
  for (const item of exportData.summary) {
    console.log(`${item.ok ? 'OK' : 'FAIL'} ${item.key}: status=${item.status}, count=${item.count ?? '-'}, ${item.durationMs}ms`);
  }
}

main();
