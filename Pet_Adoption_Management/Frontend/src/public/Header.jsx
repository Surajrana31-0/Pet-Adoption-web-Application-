import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User } from 'lucide-react';
import { AuthContext } from '../AuthContext.jsx';
import { useAdminSessionProtection } from '../hooks/useAdminSessionProtection.js';
import AdminSessionPopup from '../components/AdminSessionPopup.jsx';
import LogoutDialog from '../components/LogoutDialog.jsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, isAuthenticated, logout } = useContext(AuthContext);
  const { 
    isAdmin, 
    isInAdminRoute, 
    showConfirmation, 
    pendingNavigation,
    navigateWithProtection,
    handleConfirmNavigation,
    handleCancelNavigation
  } = useAdminSessionProtection();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Adopter dashboard Home logic
  const isAdopterDashboard = isAuthenticated && role === 'user' && location.pathname.startsWith('/dashboard');

  // Logo/Home click handler for adopter dashboard
  const handleHomeClick = (e) => {
    if (e) e.preventDefault();
    if (isAdopterDashboard) {
      setShowLogoutDialog(true);
    } else if (isAdmin && isInAdminRoute) {
      navigateWithProtection('/');
    } else {
      navigate('/');
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    logout();
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content flex items-center justify-between">
          {/* Logo */}
          <span
            className="logo-container"
            style={{ cursor: 'pointer' }}
            onClick={handleHomeClick}
          >
            <span className="logo-text">
              PetEy
            </span>
          </span>

          {/* Desktop Navigation */}
          <nav className="nav-desktop space-x-8">
            <button
              onClick={handleHomeClick}
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              style={{ font: 'inherit', background: 'none', border: 'none', color: 'inherit', padding: 0, margin: 0, cursor: 'pointer' }}
            >
              Home
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                } else {
                  navigate('/adopt');
                }
              }}
              className={`nav-link ${isActive('/adopt') ? 'active' : ''}`}
              style={{ font: 'inherit', background: 'none', border: 'none', color: 'inherit', padding: 0, margin: 0, cursor: 'pointer' }}
            >
              Adopt
            </button>
            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="auth-buttons space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="login-button"
              style={{ font: 'inherit', background: 'none', border: 'none', color: 'inherit', padding: 0, margin: 0, cursor: 'pointer' }}
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="signup-button"
            >
              <Heart className="h-4 w-4" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="mobile-menu-button"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-links">
            <button
              onClick={() => {
                handleHomeClick();
                toggleMenu();
              }}
              className={`mobile-menu-link ${isActive('/') ? 'active' : ''}`}
              style={{ font: 'inherit', background: 'none', border: 'none', color: 'inherit', padding: 0, margin: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              Home
            </button>
            <Link
              to="/adopt"
              onClick={toggleMenu}
              className={`mobile-menu-link ${isActive('/adopt') ? 'active' : ''}`}
            >
              Adopt
            </Link>
            <Link
              to="/about"
              onClick={toggleMenu}
              className={`mobile-menu-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className={`mobile-menu-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>
            <div className="mobile-auth-buttons">
              <button
                onClick={() => {
                  navigate('/login');
                  toggleMenu();
                }}
                className="login-button"
                style={{ font: 'inherit', background: 'none', border: 'none', color: 'inherit', padding: 0, margin: 0, cursor: 'pointer' }}
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  toggleMenu();
                }}
                className="signup-button"
              >
                <Heart className="h-4 w-4" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Session Protection Popup */}
      <AdminSessionPopup
        isOpen={showConfirmation}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
        targetRoute={pendingNavigation?.to}
      />
      {/* Logout Dialog for Adopter Dashboard */}
      <LogoutDialog
        open={showLogoutDialog}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </header>
  );
};

export default Header;