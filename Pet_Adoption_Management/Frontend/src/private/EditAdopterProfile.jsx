import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { AuthContext } from '../AuthContext.jsx';
import '../styles/EditAdopterProfile.css';

const EditAdopterProfile = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    image: null,
    imagePreview: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users/profile')
      .then(res => {
        const p = res.data.profile;
        setForm(f => ({
          ...f,
          firstName: p.first_name || '',
          lastName: p.last_name || '',
          email: p.email || '',
          phone: p.phone || '',
          location: p.location || '',
          imagePreview: p.image_path ? getImageUrl(p.image_path) : '',
        }));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile.');
        setLoading(false);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
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
    const formData = new FormData();
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('location', form.location);
    if (form.image) formData.append('image', form.image);

    try {
      await api.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard?tab=profile');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="edit-profile-root">
      <h2>Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="profile-pic-edit-section">
          <img
            src={form.imagePreview || '/default-user.png'}
            alt="Profile Preview"
            className="profile-pic-edit"
            onError={e => { e.target.src = '/default-user.png'; }}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} required type="email" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} />
        </div>
        {error && <div className="profile-error">{error}</div>}
        <button className="btn-primary" type="submit">Save Changes</button>
        <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard?tab=profile')}>Cancel</button>
      </form>
    </div>
  );
};

export default EditAdopterProfile; 