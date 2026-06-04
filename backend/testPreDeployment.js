#!/usr/bin/env node
/**
 * PRE-DEPLOYMENT TEST SCRIPT
 * Quick checks before going live
 */

const fs = require('fs');
const path = require('path');

const TESTS = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function pass(msg) {
  console.log(`✅ ${msg}`);
  TESTS.passed++;
}

function fail(msg) {
  console.log(`❌ ${msg}`);
  TESTS.failed++;
}

function warn(msg) {
  console.log(`⚠️  ${msg}`);
  TESTS.warnings++;
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    pass(`File exists: ${description}`);
    return true;
  } else {
    fail(`File missing: ${description} (${filePath})`);
    return false;
  }
}

function checkFileDoesNotExist(filePath, description) {
  if (!fs.existsSync(filePath)) {
    pass(`Removed: ${description}`);
    return true;
  } else {
    fail(`Still exists: ${description}`);
    return false;
  }
}

function checkFileContent(filePath, shouldContain, shouldNotContain) {
  if (!fs.existsSync(filePath)) {
    fail(`Cannot check - file not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let ok = true;

  if (shouldContain) {
    for (const text of (Array.isArray(shouldContain) ? shouldContain : [shouldContain])) {
      if (!content.includes(text)) {
        fail(`Missing in ${path.basename(filePath)}: ${text.substring(0, 50)}`);
        ok = false;
      }
    }
  }

  if (shouldNotContain) {
    for (const text of (Array.isArray(shouldNotContain) ? shouldNotContain : [shouldNotContain])) {
      if (content.includes(text)) {
        fail(`Still contains in ${path.basename(filePath)}: ${text.substring(0, 50)}`);
        ok = false;
      }
    }
  }

  if (ok && (shouldContain || shouldNotContain)) {
    pass(`Content check: ${path.basename(filePath)}`);
  }

  return ok;
}

function runTests() {
  console.log('═'.repeat(70));
  console.log('🔍 PRE-DEPLOYMENT VERIFICATION TESTS');
  console.log('═'.repeat(70) + '\n');

  // ============ SECURITY FIXES ============
  console.log('🔒 SECURITY FIXES\n');

  checkFileDoesNotExist(
    'backend/routes/admin.routes.js',
    'getAllUsersWithPassword endpoint'
  );

  checkFileContent(
    'backend/routes/users.routes.js',
    [],
    'debug-auth'
  );

  // ============ MOBILE FIXES ============
  console.log('\n📱 MOBILE FIXES\n');

  checkFileContent(
    'frontend/src/components/ChatbotAssistant.js',
    [],
    'document.body.style.overflow = "hidden"'
  );

  checkFileContent(
    'frontend/src/App.css',
    'overflow-y: auto',
    '@media (max-width: 960px)\n     {\n        overflow-y: hidden'
  );

  // ============ SECURITY MIDDLEWARE ============
  console.log('\n🛡️  NEW SECURITY MIDDLEWARE\n');

  checkFileExists('backend/middleware/inputValidation.js', 'Input validation middleware');
  checkFileExists('backend/middleware/rateLimiters.js', 'Rate limiting middleware');
  checkFileExists('backend/middleware/ownershipCheck.js', 'Ownership verification middleware');
  checkFileExists('backend/middleware/softDeletePlugin.js', 'Soft delete plugin');
  checkFileExists('backend/middleware/errorHandler.js', 'Error handler middleware');

  // ============ DEPENDENCIES ============
  console.log('\n📦 DEPENDENCIES\n');

  const packageJson = JSON.parse(
    fs.readFileSync('backend/package.json', 'utf8')
  );

  const requiredDeps = [
    'express-validator',
    'express-mongo-sanitize'
  ];

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      pass(`Installed: ${dep} (${packageJson.dependencies[dep]})`);
    } else {
      fail(`Missing: ${dep}`);
    }
  });

  // ============ APP.JS UPDATES ============
  console.log('\n⚙️  APPLICATION CONFIGURATION\n');

  checkFileContent(
    'backend/app.js',
    ['globalLimiter', 'globalSanitization'],
    'limit: \'50mb\''
  );

  // ============ ROUTE UPDATES ============
  console.log('\n🛣️  ROUTE UPDATES\n');

  checkFileContent(
    'backend/routes/review.routes.js',
    'verifyReviewOwnership',
    null
  );

  checkFileContent(
    'backend/routes/panier.routes.js',
    'verifyCartOwnership',
    null
  );

  // ============ SUMMARY ============
  console.log('\n' + '═'.repeat(70));
  console.log(`📊 RESULTS`);
  console.log('═'.repeat(70));
  console.log(`✅ Passed: ${TESTS.passed}`);
  console.log(`❌ Failed: ${TESTS.failed}`);
  console.log(`⚠️  Warnings: ${TESTS.warnings}`);
  console.log('═'.repeat(70) + '\n');

  if (TESTS.failed === 0) {
    console.log('🎉 ALL TESTS PASSED - Ready for deployment!\n');
    return 0;
  } else {
    console.log('⚠️  SOME TESTS FAILED - Review before deployment\n');
    return 1;
  }
}

// Run
process.exit(runTests());
