import React, { useState } from "react";
import "../styles/AdminSettings.css";
import { useToast } from "../components/ToastContext";

const EditProfile = ({ isOpen, onClose, adminData, onProfileUpdated, token }) => {
  const [form, setForm] = useState({
    first_name: adminData.first_name || "",
    last_name: adminData.last_name || "",
    email: adminData.email || "",
    phone: adminData.phone || "",
    location: adminData.location || "",
    address: adminData.address || "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(adminData.image_path ? `${adminData.image_path}` : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingImage, setDeletingImage] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleDeleteImage = async () => {
    setDeletingImage(true);
    setError("");
    try {
      const res = await fetch("/api/users/me/image", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete image");
      setPreview("");
      setImage(null);
      toast("Profile image deleted.", "success");
      onProfileUpdated({ ...adminData, image_path: null });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setDeletingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append("image", image);
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      toast("Profile updated successfully.", "success");
      onProfileUpdated(updated);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Edit Profile</h2>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="profile-image-section">
            <img
              src={preview || "/default-profile.png"}
              alt="Profile Preview"
              className="profile-image-large"
            />
            <div className="image-actions">
              <label className="upload-btn">
                Change
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
              {preview && (
                <button type="button" className="delete-btn" onClick={handleDeleteImage} disabled={deletingImage}>
                  {deletingImage ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
          <div className="form-fields">
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 