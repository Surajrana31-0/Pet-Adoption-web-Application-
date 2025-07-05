import React from 'react';
import { useAdminSessionProtection } from '../hooks/useAdminSessionProtection.js';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import '../styles/AdminSessionTest.css';

const AdminSessionTest = () => {
  const { role, isAuthenticated } = useContext(AuthContext);
  const { 
    isAdmin, 
    isInAdminRoute, 
    navigateWithProtection 
  } = useAdminSessionProtection();

  if (!isAuthenticated) {
    return (
      <div className="test-container">
        <h3>Admin Session Protection Test</h3>
        <p>Please log in to test the admin session protection.</p>
      </div>
    );
  }

  return (
    <div className="test-container">
      <h3>Admin Session Protection Test</h3>
      
      <div className="test-info">
        <p><strong>User Role:</strong> {role}</p>
        <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        <p><strong>In Admin Route:</strong> {isInAdminRoute ? 'Yes' : 'No'}</p>
      </div>

      {isAdmin && (
        <div className="test-actions">
          <h4>Test Navigation (Admin Only)</h4>
          <p>Click these buttons to test the session protection:</p>
          
          <div className="test-buttons">
            <button 
              onClick={() => navigateWithProtection('/')}
              className="test-button"
            >
              Navigate to Home (Protected)
            </button>
            
            <button 
              onClick={() => navigateWithProtection('/about')}
              className="test-button"
            >
              Navigate to About (Unprotected)
            </button>
            
            <button 
              onClick={() => navigateWithProtection('/contact')}
              className="test-button"
            >
              Navigate to Contact (Unprotected)
            </button>
            
            <button 
              onClick={() => navigateWithProtection('/adopt')}
              className="test-button"
            >
              Navigate to Adopt (Unprotected)
            </button>
          </div>
          
          <div className="test-note">
            <p><strong>Note:</strong> Only the Homepage navigation should trigger the confirmation popup when in an admin route.</p>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="test-note">
          <p>You need admin privileges to test the session protection feature.</p>
        </div>
      )}
    </div>
  );
};

export default AdminSessionTest; 