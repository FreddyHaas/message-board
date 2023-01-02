const User = require('../models/user');

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
    res.render("sign-up-form", {});
};

// POST - Sign up
exports.user_signup_post = (req, res) => {
    res.send('NOT IMPLEMENTED: User sign up - POST');
};

// GET - Become moderator
exports.user_become_moderator_get = (req, res) => {
    res.send('NOT IMPLEMENTED: User become moderator - GET');
};

// POST - Become moderator
exports.user_become_moderator_post = (req, res) => {
    res.send('NOT IMPLEMENTED: User become moderator - POST');
};