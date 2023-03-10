const express = require('express')

const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// Authentication
passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username' })
            }
            if (
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        return done(null, user)
                    }
                    return done(null, false, { message: 'Incorrect password' })
                })
            );
        })
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

// MESSAGE ROUTES

// Require controller modules
const message_controller = require('../controllers/message')
const user_controller = require('../controllers/user')

// GET view of all messages
router.get('/', message_controller.message_view)

// GET request to create a new message
router.get('/message', message_controller.message_create_get)

// POST request to create a new message
router.post('/message', message_controller.message_create_post)

// POST request to delete message
router.post('/message/delete', message_controller.message_delete_post)

// USER ROUTES

// GET request to login
router.get('/login', user_controller.user_login_get)

// POST request to login
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })
)

// GET request to logout
router.get('/logout', user_controller.user_logout_get)

// GET request to sign up
router.get('/signup', user_controller.user_signup_get)

// POST request to sign up
router.post('/signup', user_controller.user_signup_post)

// GET request to become admin
router.get('/admin', user_controller.user_admin_get)

// POST request to become admin
router.post('/admin', user_controller.user_admin_post)

module.exports = router
