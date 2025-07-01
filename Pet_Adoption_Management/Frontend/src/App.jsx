import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './public/Header';
import Footer from './public/Footer';
import Home from './public/Home';
import Login from './public/Login';
import Signup from './public/Signup';
import AdopterDashboard from './private/AdopterDashboard';
import AdminDashboard from './private/AdminDashboard';
import Contact from './public/Contact';
import './styles/main.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<AdopterDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Placeholder routes for navigation links */}
            <Route path="/adopt" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Adopt Page - Coming Soon!</h1></div>} />
            <Route path="/about" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">About Page - Coming Soon!</h1></div>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;