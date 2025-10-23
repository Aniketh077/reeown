const express = require('express');
const router = express.Router();
const stockNotificationController = require('../controllers/stockNotificationController');

router.post('/request', stockNotificationController.requestNotification);

module.exports = router;
