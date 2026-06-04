const fs = require('fs');
const path = require('path');
const { connectToMongoDB } = require('./config/mongo.connection');
const mongoose = require('mongoose');

const loadEnvFile = () => {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf-8');
  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').trim();
    if (key && value && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
};

loadEnvFile();

(async () => {
  try {
    await connectToMongoDB();
    const coll = mongoose.connection.db.collection('products');
    const res = await coll.updateMany({}, { $set: { stock: 10 } });
    console.log('MatchedCount:', res.matchedCount, 'ModifiedCount:', res.modifiedCount);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err && err.message ? err.message : err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
})();
