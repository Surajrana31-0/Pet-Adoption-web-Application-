import React from 'react';
import '../styles/LogoutDialog.css';

const LogoutDialog = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="logout-dialog-backdrop">
      <div className="logout-dialog-modal" role="dialog" aria-modal="true">
        <h3 className="logout-dialog-title">Log Out?</h3>
        <p className="logout-dialog-message">
          Do you want to log out and return to the homepage?
        </p>
        <div className="logout-dialog-actions">
          <button className="logout-dialog-btn logout" onClick={onConfirm}>
            Logout &amp; Go Home
          </button>
          <button className="logout-dialog-btn cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog; 