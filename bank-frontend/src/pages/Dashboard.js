import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
  }, [token]);

  // 🔹 Fetch user (wrapped in useCallback)
  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/profile",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      setUser(res.data);
    } catch (err) {
      alert("Error fetching user");
    }
  }, [token]);

  // 🔹 Fetch transaction history (wrapped in useCallback)
  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/transaction/history",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      setTransactions(res.data);
    } catch (err) {
      alert("Error fetching history");
    }
  }, [token]);

  // 🔹 Initial load
  useEffect(() => {
    fetchUser();
    fetchHistory();
  }, [fetchUser, fetchHistory]);

  // 🔹 Deposit
  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/transaction/deposit",
        { amount },
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      setAmount("");
      fetchUser();
      fetchHistory();
    } catch {
      alert("Deposit failed ❌");
    }
  };

  // 🔹 Withdraw
  const handleWithdraw = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/transaction/withdraw",
        { amount },
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      setAmount("");
      fetchUser();
      fetchHistory();
    } catch {
      alert("Withdraw failed ❌");
    }
  };

  // 🔹 Transfer
  const handleTransfer = async () => {
    if (!receiverId || !amount || amount <= 0) {
      alert("Enter valid details");
      return;
    }

    try {
      await axios.post(
  "http://localhost:5000/api/transaction/transfer",
  {
    receiverId: Number(receiverId),
    amount: Number(amount)
  },
  {
    headers: { Authorization: "Bearer " + token }
  }
);

      setAmount("");
      setReceiverId("");
      fetchUser();
      fetchHistory();
    } catch {
      alert("Transfer failed ❌");
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <h2>Dashboard</h2>

      {user ? (
        <>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Balance:</b> ₹{user.balance}</p>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="btn-group">
            <button onClick={handleDeposit}>Deposit</button>
            <button onClick={handleWithdraw}>Withdraw</button>
          </div>

          <h3>Transfer</h3>

          <input
            type="number"
            placeholder="Receiver ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />

          <button onClick={handleTransfer}>Transfer</button>

          <h3>Transactions</h3>

          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.type}</td>
                  <td>₹{t.amount}</td>
                  <td>{new Date(t.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;