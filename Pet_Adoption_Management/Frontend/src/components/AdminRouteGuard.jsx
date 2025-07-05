import React from 'react';
import { useAdminSessionProtection } from '../hooks/useAdminSessionProtection.js';
import AdminSessionPopup from './AdminSessionPopup.jsx';

const AdminRouteGuard = ({ children }) => {
  const { 
    isAdmin, 
    isInAdminRoute, 
    showConfirmation, 
    pendingNavigation,
    handleConfirmNavigation,
    handleCancelNavigation
  } = useAdminSessionProtection();

  // If not admin, don't render the guard
  if (!isAdmin) {
    return children;
  }

  return (
    <>
      {children}
      
      {/* Admin Session Protection Popup */}
      <AdminSessionPopup
        isOpen={showConfirmation}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
        targetRoute={pendingNavigation?.to}
      />
    </>
  );
};

export default AdminRouteGuard; 