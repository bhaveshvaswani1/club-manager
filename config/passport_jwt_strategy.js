const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../modals/User');

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'something',
};

passport.use(
  new JwtStrategy(opts, function (jwtPayload, done) {
    User.findById(jwtPayload._id, function (err, user) {
      if (err) {
        console.log('Error in finding user from jwt');
        return;
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

//serialise the user to decide which key to keep in the cookie
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserialising the user from the key the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('error in finding user -->  Passport');
      done(err);
    }
    return done(null, user);
  });
});

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in then pass the request to the function (controllers action)
  if (req.isAuthenticated()) {
    return next();
  }
  //if user is not signed in
  return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in user from session cookie and we are just sending the user from requests to response
    res.locals.user = req.user;
  }
  return next();
};

module.exports = passport;
