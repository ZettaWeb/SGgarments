// API routes for WhatsApp order tracking.

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAdmin } = require('../controllers/authController');

router.post('/', orderController.createOrder);
router.get('/', requireAdmin, orderController.getOrders);

module.exports = router;
