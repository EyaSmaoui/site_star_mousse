const fs = require('fs');
const parser = require('@babel/parser');
const code = fs.readFileSync('src/components/OrderCheckout.js','utf8');
try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'classProperties'] });
  console.log('parse ok');
} catch (err) {
  console.error(err.message);
  if (err.loc) console.error('loc', err.loc);
}
