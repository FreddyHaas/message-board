const { body, validationResult } = require('express-validator')
const Message = require('../models/message')

// GET create message
exports.message_create_get = (req, res) => {
    res.render('message-form', {
        message: undefined,
        errors: undefined,
    })
}

// POST create message
exports.message_create_post = [
    body(['title'], 'Title must be specified').isLength({ min: 1 }).escape(),
    body(['text'], 'Text must be specified').isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req)

        // Check if user is logged in, otherwise return to login page
        if (req.session.passport?.user === undefined) {
            res.redirect('/login')
            return
        }

        const message = new Message({
            title: req.body.title,
            text: req.body.text,
            user: req.session.passport.user,
        })

        if (!errors.isEmpty()) {
            const errorMessages = {
                title: undefined,
                text: undefined,
            }
            for (let i = 0; i < errors.array().length; i++) {
                errorMessages[errors.array()[i].param] = errors.array()[i].msg
            }

            res.render('message-form', {
                message,
                errors: errorMessages,
            })
        } else {
            message.save((err) => {
                if (err) {
                    return next(err)
                }
                res.redirect('/')
            })
        }
    },
]

// POST delete message
exports.message_delete_post = (req, res, next) => {
    Message.findByIdAndRemove(req.body.messageid, (err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
}

// View messages
exports.message_view = (req, res, next) => {
    Message.find({})
        .sort({ updatedAt: -1 })
        .populate('user')
        .exec((err, list_messages) => {
            if (err) {
                return next(err)
            }
            res.render('index', {
                list_messages,
            })
        })
}
