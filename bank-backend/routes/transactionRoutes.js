const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  deposit,
  withdraw,
  transfer,
  getHistory
} = require("../controllers/transactionController");

// Transaction routes
router.post("/deposit", verifyToken, deposit);
router.post("/withdraw", verifyToken, withdraw);
router.post("/transfer", verifyToken, transfer);

// 🔥 NEW: History route
router.get("/history", verifyToken, getHistory);

module.exports = router;