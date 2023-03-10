const mongoose = require('mongoose')
const { DateTime } = require('luxon')

const { Schema } = mongoose

const MessageSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100 },
        text: { type: String, required: true, maxLength: 500 },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    }
)

// Format timestamps
MessageSchema.virtual('date_posted').get(function () {
    return DateTime.fromJSDate(this.createdAt).toFormat('dd LLL yy')
})

module.exports = mongoose.model('Message', MessageSchema)
