const mongoose = require('mongoose');

const post = new mongoose.Schema({
    username: String,
    hub: String,
    title: String,
    body: String,
    time: {
        type: Date,
        default: Date.now()
    },
    type: String,
    link: String,
    votes: {
        type: Number,
        default: 0
    },
    num_of_comments: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Post', post);