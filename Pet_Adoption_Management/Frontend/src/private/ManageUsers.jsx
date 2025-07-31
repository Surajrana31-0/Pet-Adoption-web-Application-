import React, { useEffect, useState, useCallback } from 'react';
import '../styles/ManageUsers.css';

const API_URL = '/api/users';

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // user id for which action is loading

  const fetchUsers = useCallback(async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not load users');
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const debounced = debounce(fetchUsers, 400);
    debounced(search);
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleToggle = async (user) => {
    setActionLoading(user.id);
    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ role: user.role === 'admin' ? 'user' : 'admin' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update user');
      setUsers(users.map(u => u.id === user.id ? { ...u, role: data.data.role } : u));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user.username || user.email}?`)) return;
    setActionLoading(user.id);
    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      setUsers(users.filter(u => u.id !== user.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="manage-users-main">
      <header className="manage-users-header">
        <h1>Manage Users</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </header>
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="4">No users found.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td className="user-name-cell">
                      <span className="user-img-wrapper">
                        {user.image_path ? (
                          <img
                            src={`http://localhost:5000/uploads/${user.image_path}`}
                            alt={user.username || user.email}
                            className="user-img"
                          />
                        ) : (
                          <span className="user-img user-img-placeholder">{user.username ? user.username[0].toUpperCase() : '?'}</span>
                        )}
                      </span>
                      <span className="user-name">{user.firstName || ''} {user.lastName || ''}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="role-btn"
                        disabled={actionLoading === user.id}
                        onClick={() => handleRoleToggle(user)}
                      >
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        className="delete-btn"
                        disabled={actionLoading === user.id}
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 