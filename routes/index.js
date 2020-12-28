const express = require('express');
const router = express.Router();

//posts route
router.use('/posts', require('./posts'));

//setting up api section
router.use('/api', require('./api'));

module.exports = router;
