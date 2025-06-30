import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './public/Header';
import Footer from './public/Footer';
import Home from './public/Home';
import Login from './public/Login';
import Signup from './public/Signup';
import './styles/main.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/dashboard" element={<AdopterDashboard />} /> */}
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