const Message = require('../models/message');

// GET create message
exports.message_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Message create GET');
};

// POST create message
exports.message_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Message create POST');
};

// View messages
exports.message_view = (req, res) => {
    res.render('board', { user: req.user });
};
