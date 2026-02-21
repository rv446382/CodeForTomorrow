const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');

router.post('/', usageController.recordUsage);

module.exports = router;