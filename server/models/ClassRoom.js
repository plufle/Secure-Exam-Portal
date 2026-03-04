const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/crypto");

const classRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        set: encrypt,
        get: decrypt
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }]
}, { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

module.exports = mongoose.model("ClassRoom", classRoomSchema);