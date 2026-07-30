const fs = require('fs');
const path = require('path');

try {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = pkg.version || '0.0.0';
  const out = {
    version,
    buildTime: new Date().toISOString(),
  };
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'version.json'), JSON.stringify(out, null, 2));
  console.log('Wrote public/version.json:', out);
  process.exit(0);
} catch (err) {
  console.error('Failed to write version.json', err);
  process.exit(1);
}
