const { spawnSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const scriptPath = path.join(__dirname, '..', 'backend', 'scripts', 'insertUser.js');

const result = spawnSync(process.execPath, [scriptPath, ...args], {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error('Erreur de lancement du script d’insertion :', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
