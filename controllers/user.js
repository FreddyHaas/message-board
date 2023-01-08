const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const User = require('../models/user')

// GET - Log in
exports.user_login_get = (req, res) => {
    res.render('login-form', {})
}

// GET - Log out
exports.user_logout_get = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
}

// GET - Sign up
exports.user_signup_get = (req, res) => {
    res.render('sign-up-form', {
        user: undefined,
        errors: undefined,
        existingUser: false,
    })
}

// POST - Sign up
exports.user_signup_post = [
    body(['firstName'], 'First name must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body(['lastName'], 'Last name must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body(['username'], 'Valid email address must be provided')
        .trim()
        .isEmail()
        .escape(),
    body(['password'], 'Password must be provided')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body(['confirmPassword'], 'Passwords do not match')
        .trim()
        .custom((value, { req }) => value === req.body.password),

    (req, res, next) => {
        const errors = validationResult(req)

        const user = new User({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
        })

        // Check if username already exists
        User.findOne({ username: req.body.username }).exec(
            (err, found_username) => {
                if (err) {
                    return next(err)
                }

                // Handle errors including existing username
                if (!errors.isEmpty() || found_username !== null) {
                    user.confirmPassword = req.body.confirmPassword

                    const existingUser =
                        found_username == null ? 'false' : 'true'

                    const errorMessages = {
                        firstName: undefined,
                        lastName: undefined,
                        username: undefined,
                        password: undefined,
                        confirmPassword: undefined,
                    }
                    for (let i = 0; i < errors.array().length; i++) {
                        errorMessages[errors.array()[i].param] =
                            errors.array()[i].msg
                    }

                    res.render('sign-up-form', {
                        user,
                        errors: errorMessages,
                        existingUser,
                    })
                } else {
                    // Encrypt password
                    bcrypt.hash(
                        req.body.password,
                        10,
                        (err, hashedPassword) => {
                            if (err) {
                                return next(err)
                            }
                            user.password = hashedPassword
                            // Save login information
                            user.save((err) => {
                                if (err) {
                                    return next(err)
                                }
                                req.login(user, (err) => {
                                    if (err) {
                                        return next(err)
                                    }
                                    res.redirect('/')
                                })
                            })
                        }
                    )
                }
            }
        )
    },
]

// GET - Become moderator
exports.user_admin_get = (req, res) => {
    res.render('admin', { error: undefined })
}

// POST - Become moderator
exports.user_admin_post = [
    body(['admin'], '').escape(),
    (req, res, next) => {
        const id = req.session.passport.user
        if (req.body.admin === process.env.ADMIN_PASSWORD) {
            User.findByIdAndUpdate(id, { admin: true }, (err, result) => {
                if (err) {
                    return next(err)
                }
                res.redirect('/')
            })
        } else {
            res.render('admin', { error: 'Invalid key' })
        }
    },
]
