require("dotenv").config();
const mongoose = require("mongoose");

const Admin = require("./models/Admin");
const Teacher = require("./models/Teacher");
const Student = require("./models/Student");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas for seeding");

    // -------- Admin --------
    const admin = await Admin.findOne({ username: "admin" });
    if (!admin) {
      await Admin.create({ username: "admin", password: "admin123"});
      console.log("➕ Admin created: admin / admin123");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    // -------- Teachers --------
    const teachers = [
      { teacherId: "T001", password: "teacher123", subject: "maths", name: "Mr. Sharma" },
      { teacherId: "T002", password: "teacher123", subject: "physics", name: "Mr. Verma" },
      { teacherId: "T003", password: "teacher123", subject: "chemistry", name: "Dr. Iyer" },
      { teacherId: "T004", password: "teacher123", subject: "english", name: "Ms. Gupta" },
      { teacherId: "T005", password: "teacher123", subject: "computer", name: "Mr. Khan" },
    ];

    for (let t of teachers) {
      const exists = await Teacher.findOne({ teacherId: t.teacherId });
      if (!exists) {
        await Teacher.create(t); // plain password → pre-save hook hash करेगा
        console.log(`➕ Teacher created: ${t.teacherId} / ${t.password}`);
      } else {
        console.log(`ℹ️ Teacher ${t.teacherId} already exists`);
      }
    }
    
    // -------- Demo Student --------
      const students = [
      {
        rollNumber: "101",
        name: "Rahul Kumar",
        dob: "2005-05-10",
        marks: { maths: 85, physics: 78, chemistry: 90, english: 88, computer: 92 }
      },
      {
        rollNumber: "102",
        name: "Priya Sharma",
        dob: "2005-08-22",
        marks: { maths: 92, physics: 81, chemistry: 76, english: 89, computer: 95 }
      },
      {
        rollNumber: "103",
        name: "Amit Singh",
        dob: "2005-12-15",
        marks: { maths: 70, physics: 68, chemistry: 72, english: 74, computer: 80 }
      }
    ];

    for (let s of students) {
      const exists = await Student.findOne({ rollNumber: s.rollNumber });
      if (!exists) {
        await Student.create(s); // dob field से ही login होगा
        console.log(`➕ Student created: ${s.rollNumber} / DOB: ${s.dob}`);
      } else {
        console.log(`ℹ️ Student ${s.rollNumber} already exists`);
      }
    }

    console.log("🎉 Seeding completed successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
})();
