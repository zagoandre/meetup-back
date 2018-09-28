const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    //_id
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    linkedin: {
        type: String,
        required: true,
        trim: true
    },
    github: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = mongoose.model('Professional', schema);