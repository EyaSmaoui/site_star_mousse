const express = require('express');
const { getMetricsSnapshot } = require('../middleware/performanceMetrics');

const router = express.Router();

router.get('/', (req, res) => {
  res.type('application/json').json({
    ok: true,
    timestamp: new Date().toISOString(),
    metrics: getMetricsSnapshot(),
  });
});

module.exports = router;
