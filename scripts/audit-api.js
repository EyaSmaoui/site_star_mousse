const http = require('http');

const base = new URL(process.env.API_BASE_URL || 'http://localhost:5000/api/');
const results = [];
let token = '';

function request(method, path, body, auth = false) {
  return new Promise((resolve) => {
    const url = new URL(path.replace(/^\//, ''), base);
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      timeout: 12000,
    }, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        let data = raw;
        try { data = raw ? JSON.parse(raw) : null; } catch {}
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, data: 'timeout' });
    });
    req.on('error', (err) => resolve({ status: 0, data: err.message }));
    if (payload) req.write(payload);
    req.end();
  });
}

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
}

async function expectStatus(name, method, path, expected, body, auth = false) {
  const res = await request(method, path, body, auth);
  const ok = Array.isArray(expected) ? expected.includes(res.status) : res.status === expected;
  record(name, ok, `status ${res.status}`);
  return res;
}

async function crud(name, endpoints, payload, update) {
  const created = await expectStatus(`${name} create`, 'POST', endpoints.create, [200, 201], payload, true);
  const id = created.data && (created.data._id || created.data.id);
  if (!id) {
    record(`${name} cleanup`, false, 'created id missing');
    return;
  }
  await expectStatus(`${name} update`, 'PUT', endpoints.update(id), 200, update, true);
  await expectStatus(`${name} delete`, 'DELETE', endpoints.delete(id), 200, null, true);
}

async function main() {
  await expectStatus('health', 'GET', '/health', 200);

  const login = await request('POST', '/users/login', {
    email: 'admin@starmousse.tn',
    password: 'Admin1234',
  });
  token = login.data && login.data.token;
  record('admin login', login.status === 200 && Boolean(token), `status ${login.status}`);

  await expectStatus('products list', 'GET', '/products', 200);
  await expectStatus('recommended products', 'GET', '/products/recommended?limit=3', 200);
  await expectStatus('categories list', 'GET', '/categories/getAllCategories', 200);
  await expectStatus('reviews list', 'GET', '/reviews/getAllReviews', 200);
  await expectStatus('clients list', 'GET', '/clients/getAllClients', 200, null, true);
  await expectStatus('managers list', 'GET', '/managers/getAllManagers', 200, null, true);
  await expectStatus('orders list', 'GET', '/orders/getAllOrders', 200, null, true);
  await expectStatus('users list', 'GET', '/users/getAllUsers', 200, null, true);

  const suffix = Date.now();
  await crud('category', {
    create: '/categories/addCategory',
    update: (id) => `/categories/updateCategory/${id}`,
    delete: (id) => `/categories/deleteCategory/${id}`,
  }, { name: `Audit Category ${suffix}`, description: 'audit' }, { description: 'audit updated' });

  await crud('product', {
    create: '/products/add',
    update: (id) => `/products/update/${id}`,
    delete: (id) => `/products/delete/${id}`,
  }, {
    productId: `AUDIT-${suffix}`,
    name: `Audit Product ${suffix}`,
    description: 'audit',
    price: 99,
    category: 'audit',
    stock: 2,
    warranty: 1,
  }, { price: 101, stock: 3 });

  await crud('client', {
    create: '/clients/addClient',
    update: (id) => `/clients/updateClient/${id}`,
    delete: (id) => `/clients/deleteClient/${id}`,
  }, {
    name: `Audit Client ${suffix}`,
    email: `audit.client.${suffix}@example.com`,
    phone: '20000000',
  }, { phone: '21111111' });

  await crud('manager', {
    create: '/managers/addManager',
    update: (id) => `/managers/updateManager/${id}`,
    delete: (id) => `/managers/deleteManager/${id}`,
  }, {
    name: `Audit Manager ${suffix}`,
    email: `audit.manager.${suffix}@example.com`,
    phone: '22000000',
    role: 'manager',
  }, { phone: '23333333' });

  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log(`SUMMARY ${passed}/${results.length} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main();
