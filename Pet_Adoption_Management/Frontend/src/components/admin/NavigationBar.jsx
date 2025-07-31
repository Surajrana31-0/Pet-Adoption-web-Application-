import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ClipboardList, LayoutDashboard } from 'lucide-react';
import '../../styles/NavigationBar.css';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/applications', label: 'My Applications', icon: <ClipboardList size={18} /> },
    { to: '/profile', label: 'Profile', icon: <User size={18} /> },
  ];

  return (
    <header className="nav-header">
      <div className="nav-header-container">
        <div className="nav-header-content flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/dashboard" className="logo-container">
            <span className="logo-text">PetEy</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="nav-desktop space-x-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.icon}
                <span style={{ marginLeft: 6 }}>{link.label}</span>
              </NavLink>
            ))}
            <button className="nav-link logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span style={{ marginLeft: 6 }}>Logout</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-button">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu${isMenuOpen ? ' open' : ''}`}>
          <div className="mobile-menu-links">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `mobile-menu-link${isActive ? ' active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span style={{ marginLeft: 6 }}>{link.label}</span>
              </NavLink>
            ))}
            <button className="mobile-menu-link logout-btn" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
              <LogOut size={18} />
              <span style={{ marginLeft: 6 }}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar; 