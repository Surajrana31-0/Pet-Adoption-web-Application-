import React, { useEffect, useState, useContext } from 'react';
import '../styles/Notification.css';
import { AuthContext } from '../AuthContext.jsx';

const Notification = () => {
  const { token, role } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/message/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch messages.');
      setMessages(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setDeletingId(id);
    setError('');
    try {
      const res = await fetch(`/api/message/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete message.');
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="notification-loading">Loading messages...</div>;
  if (error) return <div className="notification-error">{error}</div>;

  return (
    <div className="notification-page">
      <div className="notification-header-row">
        <h2>Notifications</h2>
      </div>
      {messages.length === 0 ? (
        <div className="notification-empty">No messages yet.</div>
      ) : (
        <div className="notification-list">
          {messages.map((msg) => (
            <div className="notification-card" key={msg.id}>
              <div className="notification-info">
                <div className="notification-name">{msg.name}</div>
                <div className="notification-email">{msg.email}</div>
                <div className="notification-message">{msg.message}</div>
                <div className="notification-date">{new Date(msg.created_at).toLocaleString()}</div>
              </div>
              <button
                className="notification-delete-btn"
                onClick={() => handleDelete(msg.id)}
                disabled={deletingId === msg.id}
              >
                {deletingId === msg.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification; 