import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, PawPrint } from 'lucide-react';
import { AuthContext } from '../AuthContext.jsx';
import { useAdminSessionProtection } from '../hooks/useAdminSessionProtection.js';
import AdminSessionPopup from '../components/AdminSessionPopup.jsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { role, isAuthenticated } = useContext(AuthContext);
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

  // Handle navigation with protection for admin users (only for homepage)
  const handleNavigation = (to) => {
    if (isAdmin && isInAdminRoute && to === '/') {
      // Only protect navigation to homepage
      navigateWithProtection(to);
    } else {
      // For all other routes, use normal navigation
      window.location.href = to;
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="logo-container">
            <div className="logo-icon">
              <PawPrint className="h-6 w-6" />
            </div>
            <span className="logo-text">
              Pet-Ey
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop space-x-8">
            <button
              onClick={() => handleNavigation('/')}
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              style={{ font: 'inherit', background: 'none', border: 'none', color: 'inherit', padding: 0, margin: 0, cursor: 'pointer' }}
            >
              Home
            </button>
            <Link
              to="/adopt"
              className={`nav-link ${isActive('/adopt') ? 'active' : ''}`}
            >
              Adopt
            </Link>
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
              onClick={() => handleNavigation('/login')}
              className="login-button"
              style={{ font: 'inherit', background: 'none', border: 'none', color: 'inherit', padding: 0, margin: 0, cursor: 'pointer' }}
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </button>
            <button
              onClick={() => handleNavigation('/signup')}
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
                handleNavigation('/');
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
                  handleNavigation('/login');
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
                  handleNavigation('/signup');
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
    </header>
  );
};

export default Header;