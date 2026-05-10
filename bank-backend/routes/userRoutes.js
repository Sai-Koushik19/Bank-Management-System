const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const db = require("../config/dbConfig");

// GET USER PROFILE (with balance)
router.get("/profile", verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT id, email, balance FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching user" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(result[0]);
    }
  );
});

module.exports = router;