const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  classroom: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassRoom"
  }]

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);