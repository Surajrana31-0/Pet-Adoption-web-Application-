import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import Home from "./public/Home.jsx";
import About from "./public/About.jsx";
import Contact from "./public/Contact.jsx";
import Login from "./public/Login.jsx";
import Signup from "./public/Signup.jsx";
import Footer from "./public/Footer.jsx";
import Header from "./public/Header.jsx";
import AdminDashboard from "./private/AdminDashboard.jsx";
import AdopterDashboard from "./private/AdopterDashboard.jsx";
import AdminRouteGuard from "./components/AdminRouteGuard.jsx";
import ResetPassword from "./public/ResetPassword.jsx";
import NewPassword from "./public/NewPassword.jsx";
import NavigationBar from "./components/admin/NavigationBar.jsx";
import Profile from "./private/Profile.jsx";
import ProfileEdit from "./private/ProfileEdit.jsx";

// Generalized ProtectedRoute
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { isAuthenticated, role } = useContext(AuthContext);

  // Helper to determine if current route is private
  // We'll use window.location.pathname for simplicity
  const privateRoutes = ["/dashboard", "/admin", "/applications", "/profile"];
  const isPrivateRoute = privateRoutes.some((route) => window.location.pathname.startsWith(route));

  return (
    <>
      {isAuthenticated && isPrivateRoute ? <NavigationBar /> : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={
            isAuthenticated
              ? role === "admin"
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Login />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="user"><AdopterDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard>
          </ProtectedRoute>
        } />
        {/* Add private routes for applications and profile if needed */}
        <Route path="/applications" element={<ProtectedRoute requiredRole="user"><div>My Applications Page</div></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requiredRole="user"><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute requiredRole="user"><ProfileEdit /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;