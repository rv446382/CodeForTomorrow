const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/', subscriptionController.createSubscription);
router.get('/active/:userId', subscriptionController.getActiveSubscription);

module.exports = router;