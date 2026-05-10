const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../models/userModel");

// REGISTER
const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  createUser(name, email, hashedPassword, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Error creating user",
        error: err
      });
    }

    res.status(201).json({
      message: "User registered successfully"
    });
  });
};

// LOGIN (🔥 UPDATED WITH ROLE)
const login = (req, res) => {
  const { email, password } = req.body;

  getUserByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 INCLUDE ROLE IN TOKEN
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });
  });
};

module.exports = { register, login };