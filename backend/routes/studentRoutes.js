const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { Parser } = require("json2csv");

// ➕ Add new student
router.post("/", async (req, res) => {
  try {
    const { name, rollNumber, dob, marks } = req.body;

    const exists = await Student.findOne({ rollNumber });
    if (exists) return res.status(400).json({ message: "❌ Student already exists" });

    const student = await Student.create({
      name,
      rollNumber,
      dob,
      marks: marks || {}   // अगर marks आए तो save कर दो
    });

    res.status(201).json(student);
  } catch (err) {
    console.error("❌ Error adding student:", err);
    res.status(500).json({ message: "Failed to add student" });
  }
});

// Student Login
router.post("/login", async (req, res) => {
  try {
    const { rollNumber, dob } = req.body;
    if (!rollNumber || !dob) {
      return res.status(400).json({ success: false, message: "Roll number & DOB required" });
    }

    const student = await Student.findOne({ rollNumber, dob });
    if (!student) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      student: {
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        dob: student.dob,
        // marks: student.marks   // ✅ यह add करो
      }
    });
  } catch (err) {
    console.error("❌ Student login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📌 Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    const withTotal = students.map(s => {
      const total =
        (s.marks.maths || 0) +
        (s.marks.physics || 0) +
        (s.marks.chemistry || 0) +
        (s.marks.english || 0) +
        (s.marks.computer || 0);

      return { ...s._doc, total };
    });

    res.json(withTotal);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: "❌ Failed to fetch students" });
  }
});

// ================== Get Single Student (with Total Marks) ==================
router.get("/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const total =
      (student.marks.maths || 0) +
      (student.marks.physics || 0) +
      (student.marks.chemistry || 0) +
      (student.marks.english || 0) +
      (student.marks.computer || 0);

    res.json({ ...student._doc, total });
  } catch (err) {
    console.error("❌ Error fetching student:", err);
    res.status(500).json({ message: "Failed to fetch student" });
  }
});

// 📌 Admin update marks (full control)
router.put("/:rollNumber", async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber;
    const { name, marks } = req.body;

    if (!name && !marks) {
      return res.status(400).json({ message: "Name or marks required for update" });
    }

    const updateObj = {};
    if (name) updateObj.name = name;
    if (marks && typeof marks === "object") {
      // validate each subject if present
      for (const sub of ["maths","physics","chemistry","english","computer"]) {
        if (marks[sub] !== undefined) {
          const val = Number(marks[sub]);
          if (isNaN(val) || val < 0 || val > 100) {
            return res.status(400).json({ message: `Invalid marks for ${sub}` });
          }
        }
      }
      updateObj.marks = marks;
    }

    const updated = await Student.findOneAndUpdate(
      { rollNumber },
      { $set: updateObj },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student updated successfully", student: updated });
  } catch (err) {
    console.error("Error in admin update:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete student: DELETE /api/students/:rollNumber
router.delete("/:rollNumber", async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber;
    const deleted = await Student.findOneAndDelete({ rollNumber });
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== Export Students CSV ==================
router.get("/download/csv", async (req, res) => {
  try {
    const students = await Student.find();

    // subject wise + total calculate
    const data = students.map(s => {
      const total = 
        (s.marks.maths || 0) +
        (s.marks.physics || 0) +
        (s.marks.chemistry || 0) +
        (s.marks.english || 0) +
        (s.marks.computer || 0);

      return {
        name: s.name,
        rollNumber: s.rollNumber,
        dob: `"${s.dob}"`,
        maths: s.marks.maths || 0,
        physics: s.marks.physics || 0,
        chemistry: s.marks.chemistry || 0,
        english: s.marks.english || 0,
        computer: s.marks.computer || 0,
        total
      };
    });

    const parser = new Parser({ fields: ["name","rollNumber","dob","maths","physics","chemistry","english","computer","total"] });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Server error while generating CSV" });
  }
});

module.exports = router;
 
