var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.Controller');

/* GET users listing. */
router.get('/esm', userController.esm) 
  


module.exports = router;
