import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="logo">Pet<span>Home</span></Link>
        <div className="nav-links" style={{ display: navOpen ? 'flex' : '' }}>
          <Link to="/">Home</Link>
          <Link to="/adopt">Adopt</Link>
          <Link to="/rehome">Rehome</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/about">About</Link>
          <Link to="/register" className="cta-button">Sign Up</Link>
          <Link to="/login" className="cta-button">Login</Link>
        </div>
        <button
          className="mobile-menu-button"
          onClick={() => setNavOpen(open => !open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </nav>
    </header>
  );
};

export default Header;