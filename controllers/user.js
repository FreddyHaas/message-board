const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { check, body, validationResult } = require('express-validator');

// GET - Log in
exports.user_login_get = (req, res) => {
    res.send('NOT IMPLEMENTED: User log in - GET');
};

// POST - Log in
exports.user_login_post = (req, res) => {
    res.send('NOT IMPLEMENTED: User log in - POST');
};

// GET - Log out
exports.user_logout_get = (req, res) => {
    res.send('NOT IMPLEMENTED: User log out - GET');
};

// POST - Log out
exports.user_logout_post = (req, res) => {
    res.send('NOT IMPLEMENTED: User log out - POST');
};

// GET - Sign up
exports.user_signup_get = (req, res) => {
    res.render('sign-up-form', {
        user: undefined,
        errors: undefined,
        existingUser: false,
    });
};

// POST - Sign up
exports.user_signup_post = [
    body(['firstName'], 'First name must be specified').trim().isLength({ min: 1 }).escape(),
    body(['lastName'], 'Last name must be specified').trim().isLength({ min: 1 }).escape(),
    body(['username'], 'Valid email address must be provided').trim().isEmail().escape(),
    body(['password'], 'Password must be provided').trim().isLength({ min: 1}).escape(),
    body(['confirmPassword'], 'Passwords do not match')
    .trim()
    .custom((value, { req }) => value === req.body.password),

    (req, res, next) => {
        const errors = validationResult(req);

        var user = new User({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
        });

        // Check if username already exists 
        User.findOne({ username: req.body.username }).exec(function (err, found_username) {
            if(err) {
                return next (err);
            }

            // Handle errors including existing username
            if(!errors.isEmpty() || found_username !== undefined) {
                user.confirmPassword = req.body.confirmPassword;

                let existingUser = found_username ? 'true' : 'false';
                
                let errorMessages = {
                    'firstName': undefined,
                    'lastName': undefined,
                    'username': undefined,
                    'password': undefined,
                    'confirmPassword': undefined,
                };
                for(let i = 0; i < errors.array().length; i++) {
                    errorMessages[errors.array()[i].param] = errors.array()[i].msg;
                }

                console.log(errorMessages);
                res.render('sign-up-form', {
                    user: user,
                    errors: errorMessages,
                    existingUser: existingUser,
                })
            return;
            } else {
                // Encrypt password
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if(err) {
                        return next(err);
                    }
                });
                // Save login information
                user.save(function(err) {
                    if (err) {
                        return next(err);
                    }

                    res.send('Success');
                });
            }
        })
    },
];

// GET - Become moderator
exports.user_become_moderator_get = (req, res) => {
    res.send('NOT IMPLEMENTED: User become moderator - GET');
};

// POST - Become moderator
exports.user_become_moderator_post = (req, res) => {
    res.send('NOT IMPLEMENTED: User become moderator - POST');
};