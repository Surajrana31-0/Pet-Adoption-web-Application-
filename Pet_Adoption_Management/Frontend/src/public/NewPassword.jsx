import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../utils/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/ResetPassword.css';

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const username = searchParams.get('username');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    };
  };

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
    // Password strength: min 8 chars, upper, lower, number, special
    const minLength = newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    if (!(minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.');
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(username, token, newPassword);
      setSuccess('Your password has been reset successfully. You can now log in with your new password.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !username) {
    return (
      <div className="new-password-page">
        <div className="new-password-container">
          <div className="new-password-error">Invalid or missing reset token or username.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="new-password-page">
      <div className="new-password-container">
        <h2 className="new-password-title">Set New Password</h2>
        <p className="new-password-desc">Hello {username}, please enter your new password below.</p>
        <form className="new-password-form" onSubmit={handleSubmit}>
          <div className="password-input-group">
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="new-password-input"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="eye-toggle-btn"
              tabIndex={-1}
              onClick={() => setShowNewPassword(v => !v)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              style={{ marginLeft: '-2.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <div className="password-input-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="new-password-input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="eye-toggle-btn"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(v => !v)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              style={{ marginLeft: '-2.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
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