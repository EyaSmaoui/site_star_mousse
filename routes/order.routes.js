const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.Controller');

// CRUD
router.get('/getAllOrders', orderController.getAllOrders);
router.get('/getOrderById', orderController.getOrderById);
router.post('/addOrder', orderController.addOrder);
router.put('/updateOrder/:id', orderController.updateOrder);
router.delete('/deleteOrder/:id', orderController.deleteOrder);



module.exports = router;