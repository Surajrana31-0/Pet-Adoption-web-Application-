import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Camera, Save, X } from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import { AuthContext } from '../AuthContext.jsx';
import { useToast } from '../components/ToastContext';
import '../styles/EditAdopterProfile.css';

const EditAdopterProfile = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    image: null,
    imagePreview: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const addToast = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const profile = response.data.profile;
      setForm({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        image: null,
        imagePreview: profile.image_path ? getImageUrl(profile.image_path) : '',
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile data.');
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        addToast('Please select a valid image file.', 'error');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image size should be less than 5MB.', 'error');
        return;
      }
      setForm(f => ({
        ...f,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('firstName', form.firstName.trim());
    formData.append('lastName', form.lastName.trim());
    formData.append('email', form.email.trim());
    formData.append('phone', form.phone.trim());
    formData.append('address', form.address.trim());
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      await api.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Profile updated successfully!', 'success');
      navigate('/dashboard?tab=profile');
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard?tab=settings');
  };

  if (loading) {
    return (
      <div className="edit-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      {/* Header */}
      <div className="edit-profile-header">
        <button className="back-button" onClick={handleCancel}>
          <ArrowLeft size={20} />
          <span>Back to Settings</span>
        </button>
        <h1>Edit Profile</h1>
      </div>

      {/* Main Content */}
      <div className="edit-profile-content">
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-picture-container">
              <img
                src={form.imagePreview || '/default-user.png'}
                alt="Profile Preview"
                className="profile-picture"
                onError={e => { e.target.src = '/default-user.png'; }}
              />
              <div className="profile-picture-overlay">
                <Camera size={24} />
              </div>
            </div>
            <div className="profile-picture-actions">
              <label className="upload-button">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <Camera size={16} />
                <span>Upload Photo</span>
              </label>
              <p className="upload-hint">JPG, PNG or GIF. Max 5MB.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="3"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary cancel-button" 
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary save-button" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdopterProfile; 