const express = require('express');
const router = express.Router();

const homeController = require('../../../controllers/api/v1/homeController');

router.get('/', homeController.home);

module.exports = router;
