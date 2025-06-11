import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, PawPrint } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
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
            <Link
              to="/login"
              className="login-button"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              className="signup-button"
            >
              <Heart className="h-4 w-4" />
              <span>Sign Up</span>
            </Link>
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
            <Link
              to="/"
              onClick={toggleMenu}
              className={`mobile-menu-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
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
              <Link
                to="/login"
                onClick={toggleMenu}
                className="login-button"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                onClick={toggleMenu}
                className="signup-button"
              >
                <Heart className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;