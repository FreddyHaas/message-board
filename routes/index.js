var express = require('express');
var router = express.Router();

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
router.post('/login', user_controller.user_login_post);

// GET request to sign up
router.get('/signup', user_controller.user_signup_get);

// POST request to sign up 
router.post('/signup', user_controller.user_signup_post);

// GET request to become moderator
router.get('/moderator', user_controller.user_become_moderator_get);

// POST request to become moderator
router.post('/moderator', user_controller.user_become_moderator_post);

module.exports = router;
