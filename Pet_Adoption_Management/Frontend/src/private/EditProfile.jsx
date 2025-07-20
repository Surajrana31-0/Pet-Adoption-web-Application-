import React, { useState, useEffect } from "react";
import "../styles/EditProfile.css";
import { useToast } from "../components/ToastContext";
import { getImageUrl } from "../services/api.js";

const EditProfile = ({ isOpen, onClose, adminData, onProfileUpdated, token }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const toast = useToast();

  // Initialize form data when component opens
  useEffect(() => {
    if (isOpen && adminData) {
      setForm({
        first_name: adminData.first_name || "",
        last_name: adminData.last_name || "",
        email: adminData.email || "",
        phone: adminData.phone || "",
        location: adminData.location || "",
        address: adminData.address || "",
      });
      setPreview(adminData.image_path ? getImageUrl(adminData.image_path) : "");
      setErrors({});
    }
  }, [isOpen, adminData]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (form.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast("Please select a valid image file", "error");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast("Image size should be less than 5MB", "error");
        return;
      }
      
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = async () => {
    setDeletingImage(true);
    try {
      const res = await fetch("/api/users/me/image", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to delete image");
      
      setPreview("");
      setImage(null);
      toast("Profile image deleted successfully", "success");
      onProfileUpdated({ ...adminData, image_path: null });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setDeletingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast("Please fix the errors in the form", "error");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Map frontend field names to backend expected names
      const fieldMapping = {
        first_name: 'firstName',
        last_name: 'lastName',
        email: 'email',
        phone: 'phone',
        location: 'location',
        address: 'address'
      };
      
      // Add all form fields with correct backend field names
      Object.entries(form).forEach(([key, value]) => {
        const backendFieldName = fieldMapping[key] || key;
        const trimmedValue = value.trim();
        formData.append(backendFieldName, trimmedValue);
      });
      
      // Add image if selected
      if (image) {
        formData.append("image", image);
      }
      
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      
      const updated = await res.json();
      toast("Profile updated successfully", "success");
      onProfileUpdated(updated);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="image-container">
              <img
                src={preview || "/default-profile.png"}
                alt="Profile Preview"
                className="profile-image"
                onError={(e) => {
                  e.target.src = "/default-profile.png";
                }}
              />
              <div className="image-overlay">
                <label className="image-upload-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Change Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="image-input"
                  />
                </label>
              </div>
            </div>
            
            {preview && (
              <button 
                type="button" 
                className="delete-image-btn" 
                onClick={handleDeleteImage} 
                disabled={deletingImage}
              >
                {deletingImage ? (
                  <>
                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                    Remove Photo
                  </>
                )}
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className={`form-input ${errors.first_name ? 'error' : ''}`}
                placeholder="Enter your first name"
              />
              {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name" className="form-label">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className={`form-input ${errors.last_name ? 'error' : ''}`}
                placeholder="Enter your last name"
              />
              {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your location"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Enter your full address"
                rows="3"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? (
                <>
                  <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 