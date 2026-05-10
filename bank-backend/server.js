const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes"); // 🔥 NEW

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/admin", adminRoutes); // 🔥 NEW

app.get("/test", (req, res) => {
  res.send("Server working 🚀");
});

app.get("/", (req, res) => {
  res.send("Bank API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});