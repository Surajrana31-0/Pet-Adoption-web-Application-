import React, { useEffect, useState, useContext } from "react";
import EditProfile from "./EditProfile";
import "../styles/AdminSettings.css";
import { AuthContext } from "../AuthContext";


const AdminSettings = () => {
  const { token } = useContext(AuthContext);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch admin details");
        const data = await res.json();
        setAdmin(data);
      } catch (err) {
        setError(err.message);
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
      <h2>Admin Settings</h2>
      <div className="settings-profile">
        <img
          src={admin.image_path || "/default-profile.png"}
          alt="Profile"
          className="profile-image-large"
        />
        <div className="profile-details">
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