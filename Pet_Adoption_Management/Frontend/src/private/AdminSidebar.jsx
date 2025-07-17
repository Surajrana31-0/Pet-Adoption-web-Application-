import React from "react";
import { LogOut, Menu, X, Settings } from "lucide-react";
import "../styles/AdminDashboard.css";

const AdminSidebar = ({ open, setOpen, activeTab, setActiveTab, admin, onLogout, tabs }) => (
  <aside className={`admin-sidebar${open ? " open" : ""}`}>
    <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
      {open ? <X size={24} /> : <Menu size={24} />}
    </button>
    {open && (
      <>
        <div className="admin-profile">
          <div className="profile-pic-placeholder" />
          <div className="admin-name">{admin?.name || "Admin"}</div>
          <div className="admin-email">{admin?.email || "admin@example.com"}</div>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`admin-nav-link${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          <button
            className={`admin-nav-link${activeTab === 'settings' ? ' active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Settings
          </button>
          <button className="admin-nav-link logout" onClick={onLogout}>
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </>
    )}
  </aside>
);

export default AdminSidebar; 