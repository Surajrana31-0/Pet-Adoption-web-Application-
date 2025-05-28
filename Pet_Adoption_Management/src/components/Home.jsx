import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <header>Pet Adoption</header>
      <main>
        <h1>Welcome to your new best friend's home</h1>
        <h2>Find loving pets waiting for a forever family.</h2>

        <button className="btn" onClick={() => navigate('/login')}>Login</button>
        <button className="btn" onClick={() => navigate('/register')}>Register</button>

        <div className="image-container" aria-label="Happy dogs and cats">
          <img src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=700&q=80" alt="Group of happy dogs and cats" />
        </div>
      </main>
      <footer>© 2024 Pet Adoption Management System</footer>
    </>
  );
};

export default Home; 