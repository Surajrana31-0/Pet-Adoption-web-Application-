import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
import jwtDecode from "jwt-decode";
import AdminSidebar from "./AdminSidebar";
import AdminOverview from "./AdminOverview";
import ManageUsers from "./ManageUsers";
import ManagePets from "./ManagePets";
import ManageAdoptions from "./ManageAdoptions";
import AdminSettings from "./AdminSettings";
import "../styles/AdminDashboard.css";

const TABS = [
  { key: "overview", label: "Dashboard" },
  { key: "users", label: "Manage Users" },
  { key: "pets", label: "Manage Pets" },
  { key: "adoptions", label: "Manage Adoptions" },
  { key: "settings", label: "Settings" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return navigate("/");
    try {
      const payload = jwtDecode(storedToken);
      if (payload.role !== "admin") return navigate("/");
      setToken(storedToken);
      // Fetch full admin data from backend
      fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch admin details"))
        .then(data => setAdmin(data))
        .catch(() => setAdmin(null));
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-root">
      <AdminSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        admin={admin}
        onLogout={handleLogout}
        tabs={TABS}
      />
      <main className="admin-main-content">
        {activeTab === "overview" && <AdminOverview token={token} />}
        {activeTab === "users" && <ManageUsers token={token} />}
        {activeTab === "pets" && <ManagePets token={token} />}
        {activeTab === "adoptions" && <ManageAdoptions token={token} />}
        {activeTab === "settings" && <AdminSettings token={token} admin={admin} />}
      </main>
    </div>
  );
};

export default AdminDashboard;