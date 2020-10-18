const mongoose = require('mongoose');

const comment = new mongoose.Schema({
    body: String,
    time: {
        type: Date,
        default: Date.now()
    },
    username: String,
    ref: mongoose.Schema.Types.ObjectId,
    votes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Comment', comment);