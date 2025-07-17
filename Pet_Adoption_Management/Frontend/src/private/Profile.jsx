import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
import api from "../services/api";
import "../styles/Signup.css";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return null;

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">My Profile</h2>
        <div className="profile-details-readonly">
          <div className="form-group">
            <label>Username</label>
            <div className="profile-value">{user.username}</div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="profile-value">{user.email}</div>
          </div>
          <div className="form-group">
            <label>First Name</label>
            <div className="profile-value">{user.firstName}</div>
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <div className="profile-value">{user.lastName}</div>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="signup-button" onClick={() => navigate("/profile/edit")}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 