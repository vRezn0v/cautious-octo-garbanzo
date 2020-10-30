const mongoose = require('mongoose');

const post = new mongoose.Schema({
    username: String,
    ref: mongoose.Schema.Types.ObjectId,
    vote: {
        type: String,
        default: "neutral"
    },
    saved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('PostState', post);