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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  return isAuthenticated && role === "admin" ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><AdopterDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard>
          </AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;