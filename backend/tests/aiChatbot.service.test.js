const test = require('node:test');
const assert = require('node:assert/strict');
const { extractIntent, analyzeSentiment } = require('../services/aiChatbot.service');

test('extractIntent detects budget, dimension and Tunisian dialect', () => {
  const intent = extractIntent('Nheb matelas 160x190 budget 500 dt');
  assert.equal(intent.intent, 'budget');
  assert.equal(intent.dimension, '160x190');
  assert.equal(intent.budget, 500);
});

test('extractIntent detects delivery and payment intents', () => {
  assert.equal(extractIntent('livraison 48h').intent, 'delivery');
  assert.equal(extractIntent('t5alsou cash?').intent, 'payment');
});

test('analyzeSentiment returns positive and negative sentiment', () => {
  assert.equal(analyzeSentiment('super merci mrigel').sentiment, 'positive');
  assert.equal(analyzeSentiment('cher problème déçu').sentiment, 'negative');
});
