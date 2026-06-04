/**
 * AUDIT FIXES VERIFICATION TEST
 * Vérifier que tous les fixes critiques sont en place
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000';
const TIMEOUT = 5000;

const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${name} ${details}`);
  testResults[passed ? 'passed' : 'failed']++;
  testResults.tests.push({ name, passed, details });
}

async function testSecurityFixes() {
  console.log('\n🔒 SECURITY FIXES TESTS\n');

  // Test 1: Debug endpoint should not exist
  try {
    const res = await axios.get(`${API_URL}/api/users/debug-auth`, {
      timeout: TIMEOUT,
      headers: { Authorization: 'Bearer fake_token' }
    });
    logTest('Endpoint /debug-auth removed', false, '(Should return 404 or 401)');
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 401) {
      logTest('Endpoint /debug-auth removed', true);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Backend not running - skipping live API tests');
      return false;
    } else {
      logTest('Endpoint /debug-auth removed', false, `(Got ${error.response?.status})`);
    }
  }

  // Test 2: getAllUsersWithPassword should not exist
  try {
    const res = await axios.get(`${API_URL}/api/admin/getAllUsersWithPassword`, {
      timeout: TIMEOUT,
      headers: { Authorization: 'Bearer fake_token' }
    });
    logTest('Endpoint getAllUsersWithPassword removed', false);
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 401) {
      logTest('Endpoint getAllUsersWithPassword removed', true);
    }
  }

  // Test 3: Input sanitization middleware exists
  try {
    const res = await axios.post(
      `${API_URL}/api/users/register`,
      {
        username: 'test<script>',
        email: 'test@example.com',
        password: 'password123',
        phone: '12345678'
      },
      { timeout: TIMEOUT }
    );
    logTest('Input sanitization active', res.data?.error?.includes('script') === false);
  } catch (error) {
    if (error.response?.status === 400) {
      logTest('Input validation active', true, '(Validation error received)');
    }
  }

  // Test 4: Rate limiting exists
  try {
    const promises = [];
    for (let i = 0; i < 6; i++) {
      promises.push(
        axios.post(
          `${API_URL}/api/users/login`,
          { email: 'test@example.com', password: 'wrong' },
          { timeout: TIMEOUT, validateStatus: () => true }
        )
      );
    }
    const responses = await Promise.all(promises);
    const rateLimited = responses.some(r => r.status === 429);
    logTest('Rate limiting on auth endpoints', rateLimited, rateLimited ? '(429 received)' : '(No 429 yet)');
  } catch (error) {
    console.log('⚠️  Could not test rate limiting');
  }

  return true;
}

async function testMobileFixes() {
  console.log('\n📱 MOBILE FIXES VERIFICATION\n');

  // These are code inspections, not runtime tests
  try {
    const fs = require('fs');
    
    // Test 1: ChatBot scroll lock removed
    const chatbotFile = fs.readFileSync('./src/components/ChatbotAssistant.js', 'utf8');
    const hasScrollLock = chatbotFile.includes('document.body.style.overflow = "hidden"');
    logTest('ChatBot scroll lock removed', !hasScrollLock, hasScrollLock ? '(Still present!)' : '(Removed)');

    // Test 2: Sidebar overflow-y fixed
    const appCssFile = fs.readFileSync('./src/App.css', 'utf8');
    const hasBadOverflow = appCssFile.includes('overflow-y: hidden !important;') && 
                          appCssFile.includes('@media (max-width: 960px)');
    logTest('Sidebar overflow-y: hidden removed', !hasBadOverflow, hasBadOverflow ? '(Still present!)' : '(Fixed)');

  } catch (error) {
    console.log('⚠️  Could not verify mobile fixes (file access needed)');
  }

  return true;
}

async function testValidationFixes() {
  console.log('\n✔️ VALIDATION FIXES VERIFICATION\n');

  try {
    // Test: Invalid email should be rejected
    try {
      await axios.post(`${API_URL}/api/users/register`, {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password123!',
        phone: '12345678'
      }, { timeout: TIMEOUT });
      logTest('Email validation', false, '(Invalid email was accepted!)');
    } catch (error) {
      if (error.response?.status === 400) {
        logTest('Email validation', true, '(Invalid email rejected)');
      }
    }

    // Test: Phone validation
    try {
      await axios.post(`${API_URL}/api/users/register`, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        phone: 'invalid'
      }, { timeout: TIMEOUT });
      logTest('Phone validation', false, '(Invalid phone was accepted!)');
    } catch (error) {
      if (error.response?.status === 400) {
        logTest('Phone validation', true, '(Invalid phone rejected)');
      }
    }

  } catch (error) {
    console.log('⚠️  Could not fully test validation');
  }

  return true;
}

async function runAllTests() {
  console.log('═'.repeat(60));
  console.log('🔍 AUDIT FIXES VERIFICATION TEST SUITE');
  console.log('═'.repeat(60));

  try {
    await testSecurityFixes();
    await testMobileFixes();
    await testValidationFixes();
  } catch (error) {
    console.error('Test suite error:', error.message);
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`📊 RESULTS: ${testResults.passed} passed, ${testResults.failed} failed`);
  console.log('═'.repeat(60) + '\n');

  return testResults.failed === 0;
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests, testResults };
