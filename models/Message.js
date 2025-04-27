const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    recipientUsername: {
        type: String,
        required: true,
    },
    messageText: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Message', messageSchema);
