import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAdminSessionProtection } from '../hooks/useAdminSessionProtection.js';

const ProtectedLink = ({ to, children, className, onClick, ...props }) => {
  const { navigateWithProtection } = useAdminSessionProtection();

  const handleClick = (e) => {
    e.preventDefault();
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Use protected navigation
    navigateWithProtection(to);
  };

  return (
    <RouterLink
      to={to}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default ProtectedLink; 