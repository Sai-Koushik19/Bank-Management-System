import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) window.location.href = "/";
  }, [token]);

  const fetchUsers = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: "Bearer " + token }
    });
    setUsers(res.data);
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    if (!name || !email || !password) return alert("Enter all fields");

    await axios.post(
      "http://localhost:5000/api/admin/create-user",
      { name, email, password },
      { headers: { Authorization: "Bearer " + token } }
    );

    setName("");
    setEmail("");
    setPassword("");
    fetchUsers();
  };

  const handleBlockUser = async (userId) => {
    await axios.post(
      "http://localhost:5000/api/admin/block",
      { userId },
      { headers: { Authorization: "Bearer " + token } }
    );

    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="admin">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <h2>Admin Panel</h2>

      <div className="form">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <h3>Users</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th>
            <th>Balance</th><th>Status</th><th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>₹{u.balance}</td>
              <td>{u.status}</td>
              <td>
                {u.status === "active" && (
                  <button onClick={() => handleBlockUser(u.id)}>
                    Block
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;