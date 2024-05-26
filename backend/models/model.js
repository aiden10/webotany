const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    plantName: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Data', plantSchema)