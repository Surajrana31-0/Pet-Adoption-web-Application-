import React, { useEffect, useState, useContext } from "react";
import EditProfile from "./EditProfile";
import "../styles/AdminSettings.css";
import { AuthContext } from "../AuthContext";
import { getImageUrl } from "../services/api.js";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";


const AdminSettings = () => {
  const { token } = useContext(AuthContext);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching admin profile...");
        console.log("Token exists:", !!token);
        
        // Use the same API call as Adopter Dashboard
        const response = await api.get('/users/profile');
        console.log("API Response:", response.data);
        setAdmin(response.data.profile);
      } catch (err) {
        console.error("Error fetching admin details:", err);
        console.error("Error response:", err.response?.data);
        setError("Failed to fetch admin details");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [token]);

  const handleProfileUpdated = (updated) => {
    setAdmin(updated);
  };

  if (loading) return <div className="admin-settings loading">Loading...</div>;
  if (error) return <div className="admin-settings error">{error}</div>;
  if (!admin) return null;

  return (
    <div className="admin-settings unified">
      <h2>Admin Information</h2>
      <div className="settings-profile">
        <img
          src={admin.image_path ? getImageUrl(admin.image_path) : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='20' fill='%23ccc'/%3E%3Cpath d='M20 85c0-16.6 13.4-30 30-30s30 13.4 30 30' fill='%23ccc'/%3E%3C/svg%3E"}
          alt="Profile"
          className="profile-image-large"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='20' fill='%23ccc'/%3E%3Cpath d='M20 85c0-16.6 13.4-30 30-30s30 13.4 30 30' fill='%23ccc'/%3E%3C/svg%3E";
          }}
        />
        <div className="profile-details">
          <div className="username-row">{admin.username}</div>
          <div><strong>First Name:</strong> {admin.first_name}</div>
          <div><strong>Last Name:</strong> {admin.last_name}</div>
          <div><strong>Email:</strong> {admin.email}</div>
          <div><strong>Phone:</strong> {admin.phone || <span className="muted">Not set</span>}</div>
          <div><strong>Location:</strong> {admin.location || <span className="muted">Not set</span>}</div>
          <div><strong>Address:</strong> {admin.address || <span className="muted">Not set</span>}</div>
        </div>
      </div>
      <button className="edit-profile-btn" onClick={() => setEditOpen(true)}>
        Edit Profile
      </button>
      <button className="edit-profile-btn" style={{ marginTop: '0.7rem', background: '#40916c' }} onClick={() => navigate('/notifications')}>
        View Notification
      </button>
      {editOpen && (
        <EditProfile
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          adminData={admin}
          onProfileUpdated={handleProfileUpdated}
          token={token}
        />
      )}
    </div>
  );
};

export default AdminSettings; 