import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

const mockUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "user" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "admin" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
];

const ManageUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch {
        setUsers(mockUsers);
        setError("Could not load users. Showing mock data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handlePromote = (id) => {
    setMessage("User promoted to admin (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };
  const handleDemote = (id) => {
    setMessage("User demoted to user (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };
  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setMessage("User deleted (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users">
      <h2>Manage Users</h2>
      <input
        className="admin-search"
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === "user" ? (
                    <button className="admin-action promote" onClick={() => handlePromote(user.id)}>Promote</button>
                  ) : (
                    <button className="admin-action demote" onClick={() => handleDemote(user.id)}>Demote</button>
                  )}
                  <button className="admin-action delete" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div className="admin-error-message">{error}</div>}
      {message && <div className="admin-success-message">{message}</div>}
    </div>
  );
};

export default ManageUsers; 