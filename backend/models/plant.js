const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    plantName: {
        required: true,
        type: String
    },
    owner: {
        required: true,
        type: String
    },
    location: {
        type: String,
        default: ''
    },
    imgURL: {
        type: String,
        default: ''
    },
    datePlanted: {
        type: Date,
        default: Date.now
    }
}, {collection: 'Plants'});

module.exports = mongoose.model('Plants', plantSchema)