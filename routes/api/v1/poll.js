const express = require('express');

const router = express.Router();

const middleware = require('../../../config/middleware');

const pollController = require('../../../controllers/api/v1/pollController');

const passport = require('passport');

router.post(
  '/create/:id',
  passport.authenticate('jwt', { failWithError: true, session: false }),
  middleware.handleError,
  pollController.createPoll
);

router.post('/vote', pollController.vote);

router.get('/display', pollController.all);

router.post(
  '/delete/:id',
  passport.authenticate('jwt', { failWithError: true, session: false }),
  middleware.handleError,
  pollController.destroy
);

module.exports = router;
