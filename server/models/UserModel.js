// models/UserModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "provide name"]
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "provide password"]
    },
    profile_pic: {
        type: String,
        default: ""
    },
    languages: { 
        type: [String], 
        default: null
    },
}, {
    timestamps: true
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
