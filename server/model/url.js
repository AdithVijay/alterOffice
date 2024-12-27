const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    clicks: {
        type: Number,
        default: 0
    },
    uniqueUsers: {
        type: Number,
        default: 0
    }
});

// Create the URL model
const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
