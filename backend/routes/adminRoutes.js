const express = require("express");
const Admin = require("../models/Admin");
const router = express.Router();
const bcrypt = require("bcryptjs");

// POST /api/admin/login
router.post("/login", async (req, res) => {
  // console.log("📩 Admin Login Body:", req.body); // 👈 ये लाइन डाल
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username & password required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: "❌ Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "❌ Invalid credentials" });
    }
    
    // Return minimal public profile (no password)
    res.json({
      success: true,
      message: "✅ Admin Login successful",
      admin: { id: admin._id, username: admin.username }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
