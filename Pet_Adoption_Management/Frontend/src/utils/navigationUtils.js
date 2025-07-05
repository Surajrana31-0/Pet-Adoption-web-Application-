// Define route categories for admin session protection
export const ROUTE_CATEGORIES = {
  PROTECTED: ['/'], // Only homepage triggers protection
  PUBLIC: ['/about', '/contact', '/login', '/signup', '/adopt'], // Other public routes
  ADMIN: ['/admin', '/admin/dashboard', '/admin/users', '/admin/pets', '/admin/adoptions', '/admin/settings'],
  USER: ['/dashboard', '/profile', '/applications', '/favorites']
};

// Check if a route should trigger protection (only homepage)
export const isProtectedRoute = (pathname) => {
  return ROUTE_CATEGORIES.PROTECTED.includes(pathname);
};

// Check if a route is public (for reference)
export const isPublicRoute = (pathname) => {
  return ROUTE_CATEGORIES.PUBLIC.includes(pathname) || ROUTE_CATEGORIES.PROTECTED.includes(pathname);
};

// Check if a route is admin-only
export const isAdminRoute = (pathname) => {
  return pathname.startsWith('/admin') || ROUTE_CATEGORIES.ADMIN.includes(pathname);
};

// Check if a route is user-only
export const isUserRoute = (pathname) => {
  return ROUTE_CATEGORIES.USER.includes(pathname) || pathname.startsWith('/dashboard');
};

// Get route display name for confirmation popup
export const getRouteDisplayName = (pathname) => {
  const routeNames = {
    '/': 'Home',
    '/about': 'About',
    '/contact': 'Contact',
    '/login': 'Login',
    '/signup': 'Sign Up',
    '/adopt': 'Adopt Pets',
    '/dashboard': 'User Dashboard',
    '/admin': 'Admin Dashboard'
  };
  
  return routeNames[pathname] || pathname;
};

// Check if navigation should trigger protection
export const shouldTriggerProtection = (fromRoute, toRoute, userRole) => {
  // Only trigger for admin users
  if (userRole !== 'admin') return false;
  
  // Only trigger when navigating from admin route to protected route (homepage)
  return isAdminRoute(fromRoute) && isProtectedRoute(toRoute);
}; 