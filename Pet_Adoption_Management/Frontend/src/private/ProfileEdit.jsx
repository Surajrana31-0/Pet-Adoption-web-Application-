import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../AuthContext.jsx";
import "../styles/ProfileEdit.css";

const ProfileEdit = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await api.put("/users/update", form);
      setMessage("Profile updated!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-container">
        <h2>Edit Profile</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form className="profile-edit-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="confirm-btn" disabled={loading}>Confirm</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit; 