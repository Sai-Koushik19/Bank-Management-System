const db = require("../config/dbConfig");
const bcrypt = require("bcrypt");

// CREATE USER (by admin)
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Error creating user" });
      }

      res.json({ message: "User created by admin" });
    }
  );
};

// GET ALL USERS
const getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, balance, status FROM users", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching users" });
    }

    res.json(result);
  });
};

// BLOCK USER
const blockUser = (req, res) => {
  const { userId } = req.body;

  db.query(
    "UPDATE users SET status = 'blocked' WHERE id = ?",
    [userId],
    (err) => {
      if (err) return res.status(500).json({ message: "Error blocking user" });

      res.json({ message: "User blocked" });
    }
  );
};

module.exports = { createUser, getAllUsers, blockUser };