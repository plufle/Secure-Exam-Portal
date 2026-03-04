const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/crypto");

const testSchema = new mongoose.Schema({
    testName: String,
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassRoom"
    },
    date: Date,
    time: String,
    duration: {
        type: mongoose.Schema.Types.Mixed,
        set: encrypt,
        get: decrypt
    },
    totalMarks: {
        type: mongoose.Schema.Types.Mixed,
        set: encrypt,
        get: decrypt
    },
    questions: {
        type: mongoose.Schema.Types.Mixed,
        set: encrypt,
        get: decrypt
    }
}, { toJSON: { getters: true }, toObject: { getters: true } });

module.exports = mongoose.model("Test", testSchema);