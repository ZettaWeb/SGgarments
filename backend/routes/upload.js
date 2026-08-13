const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { requireAdmin } = require('../controllers/authController');

router.post('/', requireAdmin, uploadController.uploadImage);

module.exports = router;
