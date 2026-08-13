const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { requireAdmin } = require('../controllers/authController');

router.get('/', configController.getConfig);
router.put('/', requireAdmin, configController.updateConfig);

module.exports = router;
