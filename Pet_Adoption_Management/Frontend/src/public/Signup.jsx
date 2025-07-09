import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Heart, PawPrint, MapPin } from 'lucide-react';
import {useForm} from 'react-hook-form';
import '../styles/Signup.css';
import PopupBox from "../components/PopupBox";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true,
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          address: formData.address,
          agreeToTerms: formData.agreeToTerms
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Signup successful! Redirecting to login...');
        setMessageType('success');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        if (data.message === "User already exists") {
          setPopupMsg("User already exists");
          setPopupOpen(true);
          return;
        }
        setMessage(data.message || 'Signup failed');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Network error');
      setMessageType('error');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Message Popup */}
        {message && !(popupOpen && popupMsg === "User already exists") && (
          <div className={`popup-message ${messageType}`}>{message}</div>
        )}
        {/* Header */}
        <div className="signup-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <PawPrint className="logo-icon" />
            </div>
          </div>
          <h2 className="signup-title">Join Pet-Ey!</h2>
          <p className="signup-subtitle">Create your account and start your pet adoption journey today.</p>
        </div>

        {/* Signup Form */}
        <div className="form-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-wrapper">
                <div className="input-icon-wrapper">
                  <User className="input-icon" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Choose a username"
                />
              </div>
            </div>
            {/* Name Fields */}
            <div className="name-group">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <div className="input-wrapper">
                  <div className="input-icon-wrapper">
                    <User className="input-icon" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="First name"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <div className="input-wrapper">
                <div className="input-icon-wrapper">
                  <Phone className="input-icon" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Location Field */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <div className="input-wrapper">
                <div className="input-icon-wrapper">
                  <MapPin className="input-icon" />
                </div>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="City, State"
                />
              </div>
            </div>
            {/* Address Field */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <div className="input-wrapper">
                <div className="input-icon-wrapper">
                  <MapPin className="input-icon" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Street, City, State"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input password-input"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="toggle-icon" />
                  ) : (
                    <Eye className="toggle-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input password-input"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="toggle-icon" />
                  ) : (
                    <Eye className="toggle-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="checkbox-section">
              <div className="checkbox-group">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <label htmlFor="agreeToTerms" className="checkbox-label">
                  I agree to the{' '}
                  <Link to="/terms" className="link-primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="link-primary">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <div className="checkbox-group">
                <input
                  id="subscribeNewsletter"
                  name="subscribeNewsletter"
                  type="checkbox"
                  checked={formData.subscribeNewsletter}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <label htmlFor="subscribeNewsletter" className="checkbox-label">
                  Subscribe to our newsletter for pet care tips and adoption updates
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              <Heart className="btn-icon" />
              <span>Create Account</span>
            </button>
          </form>

          {/* Login Link */}
          <div className="login-link-container">
            <p className="login-text">
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="info-text">
          <p>
            By creating an account, you're joining a community dedicated to animal welfare and responsible pet ownership.
          </p>
        </div>
      </div>
      <PopupBox open={popupOpen} message={popupMsg} onClose={() => setPopupOpen(false)} />
    </div>
  );
};

export default Signup;