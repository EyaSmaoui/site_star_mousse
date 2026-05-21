const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager.Controller');
const { requireAuthUser, requireAdmin } = require('../middleware/authMiddlewares');

router.get('/getAllManagers', requireAuthUser, requireAdmin, managerController.getAllManagers);
router.post('/addManager', requireAuthUser, requireAdmin, managerController.addManager);
router.put('/updateManager/:id', requireAuthUser, requireAdmin, managerController.updateManager);
router.delete('/deleteManager/:id', requireAuthUser, requireAdmin, managerController.deleteManager);

module.exports = router;