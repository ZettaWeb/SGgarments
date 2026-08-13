const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAdmin } = require('../controllers/authController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', requireAdmin, productController.createProduct);
router.put('/:id', requireAdmin, productController.updateProduct);
router.delete('/:id', requireAdmin, productController.deleteProduct);

module.exports = router;
