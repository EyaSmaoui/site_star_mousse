const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..', 'frontend', 'build');
const port = 4174;
const baseUrl = `http://127.0.0.1:${port}`;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
};

function createServer() {
  return http.createServer((req, res) => {
    const rawPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.resolve(root, rawPath === '/' ? 'index.html' : `.${rawPath}`);
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (statErr, stat) => {
      if (statErr || !stat.isFile()) filePath = path.join(root, 'index.html');
      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      });
    });
  });
}

async function auditRoute(page, route, options = {}) {
  const errors = [];
  const failedRequests = [];
  const clicked = [];

  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) errors.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.method()} ${request.url()} -> ${request.failure()?.errorText || 'failed'}`);
  });

  if (options.storage) {
    await page.addInitScript((storage) => {
      Object.entries(storage).forEach(([key, value]) => localStorage.setItem(key, value));
    }, options.storage);
  }

  page.setDefaultTimeout(2500);
  page.setDefaultNavigationTimeout(5000);
  page.on('dialog', (dialog) => dialog.dismiss().catch(() => {}));

  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 7000 });
  await page.waitForTimeout(700);

  const title = await page.title();
  const h1 = await page.locator('h1').first().textContent().catch(() => '');
  const buttons = await page.locator('button:visible').count();
  const links = await page.locator('a:visible').count();

  const interactive = page.locator('button:visible, a:visible');
  const limit = Math.min(await interactive.count(), 8);
  for (let i = 0; i < limit; i += 1) {
    const item = interactive.nth(i);
    const label = ((await item.innerText().catch(() => '')) || (await item.getAttribute('aria-label').catch(() => '')) || '').trim();
    const href = await item.getAttribute('href').catch(() => null);
    if (!label && !href) continue;
    if (href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'))) continue;

    const before = page.url();
    await item.click({ timeout: 1500 }).catch((err) => {
      clicked.push(`FAIL ${label || href}: ${err.message.split('\n')[0]}`);
    });
    await page.waitForTimeout(150);
    clicked.push(`OK ${label || href}: ${before.replace(baseUrl, '')} -> ${page.url().replace(baseUrl, '')}`);
    if (page.url() !== before) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.waitForTimeout(150);
    }
  }

  return {
    route,
    title,
    h1: (h1 || '').trim(),
    buttons,
    links,
    errors: [...new Set(errors)],
    failedRequests: [...new Set(failedRequests)],
    clicked,
  };
}

async function main() {
  const server = createServer();
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));

  const browser = await chromium.launch();
  const routes = ['/', '/products', '/promos', '/about', '/help', '/quiz', '/login', '/register', '/forgot-password'];
  const protectedRoutes = [
    ['/admin-dashboard', { token: 'fake-token', user: JSON.stringify({ role: 'admin', name: 'Audit Admin' }) }],
    ['/manage-clients', { token: 'fake-token', user: JSON.stringify({ role: 'admin', name: 'Audit Admin' }) }],
    ['/manage-managers', { token: 'fake-token', user: JSON.stringify({ role: 'admin', name: 'Audit Admin' }) }],
    ['/admin/orders', { token: 'fake-token', user: JSON.stringify({ role: 'admin', name: 'Audit Admin' }) }],
    ['/client-dashboard', { token: 'fake-token', user: JSON.stringify({ role: 'client', name: 'Audit Client' }) }],
    ['/client-orders', { token: 'fake-token', user: JSON.stringify({ role: 'client', name: 'Audit Client' }) }],
    ['/employee-dashboard', { token: 'fake-token', user: JSON.stringify({ role: 'employee', name: 'Audit Employee' }) }],
    ['/employer/orders', { token: 'fake-token', user: JSON.stringify({ role: 'employee', name: 'Audit Employee' }) }],
    ['/employer/inventory', { token: 'fake-token', user: JSON.stringify({ role: 'employee', name: 'Audit Employee' }) }],
  ];

  const results = [];
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    const result = await auditRoute(page, route);
    results.push(result);
    console.log(JSON.stringify(result));
    await page.close();
  }
  for (const [route, storage] of protectedRoutes) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    const result = await auditRoute(page, route, { storage });
    results.push(result);
    console.log(JSON.stringify(result));
    await page.close();
  }

  await browser.close();
  server.close();
  console.error(`Audited ${results.length} routes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
