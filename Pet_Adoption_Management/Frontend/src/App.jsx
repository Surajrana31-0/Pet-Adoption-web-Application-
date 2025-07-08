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

// Generalized ProtectedRoute
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { isAuthenticated, role } = useContext(AuthContext);

  return (
    <>
      <Header />
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;