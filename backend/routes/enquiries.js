// API routes for customer contact forms.

const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { requireAdmin } = require('../controllers/authController');

router.post('/', enquiryController.createEnquiry);
router.get('/', requireAdmin, enquiryController.getEnquiries);

module.exports = router;
