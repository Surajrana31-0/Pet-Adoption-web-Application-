import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../utils/api';
import '../styles/ResetPassword.css';

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword);
      setSuccess('Your password has been reset successfully. You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="new-password-page"><div className="new-password-container"><div className="new-password-error">Invalid or missing reset token.</div></div></div>;
  }

  return (
    <div className="new-password-page">
      <div className="new-password-container">
        <h2 className="new-password-title">Set New Password</h2>
        <form className="new-password-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="new-password-input"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            className="new-password-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="new-password-button" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {error && <div className="new-password-error">{error}</div>}
          {success && <div className="new-password-success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default NewPassword; 