require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");
const Teacher = require("./models/Teacher");
const Student = require("./models/Student");

const MONGO_URI = process.env.MONGODB_URI;

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected...");

    // ================== ADMIN TEST ==================
    const admin = await Admin.findOne({ username: "admin" });
    if (admin) {
      const ok = await bcrypt.compare("admin123", admin.password);
      console.log("👑 Admin login test:", ok ? "✅ Success" : "❌ Failed");
    }

    // ================== TEACHER TEST ==================
    const teacher = await Teacher.findOne({ teacherId: "T001" });
    // console.log("Teacher from DB:", teacher);  // 👈 Debug
    if (teacher) {
      const ok = await bcrypt.compare("teacher123", teacher.password);
      console.log("👨‍🏫 Teacher login test:", ok ? "✅ Success" : "❌ Failed");
    }

    // ================== STUDENT TEST ==================
    const rollNumber = "101";
    const dob = "2005-05-10";

    const student = await Student.findOne({ rollNumber, dob });
    console.log("🎓 Student login test:", student ? "✅ Success" : "❌ Failed");

    process.exit();
  } catch (err) {
    console.error("❌ Test error:", err);
    process.exit(1);
  }
}

test();
