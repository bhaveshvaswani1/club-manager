const express = require('express'),
  app = express(),
  port = 8000,
  passport = require('passport'),
  passportJwt = require('./config/passport_jwt_strategy'),
  expressLayouts = require('express-ejs-layouts'),
  session = require('express-session'),
  db = require('./config/mongoose'),
  path = require('path');

//form controller
app.use(express.urlencoded({ extended: true }));

//settimg up uploads
app.use('/uploads', express.static(__dirname + '/uploads'));

//express layout
app.use(expressLayouts);
//extract styles and scripts fron sub pages
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
//view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//add authentication via passport
app.use(
  session({
    name: 'club_manager',
    secret: 'something',
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'));

//port config
app.listen(port, function (err) {
  if (err) {
    console.log(`There is some error starting the server:${err}`);
  }
  console.log(`Server is running on port:${port}`);
});
