const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.Controller');
const { requireAuthUser, requireAdmin } = require('../middleware/authMiddlewares');

router.get('/getAllClients', requireAuthUser, requireAdmin, clientController.getAllClients);
router.post('/addClient', requireAuthUser, requireAdmin, clientController.addClient);
router.put('/updateClient/:id', requireAuthUser, requireAdmin, clientController.updateClient);
router.delete('/deleteClient/:id', requireAuthUser, requireAdmin, clientController.deleteClient);

module.exports = router;