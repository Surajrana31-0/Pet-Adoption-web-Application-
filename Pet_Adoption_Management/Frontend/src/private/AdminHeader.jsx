import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAboutClick = () => {
    sessionStorage.setItem('adminReturnPath', location.pathname);
    navigate('/about');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        {/* Logo on the far left */}
        <div className="admin-logo-container" onClick={() => navigate('/admin')}>
          <span className="admin-logo-text">PetEy</span>
        </div>
        {/* About link on the far right */}
        <nav>
          <button
            className="admin-about-link"
            onClick={handleAboutClick}
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader; 