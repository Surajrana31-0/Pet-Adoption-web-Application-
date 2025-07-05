import React from 'react';
import { Shield, AlertTriangle, X } from 'lucide-react';
import '../styles/AdminSessionPopup.css';

const AdminSessionPopup = ({ isOpen, onConfirm, onCancel, targetRoute }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-session-overlay">
      <div className="admin-session-popup">
        <div className="popup-header">
          <div className="popup-icon">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="popup-title">Admin Session Protection</h3>
          <button onClick={onCancel} className="popup-close">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="popup-content">
          <div className="warning-icon">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <p className="popup-message">
            Are you sure you want to navigate to the homepage?
          </p>
          <p className="popup-submessage">
            You may need to log in again to access admin features.
          </p>
          {targetRoute && (
            <p className="popup-target">
              Navigating to: <span className="target-route">{targetRoute}</span>
            </p>
          )}
        </div>
        
        <div className="popup-actions">
          <button onClick={onCancel} className="popup-button cancel">
            Stay in Admin Panel
          </button>
          <button onClick={onConfirm} className="popup-button confirm">
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSessionPopup; 