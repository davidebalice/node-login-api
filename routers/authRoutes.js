const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bodyParser = require('body-parser');
const demoMode = require('../utils/demo_mode');
const urlencodeParser = bodyParser.urlencoded({ extended: false });

router.route('/login').post(urlencodeParser, authController.login);

module.exports = router;
