import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './public/Header';
import Footer from './public/Footer';
import Home from './public/Home';
import Login from './public/Login';
import Signup from './public/Signup';
import AdopterDashboard from './private/AdopterDashboard';
import jwtDecode from 'jwt-decode';
import './styles/main.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><AdopterDashboard /></PrivateRoute>} />
          {/* Placeholder routes for navigation links */}
          <Route path="/adopt" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Adopt Page - Coming Soon!</h1></div>} />
          <Route path="/about" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">About Page - Coming Soon!</h1></div>} />
          <Route path="/contact" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Contact Page - Coming Soon!</h1></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;