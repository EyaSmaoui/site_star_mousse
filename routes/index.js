var express = require('express');
var router = express.Router();

/* GET home page. */
router.delete('/', function(req, res, next) {
  res.json('merhbe');
});

module.exports = router;
