import React, { useState } from 'react';
import { requestPasswordReset } from '../utils/api';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.username || !formData.email) {
      setError('Please enter both username and email address.');
      return;
    }
    // Basic email format validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(formData.username, formData.email);
      setSuccess('If this user exists, a reset link has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Reset Your Password</h2>
        <p className="reset-password-desc">Enter your username and email address to receive a password reset link.</p>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            className="reset-password-input"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
          <input
            type="email"
            name="email"
            className="reset-password-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
          <button type="submit" className="reset-password-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          {error && <div className="reset-password-error">{error}</div>}
          {success && <div className="reset-password-success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 