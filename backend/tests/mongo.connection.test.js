const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { connectToMongoDB } = require('../config/mongo.connection');

test('connectToMongoDB uses the configured online MongoDB URI and ignores local fallback behavior', async () => {
  const previousUri = process.env.url_Mongodb;
  const previousMongoUri = process.env.MONGODB_URI;
  const previousFallback = process.env.MONGODB_FALLBACK_URI;
  const previousAllowNoDb = process.env.ALLOW_NO_DB;

  process.env.url_Mongodb = 'mongodb+srv://user:pass@example.mongodb.net/site_star_mousse?retryWrites=true&w=majority';
  delete process.env.MONGODB_URI;
  delete process.env.MONGODB_FALLBACK_URI;
  delete process.env.ALLOW_NO_DB;

  try {
    await assert.rejects(() => connectToMongoDB(), /url_Mongodb|MONGODB_URI|MongoDB/i);
    assert.equal(mongoose.connection.readyState, 0);
  } finally {
    if (previousUri) process.env.url_Mongodb = previousUri;
    else delete process.env.url_Mongodb;
    if (previousMongoUri) process.env.MONGODB_URI = previousMongoUri;
    else delete process.env.MONGODB_URI;
    if (previousFallback) process.env.MONGODB_FALLBACK_URI = previousFallback;
    else delete process.env.MONGODB_FALLBACK_URI;
    if (previousAllowNoDb) process.env.ALLOW_NO_DB = previousAllowNoDb;
    else delete process.env.ALLOW_NO_DB;

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
});

test('connectToMongoDB rejects startup when no Mongo URI is configured', async () => {
  const previousUri = process.env.url_Mongodb;
  const previousMongoUri = process.env.MONGODB_URI;
  const previousFallback = process.env.MONGODB_FALLBACK_URI;
  const previousAllowNoDb = process.env.ALLOW_NO_DB;

  delete process.env.url_Mongodb;
  delete process.env.MONGODB_URI;
  delete process.env.MONGODB_FALLBACK_URI;
  delete process.env.ALLOW_NO_DB;

  try {
    await assert.rejects(() => connectToMongoDB(), /Configuration MongoDB|url_Mongodb|MONGODB_URI/i);
  } finally {
    if (previousUri) process.env.url_Mongodb = previousUri;
    else delete process.env.url_Mongodb;
    if (previousMongoUri) process.env.MONGODB_URI = previousMongoUri;
    else delete process.env.MONGODB_URI;
    if (previousFallback) process.env.MONGODB_FALLBACK_URI = previousFallback;
    else delete process.env.MONGODB_FALLBACK_URI;
    if (previousAllowNoDb) process.env.ALLOW_NO_DB = previousAllowNoDb;
    else delete process.env.ALLOW_NO_DB;

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
});
