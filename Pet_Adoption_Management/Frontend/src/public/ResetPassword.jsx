import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.requestPasswordReset(email);
      setSuccess('If an account exists for this email, a reset link has been sent.');
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
        <p className="reset-password-desc">Enter your email address and we'll send you a link to reset your password.</p>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="reset-password-input"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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