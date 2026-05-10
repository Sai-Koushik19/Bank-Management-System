const db = require("../config/dbConfig");

// Deposit
const depositMoney = (userId, amount, callback) => {
  const sql = "UPDATE users SET balance = balance + ? WHERE id = ?";
  db.query(sql, [amount, userId], callback);
};

// Withdraw
const withdrawMoney = (userId, amount, callback) => {
  const sql = "UPDATE users SET balance = balance - ? WHERE id = ?";
  db.query(sql, [amount, userId], callback);
};

// Get user by ID
const getUserById = (id, callback) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], callback);
};

// Transfer
const transferMoney = (senderId, receiverId, amount, callback) => {
  const deduct = "UPDATE users SET balance = balance - ? WHERE id = ?";
  const add = "UPDATE users SET balance = balance + ? WHERE id = ?";

  db.query(deduct, [amount, senderId], (err) => {
    if (err) return callback(err);

    db.query(add, [amount, receiverId], callback);
  });
};

// Save transaction
const saveTransaction = (sender, receiver, type, amount) => {
  const sql =
    "INSERT INTO transactions (sender_id, receiver_id, type, amount) VALUES (?, ?, ?, ?)";
  db.query(sql, [sender, receiver, type, amount]);
};

// 🔥 NEW: Get transaction history
const getTransactionsByUser = (userId, callback) => {
  const sql = `
    SELECT * FROM transactions
    WHERE sender_id = ? OR receiver_id = ?
    ORDER BY created_at DESC
  `;
  db.query(sql, [userId, userId], callback);
};

module.exports = {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getUserById,
  saveTransaction,
  getTransactionsByUser
};