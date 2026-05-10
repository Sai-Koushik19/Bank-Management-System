const {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getUserById,
  saveTransaction,
  getTransactionsByUser
} = require("../models/transactionModel");

// DEPOSIT
const deposit = (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  depositMoney(userId, amount, (err) => {
    if (err) {
      return res.status(500).json({ message: "Deposit failed" });
    }

    saveTransaction(userId, null, "deposit", amount);

    res.json({ message: "Deposit successful" });
  });
};

// WITHDRAW
const withdraw = (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  getUserById(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    const balance = result[0].balance;

    if (amount > balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    withdrawMoney(userId, amount, (err) => {
      if (err) {
        return res.status(500).json({ message: "Withdraw failed" });
      }

      saveTransaction(userId, null, "withdraw", amount);

      res.json({ message: "Withdraw successful" });
    });
  });
};

// TRANSFER
const transfer = (req, res) => {
  const senderId = req.user.id;
  const { receiverId, amount } = req.body;

  if (!receiverId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  if (senderId == receiverId) {
    return res.status(400).json({ message: "Cannot transfer to yourself" });
  }

  getUserById(senderId, (err, senderResult) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    const senderBalance = senderResult[0].balance;

    if (amount > senderBalance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    getUserById(receiverId, (err, receiverResult) => {
      if (err || receiverResult.length === 0) {
        return res.status(400).json({ message: "Receiver not found" });
      }

      transferMoney(senderId, receiverId, amount, (err) => {
        if (err) {
          return res.status(500).json({ message: "Transfer failed" });
        }

        saveTransaction(senderId, receiverId, "transfer", amount);

        res.json({ message: "Transfer successful" });
      });
    });
  });
};

// 🔥 NEW: TRANSACTION HISTORY
const getHistory = (req, res) => {
  const userId = req.user.id;

  getTransactionsByUser(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch transactions" });
    }

    res.json(results);
  });
};

module.exports = { deposit, withdraw, transfer, getHistory };