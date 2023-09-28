const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const demoMode = require('../middlewares/demo_mode');
const User = require('../models/userModel');

router.route('/products').get(authController.protect, productController.getProducts);
router.route('/products/:id').get(authController.protect, productController.getProduct);

module.exports = router;
