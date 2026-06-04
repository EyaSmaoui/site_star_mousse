#!/usr/bin/env node

/**
 * TEST RUNNER - E2E TESTS
 * Lance les tests Cypress pour vérifier tous les fixes
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('\n=====================================');
console.log('🧪 E2E TEST SUITE RUNNER');
console.log('=====================================\n');

// Check if Cypress is installed
const cypressPath = path.join(__dirname, '..', 'frontend', 'node_modules', '.bin', 'cypress');

if (!fs.existsSync(cypressPath)) {
  console.log('❌ Cypress not installed.');
  console.log('\nTo install Cypress, run:');
  console.log('   cd frontend');
  console.log('   npm install cypress --save-dev\n');
  process.exit(1);
}

console.log('✅ Cypress found\n');

// Ask user for test mode
const args = process.argv.slice(2);
const mode = args[0] || 'open';

const testModes = {
  'run': {
    description: 'Run all tests in headless mode',
    command: 'run',
    icon: '🚀'
  },
  'open': {
    description: 'Open Cypress UI for interactive testing',
    command: 'open',
    icon: '🎮'
  },
  'mobile': {
    description: 'Run mobile-specific tests',
    command: 'run',
    icon: '📱',
    args: ['--spec', 'cypress/e2e/01_mobile_scroll.cy.js']
  },
  'security': {
    description: 'Run security tests only',
    command: 'run',
    icon: '🔒',
    args: ['--spec', 'cypress/e2e/02_security.cy.js']
  },
  'features': {
    description: 'Run feature tests',
    command: 'run',
    icon: '⚡',
    args: ['--spec', 'cypress/e2e/03_functionality.cy.js']
  }
};

if (!testModes[mode]) {
  console.log('❌ Unknown test mode: ' + mode);
  console.log('\nAvailable modes:');
  Object.entries(testModes).forEach(([key, val]) => {
    console.log(`   ${val.icon} npm run test:${key} - ${val.description}`);
  });
  process.exit(1);
}

const testMode = testModes[mode];
console.log(`${testMode.icon} ${testMode.description}\n`);

// Build cypress command
const cypressArgs = [testMode.command];
if (testMode.args) {
  cypressArgs.push(...testMode.args);
}

// Run Cypress
const cypress = spawn('npx', ['cypress', ...cypressArgs], {
  cwd: path.join(__dirname, '..', 'frontend'),
  stdio: 'inherit'
});

cypress.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log(`\n❌ Tests failed with code ${code}`);
  }
  process.exit(code);
});
