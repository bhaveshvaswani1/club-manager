const express = require('express');

const router = express.Router();

const commentController = require('../../../controllers/api/v1/commentController');

router.post('/create', commentController.create);

router.post('/fetch', commentController.fetch);

router.post('/upvote', commentController.upvote);

router.post('/downvote', commentController.downvote);

module.exports = router;
