import React, { useState } from "react";
import "../styles/AdminDashboard.css";

const AdminSettings = ({ token, admin }) => {
  const [profile, setProfile] = useState({ name: admin?.name || "", email: admin?.email || "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setMessage("Profile updated (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setMessage("Password changed (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="admin-settings">
      <h2>Settings</h2>
      <form className="admin-form" onSubmit={handleProfileUpdate}>
        <h3>Update Profile</h3>
        <input
          type="text"
          value={profile.name}
          onChange={e => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="email"
          value={profile.email}
          onChange={e => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
        />
        <button type="submit" className="admin-action save">Save</button>
      </form>
      <form className="admin-form" onSubmit={handlePasswordChange}>
        <h3>Change Password</h3>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="New Password"
        />
        <button type="submit" className="admin-action save">Change Password</button>
      </form>
      <div className="admin-notifications-placeholder">
        <h3>Notification Preferences</h3>
        <p>Coming soon...</p>
      </div>
      {message && <div className="admin-success-message">{message}</div>}
    </div>
  );
};

export default AdminSettings; 