const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
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
}

// Prefer explicit STOCK value via arg or env, default to 10
const STOCK_VALUE = (() => {
  const arg = process.argv[2];
  if (arg && !Number.isNaN(Number(arg))) return Number(arg);
  if (process.env.STOCK_VALUE && !Number.isNaN(Number(process.env.STOCK_VALUE))) return Number(process.env.STOCK_VALUE);
  return 10;
})();

(async function main() {
  try {
    const uri = process.env.url_Mongodb || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/site_star_mousse';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log('MongoDB connection state:', mongoose.connection.readyState);
    if (!mongoose.connection.db && mongoose.connection.getClient) {
      mongoose.connection.db = mongoose.connection.getClient().db();
    }
    console.log('MongoDB db object:', !!mongoose.connection.db);

    if (!mongoose.connection.db) {
      throw new Error('MongoDB connection.db is undefined');
    }

    const collection = mongoose.connection.db.collection('products');
    console.log(`Updating all documents in 'products' collection: setting stock = ${STOCK_VALUE}`);
    const res = await collection.updateMany({}, { $set: { stock: STOCK_VALUE } });
    console.log('MatchedCount:', res.matchedCount, 'ModifiedCount:', res.modifiedCount);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error updating stock:', err && err.message ? err.message : err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(2);
  }
})();
