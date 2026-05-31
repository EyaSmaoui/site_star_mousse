const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.Controller');
const { requireAuthUser, optionalAuthUser, requireAdmin, requireEmployeeOrAdmin } = require('../middleware/authMiddlewares');

router.get('/getAllOrders', requireAuthUser, requireEmployeeOrAdmin, orderController.getAllOrders);
router.get('/ping', requireAuthUser, requireEmployeeOrAdmin, orderController.getOrdersPing);
router.get('/my-orders', requireAuthUser, orderController.getUserOrders);
router.post('/addOrder', requireAuthUser, orderController.addOrder);
router.put('/updateOrder/:id', requireAuthUser, requireEmployeeOrAdmin, orderController.updateOrder);
router.delete('/deleteOrder/:id', requireAuthUser, requireEmployeeOrAdmin, orderController.deleteOrder);

module.exports = router;
