require('dotenv').config();
const required = [
  'URL_MONGODB',
  'JWT_SECRET',
  'SESSION_SECRET',
  'FRONTEND_URL'
];

const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(2);
}

console.log('All required environment variables are present.');
process.exit(0);
