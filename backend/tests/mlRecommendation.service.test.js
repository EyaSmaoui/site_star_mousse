const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateQualityScore } = require('../services/mlRecommendation.service');

test('calculateQualityScore rewards rating reviews and diversity', () => {
  const score = calculateQualityScore([
    { category: 'orthopedique', averageRating: 4.8, reviewCount: 40 },
    { category: 'ergonomique', averageRating: 4.6, reviewCount: 20 },
  ]);

  assert.ok(score > 100);
});

test('calculateQualityScore returns zero for empty recommendations', () => {
  assert.equal(calculateQualityScore([]), 0);
});
