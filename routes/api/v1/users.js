const express = require('express');

const router = express.Router();

const middleware = require('../../../config/middleware');

const userController = require('../../../controllers/api/v1/userController');

const passport = require('passport');

router.post('/login', userController.login);

router.post('/register', userController.create);

router.post(
  '/edit/:id',
  passport.authenticate('jwt', { failWithError: true, session: false }),
  middleware.handleError,
  userController.update
);

module.exports = router;
