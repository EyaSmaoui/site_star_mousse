const test = require('node:test');
const assert = require('node:assert/strict');
const {
  getDeliveryCost,
  validateOrderItems,
} = require('../services/orderPricing.service');

test('calculates delivery independently from client-provided amounts', () => {
  assert.equal(getDeliveryCost('Tunis'), 8);
  assert.equal(getDeliveryCost(' tunis '), 8);
  assert.equal(getDeliveryCost('unknown-region'), 0);
});

test('rejects invalid quantities before querying products', () => {
  assert.throws(
    () => validateOrderItems([{ productId: 'product-1', quantity: 0 }]),
    (error) => error.statusCode === 400,
  );
  assert.throws(
    () => validateOrderItems([{ productId: 'product-1', quantity: 101 }]),
    (error) => error.statusCode === 400,
  );
});

test('normalizes only trusted product identity fields', () => {
  assert.deepEqual(
    validateOrderItems([{ productId: ' p-1 ', size: ' 140*190 ', quantity: 2, price: 1 }]),
    [{ productId: 'p-1', name: '', dimension: '140*190', quantity: 2 }],
  );
});
