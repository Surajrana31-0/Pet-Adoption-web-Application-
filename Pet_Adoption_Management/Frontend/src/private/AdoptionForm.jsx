import React, { useState, useContext } from "react";
import api from "../services/api";
import "../styles/AdoptionForm.css";
import { AuthContext } from "../AuthContext.jsx";

const AdoptionForm = ({ pet, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    full_name: "",
    address: "",
    phone: "",
    reason: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/adoptions", {
        pet_id: pet.id,
        user_id: user.id,
        ...form
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 1200);
    } catch (err) {
      setError("Failed to submit adoption request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adoption-form-modal">
      <form className="adoption-form" onSubmit={handleSubmit}>
        <h2>Adopt {pet.name}</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Reason for Adoption</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
        {success && <div className="success-message">Adoption request submitted!</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
      <button className="btn-secondary" onClick={onClose} style={{marginTop: 12}}>Close</button>
    </div>
  );
};

export default AdoptionForm; 