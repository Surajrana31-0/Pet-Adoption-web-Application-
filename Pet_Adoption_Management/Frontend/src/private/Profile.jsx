import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";
import api from "../services/api";
import "../styles/Signup.css";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await api.put("/user/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile updated!");
      setEditMode(false);
      setForm(res.data.user);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">My Profile</h2>
        {message && <div className="popup-message success">{message}</div>}
        {error && <div className="popup-message error">{error}</div>}
        <form className="signup-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={form.firstName || ""} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={form.lastName || ""} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email || ""} disabled readOnly />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone || ""} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={form.location || ""} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" value={form.address || ""} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="form-actions">
            {editMode ? (
              <>
                <button type="submit" className="signup-button" disabled={loading}>Save</button>
                <button type="button" className="login-button" onClick={() => setEditMode(false)} disabled={loading}>Cancel</button>
              </>
            ) : (
              <button type="button" className="signup-button" onClick={() => setEditMode(true)}>Edit</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 