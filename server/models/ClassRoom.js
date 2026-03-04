const mongoose = require("mongoose");

const classRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }]
}, { timestamps: true});

module.exports = mongoose.model("ClassRoom", classRoomSchema);