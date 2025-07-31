import React from "react";
import { LogOut, Menu, X, Settings } from "lucide-react";
import { getImageUrl } from "../services/api.js";
import "../styles/AdminDashboard.css";

const AdminSidebar = ({ open, setOpen, activeTab, setActiveTab, admin, onLogout, tabs }) => (
  <aside className={`admin-sidebar${open ? " open" : ""}`}>
    <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
      {open ? <X size={24} /> : <Menu size={24} />}
    </button>
    {open && (
      <>
        <div className="admin-profile">
          {admin?.image_path ? (
            <img
              src={getImageUrl(admin.image_path)}
              alt={admin?.username || "Profile"}
              className="profile-pic-circular"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="profile-pic-placeholder-circular" style={{ display: admin?.image_path ? 'none' : 'flex' }}>
            {admin?.username ? admin.username.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="admin-username">{admin?.username || "admin"}</div>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`admin-nav-link${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.key === 'settings' && <Settings size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />}
              {tab.label}
            </button>
          ))}
          <button className="admin-nav-link logout" onClick={onLogout}>
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </>
    )}
  </aside>
);

export default AdminSidebar; 