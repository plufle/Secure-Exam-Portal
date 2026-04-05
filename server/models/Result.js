const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/crypto");

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    score: {
        type: mongoose.Schema.Types.Mixed,
        set: encrypt,
        get: decrypt
    },
    answers: {
        type: mongoose.Schema.Types.Mixed,
        set: encrypt,
        get: decrypt
    },
    flagged: {
        type: [Number]
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { toJSON: { getters: true }, toObject: { getters: true } });

module.exports = mongoose.model("Result", resultSchema);
