const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    chadpoints: {
        type: Number
    },
    created: Date
});

module.exports = mongoose.model('Account', accountSchema);