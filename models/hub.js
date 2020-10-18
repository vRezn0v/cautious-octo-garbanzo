
const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Subreddit', hubSchema);