const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema ({
    title: { type: String, required: true, maxLength: 100},
    text: { type: String, required: true, maxLength: 500},
},
{ 
    timestamps: true 
});

module.exports = mongoose.model("Message", MessageSchema);