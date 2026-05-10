const db = require("../config/dbConfig");

// Create new user
const createUser = (name, email, password, callback) => {
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], callback);
};

// Get user by email (for login)
const getUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

module.exports = { createUser, getUserByEmail };