const mongoose = require('mongoose');

const userProfile = new mongoose.Schema({
    username: String,
    chadpoints: {
        type: Number,
        default: 0
    },
    comment_chadpoints: {
        type: Number,
        default: 0
    },
    saved_posts: Array,
    saved_comments: Array,
    subscribed: Array,
    owned: Array
});

module.exports = mongoose.model('Profile', userProfile);