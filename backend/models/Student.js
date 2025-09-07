const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  dob: { type: String, required: true },
  marks: {
    maths: { type: Number, default: 0 },
    physics: { type: Number, default: 0 },
    chemistry: { type: Number, default: 0 },
    english: { type: Number, default: 0 },
    computer: { type: Number, default: 0 },
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
