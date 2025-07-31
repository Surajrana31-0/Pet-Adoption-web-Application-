import React, { useEffect, useState, useContext } from "react";
import "../styles/AdminDashboard.css";
import { AuthContext } from "../AuthContext";

const AdminOverview = () => {
  const { token: contextToken } = useContext(AuthContext) || {};
  const token = contextToken || localStorage.getItem("token") || "";
  const [stats, setStats] = useState({ users: 0, pets: 0, adoptions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch {
        setStats({ users: 42, pets: 17, adoptions: 12 }); // fallback mock data
        setError("Could not load stats. Showing mock data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="admin-overview">
      <h2>Dashboard Overview</h2>
      {loading ? (
        <div className="admin-loading">Loading stats...</div>
      ) : (
        <div className="admin-stats-grid">
          <div className="admin-stat-card users">
            <div className="stat-label">Users</div>
            <div className="stat-value">{stats.users}</div>
          </div>
          <div className="admin-stat-card pets">
            <div className="stat-label">Pets</div>
            <div className="stat-value">{stats.pets}</div>
          </div>
          <div className="admin-stat-card adoptions">
            <div className="stat-label">Adoptions</div>
            <div className="stat-value">{stats.adoptions}</div>
          </div>
        </div>
      )}
      {error && <div className="admin-error-message">{error}</div>}
    </div>
  );
};

export default AdminOverview; 