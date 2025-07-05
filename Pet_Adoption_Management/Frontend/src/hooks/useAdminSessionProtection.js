import { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext.jsx';
import { isProtectedRoute, isAdminRoute, getRouteDisplayName } from '../utils/navigationUtils.js';

export const useAdminSessionProtection = () => {
  const { role, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [isInAdminRoute, setIsInAdminRoute] = useState(false);

  // Check if current route is an admin route
  const checkIsAdminRoute = useCallback((pathname) => {
    return isAdminRoute(pathname);
  }, []);

  // Check if target route should trigger protection
  const checkIsProtectedRoute = useCallback((pathname) => {
    return isProtectedRoute(pathname);
  }, []);

  // Check if user is admin
  const isAdmin = role === 'admin' && isAuthenticated;

  // Update admin route status when location changes
  useEffect(() => {
    setIsInAdminRoute(checkIsAdminRoute(location.pathname));
  }, [location.pathname, checkIsAdminRoute]);

  // Handle navigation with protection
  const navigateWithProtection = useCallback((to, options = {}) => {
    // If not admin or not in admin route, allow normal navigation
    if (!isAdmin || !isInAdminRoute) {
      navigate(to, options);
      return;
    }

    // If navigating to protected route (homepage) from admin route, show confirmation
    if (checkIsProtectedRoute(to)) {
      setPendingNavigation({ to, options });
      setShowConfirmation(true);
      return;
    }

    // Allow navigation to other admin routes
    navigate(to, options);
  }, [isAdmin, isInAdminRoute, checkIsProtectedRoute, navigate]);

  // Handle confirmation
  const handleConfirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      navigate(pendingNavigation.to, pendingNavigation.options);
    }
    setShowConfirmation(false);
    setPendingNavigation(null);
  }, [pendingNavigation, navigate]);

  // Handle cancel
  const handleCancelNavigation = useCallback(() => {
    setShowConfirmation(false);
    setPendingNavigation(null);
  }, []);

  // Handle direct navigation attempts (e.g., browser back button)
  useEffect(() => {
    if (isAdmin && isInAdminRoute) {
      const handleBeforeUnload = (e) => {
        // This will show browser's default confirmation dialog
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isAdmin, isInAdminRoute]);

  return {
    isAdmin,
    isInAdminRoute,
    showConfirmation,
    pendingNavigation,
    navigateWithProtection,
    handleConfirmNavigation,
    handleCancelNavigation,
    isProtectedRoute: checkIsProtectedRoute
  };
}; 