const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");


// Teacher login
router.post("/login", async (req, res) => {
  // console.log("📩 Teacher Login Body:", req.body); // 👈 ये लाइन डाल
  
  try {
    const { teacherId, password } = req.body;
    if (!teacherId || !password) {
      return res.status(400).json({ message: "Teacher ID & password required" });
    }

    const teacher = await Teacher.findOne({ teacherId });
    // console.log("👤 Teacher found in DB:", teacher);
    if (!teacher) {
      return res.status(401).json({ success: false, message: "❌ Invalid credentials" });
    }
    // console.log("🔑 Plain password entered:", password);
    // console.log("🔐 Hashed password in DB:", teacher.password);

    const isMatch = await bcrypt.compare(password, teacher.password);
    // console.log("✅ Password match result:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "❌ Invalid credentials" });
    }
    
    res.json({
      message: "✅ Teacher Login successful",
      teacher: {
        id: teacher._id,
        teacherId: teacher.teacherId,
        subject: teacher.subject,
        name: teacher.name || ""
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error during login" });
  }
});

// ------------------- UPDATE MARKS (subject-locked) -------------------
router.put("/students/:rollNumber", async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber;
    const { marks } = req.body; // number
    const teacherId = req.header("x-teacher-id") || req.body.teacherId;

    if (!teacherId) return res.status(400).json({ message: "Teacher id missing" });
    if (marks === undefined) return res.status(400).json({ message: "Marks required" });
    if (isNaN(marks) || marks < 0 || marks > 100) {
      return res.status(400).json({ message: "Marks must be a number between 0 and 100" });
    }

    const teacher = await Teacher.findOne({ teacherId });
    if (!teacher) return res.status(401).json({ message: "Invalid teacher" });

    // जिस subject का teacher है, उसी key पर update
    const subjectKey = `marks.${teacher.subject}`;
    const updated = await Student.findOneAndUpdate(
      { rollNumber },
      { $set: { [subjectKey]: Number(marks) } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json({ message: `Marks updated for ${teacher.subject}`, student: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;