const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true});

module.exports = mongoose.model("User", userSchema);