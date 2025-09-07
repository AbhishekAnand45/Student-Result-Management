const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, trim: true },
  password: { type: String, required: true },
  subject: {
    type: String,
    required: true,
    enum: ["maths", "physics", "chemistry", "computer", "english"]
  }
}, { timestamps: true });

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

teacherSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("Teacher", teacherSchema);
