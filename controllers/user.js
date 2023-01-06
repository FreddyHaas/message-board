const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var User = require('../models/user');

// GET - Log in
exports.user_login_get = (req, res) => {
    res.render('login-form', {});
};

// GET - Log out
exports.user_logout_get = (req, res, next) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        res.redirect("/");
    });
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
    body(['firstName'], 'First name must be specified').isLength({ min: 1 }).escape(),
    body(['lastName'], 'Last name must be specified').isLength({ min: 1 }).escape(),
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
            if(!errors.isEmpty() || found_username !== null) {
                user.confirmPassword = req.body.confirmPassword;

                let existingUser = (found_username == null) ? 'false' : 'true';
                
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
                    user.password = hashedPassword;
                    // Save login information
                    user.save(function(err) {
                        if (err) {
                            return next(err);
                        }
                        req.login(user, function(err) {
                            if (err) { return next(err) };
                            res.redirect('/');
                        })
                    });
                });                
            }
        })
    },
];

// GET - Become moderator
exports.user_admin_get = (req, res) => {
    res.render('admin', {error: undefined});
}

// POST - Become moderator
exports.user_admin_post = [ 
    body(['admin'], '').escape(),
    (req, res, next) => {
        let id = req.session.passport.user;
        if (req.body.admin === 'admin123') {
            User.findByIdAndUpdate(id, { admin: true }, function(err, result) {
                if(err) {
                    return next (err);
                } 
                res.redirect('/');
                return;
            });
        } else {
            res.render('admin', {error: 'Invalid key'});
        };
    }
]