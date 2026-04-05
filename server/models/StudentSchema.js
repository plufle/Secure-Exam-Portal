const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/crypto");

const studentSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true,
    set: encrypt,
    get: decrypt
  },

  email: {
    type: String,
    required: true,
    unique: true,
    set: encrypt,
    get: decrypt
  },

  password: {
    type: String,
    required: true,
    set: encrypt,
    get: decrypt
  },

  isFirstLogin: {
    type: Boolean,
    default: true
  },

  classroom: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassRoom"
  }]

}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

module.exports = mongoose.model("Student", studentSchema);