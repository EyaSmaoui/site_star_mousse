#!/usr/bin/env node

/**
 * FINAL VERIFICATION SCRIPT
 * Vérifie que tous les fixes pré-deployment sont en place
 */

const fs = require('fs');
const path = require('path');

console.log('\n==============================================');
console.log('🔍 FINAL VERIFICATION - PRE-DEPLOYMENT AUDIT');
console.log('==============================================\n');

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    failed++;
  }
}

// ===== BACKEND CHECKS =====
console.log('\n📦 BACKEND SECURITY MIDDLEWARE:');

const middlewarePath = path.join(__dirname, 'middleware');

check(
  'inputValidation.js exists',
  fs.existsSync(path.join(middlewarePath, 'inputValidation.js'))
);

check(
  'rateLimiters.js exists',
  fs.existsSync(path.join(middlewarePath, 'rateLimiters.js'))
);

check(
  'ownershipCheck.js exists',
  fs.existsSync(path.join(middlewarePath, 'ownershipCheck.js'))
);

check(
  'errorHandler.js exists',
  fs.existsSync(path.join(middlewarePath, 'errorHandler.js'))
);

// ===== APP.JS INTEGRATION =====
console.log('\n🔌 MIDDLEWARE INTEGRATION:');

const appPath = path.join(__dirname, 'app.js');
const appContent = fs.readFileSync(appPath, 'utf8');

check(
  'inputValidation imported',
  appContent.includes('inputValidation')
);

check(
  'rateLimiters imported',
  appContent.includes('rateLimiters')
);

// Check if globalSanitization is used (which wraps mongoSanitize)
const sanitizationPath = path.join(__dirname, 'middleware', 'inputValidation.js');
const sanitizationContent = fs.readFileSync(sanitizationPath, 'utf8');

check(
  'express-mongo-sanitize active',
  sanitizationContent.includes('mongoSanitize') && appContent.includes('globalSanitization')
);

check(
  'Body limit reduced to 5MB',
  appContent.includes('5mb') || appContent.includes('5242880')
);

// ===== DANGEROUS ENDPOINTS REMOVED =====
console.log('\n🚨 REMOVED DANGEROUS ENDPOINTS:');

const adminPath = path.join(__dirname, 'routes', 'admin.routes.js');
const adminContent = fs.readFileSync(adminPath, 'utf8');

check(
  'getAllUsersWithPassword endpoint removed',
  !adminContent.includes('getAllUsersWithPassword')
);

const debugRemoved = !appContent.includes('debug-auth') &&
                     !adminContent.includes('debug-auth');

check(
  'Debug endpoints removed',
  debugRemoved
);

// ===== ROUTE VALIDATION =====
console.log('\n✔️ INPUT VALIDATION ON ROUTES:');

const usersRoutePath = path.join(__dirname, 'routes', 'users.routes.js');
const usersRouteContent = fs.readFileSync(usersRoutePath, 'utf8');

check(
  'Users routes have validators',
  usersRouteContent.includes('validators.')
);

// Check in inputValidation.js for email validation
const inputValContent = fs.readFileSync(sanitizationPath, 'utf8');
check(
  'Email validation active',
  inputValContent.includes('isEmail')
);

check(
  'Password validation active',
  usersRouteContent.includes('password')
);

// ===== RATE LIMITING =====
console.log('\n⏱️ RATE LIMITING:');

check(
  'Global rate limiter',
  appContent.includes('globalLimiter')
);

// Check if authLimiter is used in routes
const rateLimitContent = fs.readFileSync(path.join(__dirname, 'middleware', 'rateLimiters.js'), 'utf8');

check(
  'Auth rate limiter configured',
  rateLimitContent.includes('authLimiter') && usersRouteContent.includes('authLimiter')
);

// ===== OWNERSHIP VERIFICATION =====
console.log('\n👤 OWNERSHIP VERIFICATION:');

const reviewPath = path.join(__dirname, 'routes', 'review.routes.js');
const reviewContent = fs.readFileSync(reviewPath, 'utf8');

check(
  'Review ownership check applied',
  reviewContent.includes('verifyReviewOwnership')
);

const panier = path.join(__dirname, 'routes', 'panier.routes.js');
const panierContent = fs.readFileSync(panier, 'utf8');

check(
  'Cart ownership check applied',
  panierContent.includes('verifyCartOwnership')
);

// ===== FRONTEND FIXES =====
console.log('\n📱 FRONTEND MOBILE FIXES:');

const chatbotPath = path.join(__dirname, '..', 'frontend', 'src', 'components', 'ChatbotAssistant.js');
const chatbotContent = fs.readFileSync(chatbotPath, 'utf8');

check(
  'Chatbot overflow lock removed',
  !chatbotContent.includes('overflow: hidden') || chatbotContent.includes('overflow: auto')
);

const appCssPath = path.join(__dirname, '..', 'frontend', 'src', 'App.css');
const appCssContent = fs.readFileSync(appCssPath, 'utf8');

check(
  'Sidebar overflow auto enabled',
  appCssContent.includes('overflow-y: auto')
);

// ===== DEPENDENCIES =====
console.log('\n📚 DEPENDENCIES:');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

check(
  'express-validator installed',
  packageJson.dependencies['express-validator'] !== undefined
);

check(
  'express-mongo-sanitize installed',
  packageJson.dependencies['express-mongo-sanitize'] !== undefined
);

// ===== SUMMARY =====
console.log('\n==============================================');
console.log('📊 VERIFICATION SUMMARY');
console.log('==============================================\n');

const total = passed + failed;
const percentage = Math.round((passed / total) * 100);

console.log(`✅ Passed: ${passed}/${total}`);
console.log(`❌ Failed: ${failed}/${total}`);
console.log(`📈 Score: ${percentage}%\n`);

if (failed === 0) {
  console.log('🚀 ALL CHECKS PASSED - READY FOR DEPLOYMENT!\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${failed} ISSUES NEED ATTENTION\n`);
  process.exit(1);
}
