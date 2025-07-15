import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Heart, PawPrint } from 'lucide-react';
import { AuthContext } from "../AuthContext.jsx";
import { authAPI } from '../utils/api';
import "../styles/main.css";

const validateEmail = (email) => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Login = () => {
  const { login, isAuthenticated, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // default: checked

  // Auto-hide error after 4 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError("") , 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated && role) {
      setRedirecting(true);
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "user") {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "rememberMe") {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const validateFields = () => {
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!formData.password) {
      setError("Password cannot be empty.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateFields()) return;
    setLoading(true);
    try {
      const data = await authAPI.login(formData.email, formData.password);
      if (data && data.data && data.data.access_token) {
        login(data.data.access_token, rememberMe); // Pass rememberMe!
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err.message || "Unable to connect. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) {
    return <div className="loading-message">Redirecting to your dashboard...</div>;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">
              <PawPrint className="h-8 w-8" />
            </div>
          </div>
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Sign in to your Pet-Ey account to continue your pet adoption journey.</p>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit} autoComplete="on">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-group">
                <div className="input-icon">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <div className="input-icon">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-footer">
              <div className="checkbox-group">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleInputChange}
                  className="checkbox-input"
                  disabled={loading}
                />
                <label htmlFor="rememberMe" className="checkbox-label">
                  Remember me
                </label>
              </div>
              <Link to="/reset-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <span className="spinner" style={{ marginRight: 8 }}></span>
              ) : (
                <Heart className="h-5 w-5" />
              )}
              <span>{loading ? "Signing In..." : "Sign In"}</span>
            </button>

            {/* Error Message */}
            {error && <div className="login-error-message">{error}</div>}
          </form>

          {/* Sign Up Link */}
          <div className="signup-prompt">
            <p className="signup-text">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="terms-text">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="terms-link">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="terms-link">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
// Add this to your main.css or Login.css:
// .login-error-message { color: #e53935; background: #fff0f0; border-radius: 8px; padding: 0.75rem 1rem; margin-top: 1rem; text-align: center; font-weight: 500; font-size: 1rem; }
// .spinner { display: inline-block; width: 1.2em; height: 1.2em; border: 2.5px solid #40916c; border-top: 2.5px solid #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; }
// @keyframes spin { 100% { transform: rotate(360deg); } }