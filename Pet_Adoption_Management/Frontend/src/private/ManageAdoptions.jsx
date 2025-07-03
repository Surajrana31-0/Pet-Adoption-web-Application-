import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

const mockAdoptions = [
  { id: 1, applicant: "Alice", pet: "Bella", status: "pending", date: "2024-05-01" },
  { id: 2, applicant: "Bob", pet: "Milo", status: "approved", date: "2024-04-15" },
];

const ManageAdoptions = ({ token }) => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdoptions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/admin/adoptions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch adoptions");
        const data = await res.json();
        setAdoptions(data);
      } catch {
        setAdoptions(mockAdoptions);
        setError("Could not load adoptions. Showing mock data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdoptions();
  }, [token]);

  const handleApprove = (id) => {
    setMessage("Adoption approved (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };
  const handleReject = (id) => {
    setMessage("Adoption rejected (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="admin-adoptions">
      <h2>Manage Adoptions</h2>
      {loading ? (
        <div className="admin-loading">Loading adoptions...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Pet</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adoptions.map(adopt => (
              <tr key={adopt.id}>
                <td>{adopt.applicant}</td>
                <td>{adopt.pet}</td>
                <td>{adopt.status}</td>
                <td>{adopt.date}</td>
                <td>
                  {adopt.status === "pending" && (
                    <>
                      <button className="admin-action approve" onClick={() => handleApprove(adopt.id)}>Approve</button>
                      <button className="admin-action reject" onClick={() => handleReject(adopt.id)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div className="admin-error-message">{error}</div>}
      {message && <div className="admin-success-message">{message}</div>}
    </div>
  );
};

export default ManageAdoptions; 