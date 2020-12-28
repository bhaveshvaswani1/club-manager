const express = require('express');
const router = express.Router();
const eventController = require('../../../controllers/api/v1/eventController');
const passport = require('passport');
const middleware = require('../../../config/middleware');

router.post(
  '/addEvent/:userid',
  passport.authenticate('jwt', { failWithError: true, session: false }),
  middleware.handleError,
  eventController.newEvent
);

router.post(
  '/edit/:id',
  passport.authenticate('jwt', { failWithError: true, session: false }),
  middleware.handleError,
  eventController.update
);

router.post(
  '/destroy/:id',
  passport.authenticate('jwt', { failWithError: true, session: false }),
  middleware.handleError,
  eventController.destroy
);

module.exports = router;
