const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  createUser,
  getAllUsers,
  blockUser
} = require("../controllers/adminController");

router.post("/create-user", verifyToken, adminOnly, createUser);
router.get("/users", verifyToken, adminOnly, getAllUsers);
router.post("/block", verifyToken, adminOnly, blockUser);

module.exports = router;