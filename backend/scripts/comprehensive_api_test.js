#!/usr/bin/env node

/**
 * 🧪 Script de Test Complet - Star Mousse API
 * Teste tous les endpoints CRUD et les interactions backend-frontend
 */

const http = require('http');

// ===== CONFIGURATION =====
const BASE_URL = 'http://localhost:3000/api';
let adminToken = '';
let clientToken = '';
let testResults = [];

// ===== UTILITAIRES =====
const log = (type, message, data = '') => {
  const icons = {
    '✅': '✅ PASS',
    '❌': '❌ FAIL',
    '⏳': '⏳ TEST',
    '📊': '📊 DATA',
  };
  const timestamp = new Date().toLocaleTimeString('fr-FR');
  console.log(`[${timestamp}] ${icons[type] || type} ${message}`, data);
};

const makeRequest = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

// ===== TESTS =====

async function testHealth() {
  try {
    log('⏳', 'Testing Health Check...');
    const res = await makeRequest('GET', '/api/health');
    if (res.status === 200) {
      log('✅', 'Health Check OK', res.data);
      return true;
    } else {
      log('❌', `Health Check Failed: ${res.status}`);
      return false;
    }
  } catch (e) {
    log('❌', 'Health Check Error:', e.message);
    return false;
  }
}

async function testLogin() {
  try {
    log('⏳', 'Testing Admin Login...');
    const res = await makeRequest('POST', '/users/login', {
      email: 'admin@starmousse.tn',
      password: 'Admin1234',
    });
    
    if (res.status === 200 && res.data.token) {
      adminToken = res.data.token;
      log('✅', 'Admin Login Success', `Token: ${adminToken.slice(0, 20)}...`);
      testResults.push({ test: 'Login Admin', status: 'PASS' });
      return true;
    } else {
      log('❌', 'Admin Login Failed:', res.status, res.data);
      testResults.push({ test: 'Login Admin', status: 'FAIL' });
      return false;
    }
  } catch (e) {
    log('❌', 'Admin Login Error:', e.message);
    testResults.push({ test: 'Login Admin', status: 'ERROR' });
    return false;
  }
}

async function testCRUD() {
  log('⏳', '\n=== TESTING CRUD OPERATIONS ===\n');
  
  const tests = [
    { name: 'Products', endpoint: '/products', method: 'GET' },
    { name: 'Categories', endpoint: '/categories/getAllCategories', method: 'GET' },
    { name: 'Clients', endpoint: '/clients/getAllClients', method: 'GET', auth: true },
    { name: 'Orders', endpoint: '/orders/getAllOrders', method: 'GET', auth: true },
    { name: 'Reviews', endpoint: '/reviews/getAllReviews', method: 'GET' },
    { name: 'Users', endpoint: '/users/getAllUsers', method: 'GET', auth: true },
    { name: 'Managers', endpoint: '/managers/getAllManagers', method: 'GET', auth: true },
  ];

  for (const test of tests) {
    try {
      log('⏳', `Testing ${test.name}...`);
      const headers = test.auth && adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const res = await makeRequest(test.method, test.endpoint, null, headers);
      
      if (res.status === 200) {
        log('✅', `${test.name} - GET OK`, `Count: ${Array.isArray(res.data) ? res.data.length : '?'}`);
        testResults.push({ test: `GET ${test.name}`, status: 'PASS' });
      } else {
        log('❌', `${test.name} - GET Failed (${res.status})`);
        testResults.push({ test: `GET ${test.name}`, status: 'FAIL' });
      }
    } catch (e) {
      log('❌', `${test.name} Error:`, e.message);
      testResults.push({ test: `GET ${test.name}`, status: 'ERROR' });
    }
  }
}

async function testCreateOperations() {
  if (!adminToken) {
    log('❌', 'Skipping CREATE tests - No admin token');
    return;
  }

  log('⏳', '\n=== TESTING CREATE OPERATIONS ===\n');

  // Test Create Category
  try {
    log('⏳', 'Testing Create Category...');
    const categoryRes = await makeRequest('POST', '/categories/addCategory', 
      {
        name: `Test Category ${Date.now()}`,
        description: 'Catégorie de test',
      },
      { Authorization: `Bearer ${adminToken}` }
    );
    if (categoryRes.status === 201) {
      log('✅', 'Create Category OK', categoryRes.data._id);
      testResults.push({ test: 'POST Category', status: 'PASS' });
    } else {
      log('❌', `Create Category Failed (${categoryRes.status})`);
      testResults.push({ test: 'POST Category', status: 'FAIL' });
    }
  } catch (e) {
    log('❌', 'Create Category Error:', e.message);
    testResults.push({ test: 'POST Category', status: 'ERROR' });
  }

  // Test Create Product
  try {
    log('⏳', 'Testing Create Product...');
    const productRes = await makeRequest('POST', '/products/add',
      {
        productId: `PROD-${Date.now()}`,
        name: `Test Product ${Date.now()}`,
        description: 'Produit de test',
        price: 99.99,
        category: 'test',
        stock: 10,
        warranty: '1 an',
      },
      { Authorization: `Bearer ${adminToken}` }
    );
    if (productRes.status === 201 || productRes.status === 200) {
      log('✅', 'Create Product OK', productRes.data._id);
      testResults.push({ test: 'POST Product', status: 'PASS' });
    } else {
      log('❌', `Create Product Failed (${productRes.status})`);
      testResults.push({ test: 'POST Product', status: 'FAIL' });
    }
  } catch (e) {
    log('❌', 'Create Product Error:', e.message);
    testResults.push({ test: 'POST Product', status: 'ERROR' });
  }
}

async function printSummary() {
  log('📊', '\n=== TEST SUMMARY ===\n');
  const passed = testResults.filter(t => t.status === 'PASS').length;
  const failed = testResults.filter(t => t.status === 'FAIL').length;
  const errors = testResults.filter(t => t.status === 'ERROR').length;
  const total = testResults.length;

  testResults.forEach(t => {
    const icon = t.status === 'PASS' ? '✅' : t.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${t.test}: ${t.status}`);
  });

  log('📊', `\nRésultats: ${passed}/${total} PASS, ${failed} FAIL, ${errors} ERRORS`);
  const percentage = Math.round((passed / total) * 100);
  log('📊', `Taux de réussite: ${percentage}%\n`);
}

// ===== MAIN =====
async function runTests() {
  log('⏳', '🧪 Démarrage des tests de l\'API Star Mousse...\n');

  const isHealthy = await testHealth();
  if (!isHealthy) {
    log('❌', 'Serveur non accessible. Arrêt des tests.');
    process.exit(1);
  }

  await testLogin();
  await testCRUD();
  await testCreateOperations();
  await printSummary();

  process.exit(testResults.some(t => t.status === 'FAIL' || t.status === 'ERROR') ? 1 : 0);
}

// Attendre que le serveur démarre
setTimeout(runTests, 2000);
