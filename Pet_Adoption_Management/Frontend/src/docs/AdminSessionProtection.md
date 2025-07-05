# Admin Session Protection

## Overview

The Admin Session Protection feature provides enhanced security for admin users by preventing accidental navigation away from protected admin routes to the homepage. When an admin user attempts to navigate to the homepage while in an admin session, a confirmation popup appears asking if they want to leave the admin panel.

## Features

- 🔐 **Session Protection**: Prevents accidental navigation from admin routes to public routes
- 🛡️ **Confirmation Dialog**: Modern, responsive popup with clear messaging
- 🔄 **Session Integrity**: Maintains JWT tokens unless user confirms logout
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Performance**: Lightweight implementation with minimal overhead

## How It Works

### 1. Route Detection
The system automatically detects:
- **Admin Routes**: `/admin`, `/admin/dashboard`, `/admin/users`, etc.
- **Protected Routes**: `/` (homepage only)
- **Public Routes**: `/about`, `/contact`, `/login`, `/signup`, `/adopt`
- **User Routes**: `/dashboard`, `/profile`, `/applications`, etc.

### 2. Protection Logic
- Only triggers for users with `role === "admin"`
- Only activates when navigating from admin routes to homepage (`/`)
- Allows free navigation to About, Contact, Adopt, Login, and Signup pages
- Allows free navigation between admin routes
- Allows free navigation for non-admin users

### 3. User Experience
When an admin user tries to navigate to the homepage:
1. Confirmation popup appears
2. User can choose "Stay in Admin Panel" or "Go to Homepage"
3. If confirmed, navigation proceeds normally
4. If cancelled, user remains in current admin route

## Components

### Core Components

#### `useAdminSessionProtection` Hook
```javascript
const {
  isAdmin,
  isInAdminRoute,
  showConfirmation,
  pendingNavigation,
  navigateWithProtection,
  handleConfirmNavigation,
  handleCancelNavigation
} = useAdminSessionProtection();
```

#### `AdminSessionPopup` Component
```javascript
<AdminSessionPopup
  isOpen={showConfirmation}
  onConfirm={handleConfirmNavigation}
  onCancel={handleCancelNavigation}
  targetRoute={pendingNavigation?.to}
/>
```

#### `AdminRouteGuard` Component
```javascript
<AdminRouteGuard>
  <AdminDashboard />
</AdminRouteGuard>
```

### Utility Functions

#### `navigationUtils.js`
- `isPublicRoute(pathname)`: Check if route is public
- `isAdminRoute(pathname)`: Check if route is admin-only
- `getRouteDisplayName(pathname)`: Get human-readable route name
- `shouldTriggerProtection(from, to, role)`: Check if protection should trigger

## Implementation

### 1. Header Integration
The Header component automatically uses admin session protection for all navigation links when an admin user is logged in.

### 2. Route Protection
Admin routes are wrapped with `AdminRouteGuard` in `App.jsx`:

```javascript
<Route path="/admin" element={
  <AdminRoute>
    <AdminRouteGuard>
      <AdminDashboard />
    </AdminRouteGuard>
  </AdminRoute>
} />
```

### 3. Custom Navigation
For custom navigation in components:

```javascript
import { useAdminSessionProtection } from '../hooks/useAdminSessionProtection.js';

const MyComponent = () => {
  const { navigateWithProtection } = useAdminSessionProtection();
  
  const handleNavigation = () => {
    navigateWithProtection('/about');
  };
  
  return <button onClick={handleNavigation}>Go to About</button>;
};
```

## Configuration

### Adding New Routes
To add new routes to the protection system, update `navigationUtils.js`:

```javascript
export const ROUTE_CATEGORIES = {
  PUBLIC: ['/', '/about', '/contact', '/login', '/signup', '/adopt', '/new-public-route'],
  ADMIN: ['/admin', '/admin/dashboard', '/admin/new-admin-route'],
  USER: ['/dashboard', '/profile', '/applications', '/favorites', '/new-user-route']
};
```

### Customizing the Popup
The confirmation popup can be customized by modifying:
- `AdminSessionPopup.jsx` - Component structure
- `AdminSessionPopup.css` - Styling and animations

## Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Security Considerations

1. **JWT Token Preservation**: Tokens remain intact unless user confirms logout
2. **Route Validation**: Server-side validation should always be the primary security layer
3. **Session Timeout**: Automatic logout on token expiry is handled by AuthContext
4. **Browser Navigation**: `beforeunload` event provides additional protection

## Troubleshooting

### Common Issues

1. **Popup not showing**: Check if user has admin role and is in admin route
2. **Navigation blocked**: Ensure target route is in PUBLIC_ROUTES array
3. **Styling issues**: Verify CSS file is imported correctly

### Debug Mode
Add console logs to debug:

```javascript
const { isAdmin, isInAdminRoute } = useAdminSessionProtection();
console.log('Admin:', isAdmin, 'In Admin Route:', isInAdminRoute);
```

## Future Enhancements

- [ ] Customizable confirmation messages
- [ ] Session timeout warnings
- [ ] Activity tracking
- [ ] Multi-tab session management
- [ ] Advanced route permissions 