var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var User = require('../models/user');

// Auhtentication
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
      }));
    })
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// MESSAGE ROUTES

// Require controller modules
const message_controller = require('../controllers/message');
const user_controller = require('../controllers/user');

// GET view of all messages
router.get('/', message_controller.message_view);

// GET request to create a new message
router.get('/message', message_controller.message_create_get);

// POST request to create a new message
router.post('/message', message_controller.message_create_post);

// USER ROUTES

// GET request to login 
router.get('/login', user_controller.user_login_get);

// POST request to login
router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login', 
    failureFlash: true }),
);

// GET request to logout 
router.get('/logout', user_controller.user_logout_get);

// GET request to sign up
router.get('/signup', user_controller.user_signup_get);

// POST request to sign up 
router.post('/signup', user_controller.user_signup_post);

// GET request to become admin
router.get('/admin', user_controller.user_admin_get);

// POST request to become admin
router.post('/admin', user_controller.user_admin_post);

module.exports = router;
