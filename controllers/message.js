const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

// GET create message
exports.message_create_get = (req, res) => {
    res.render('message-form', {
        message: undefined,
        errors: undefined,
    });
};

// POST create message
exports.message_create_post = [
    body(['title'], 'Title must be specified').isLength({ min: 1 }).escape(),
    body(['text'], 'Text must be specified').isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var message = new Message({
            title: req.body.title,
            text: req.body.text,
        });

        if(!errors.isEmpty()) {
            let errorMessages = {
                'title': undefined,
                'text': undefined,
            };
            for(let i = 0; i < errors.array().length; i++) {
                errorMessages[errors.array()[i].param] = errors.array()[i].msg;
            }

            res.render('message-form', {
                message: message,
                errors: errorMessages,
            })
        return;
        } else {
            message.save(function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        }
    }
]
// View messages
exports.message_view = (req, res) => {
    Message.find({})
    .sort({ updatedAt: 1 })
    .exec(function (err, list_messages) {
        if (err) {
            return next(err);
        }
        console.log(list_messages);
        res.render("index", {
            list_messages: list_messages,
        });
    })
};
