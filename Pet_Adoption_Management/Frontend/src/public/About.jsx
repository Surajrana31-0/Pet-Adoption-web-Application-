// src/pages/About.jsx
import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page container">
      <section className="about-hero">
        <h1>🐾 Welcome to PawPal</h1>
        <p>
          Connecting loving humans with pets in need of a home. We make adoption simple,
          transparent, and compassionate.
        </p>
      </section>

      <section className="about-section">
        <h2>🌍 Our Mission</h2>
        <p>
          We aim to promote responsible pet ownership by making the adoption process more accessible.
          Every pet deserves a safe, caring, and permanent home.
        </p>
      </section>

      <section className="about-section">
        <h2>⚙️ What You Can Do Here</h2>
        <ul>
          <li>🐶 Browse adoptable pets with full profiles</li>
          <li>🔍 Filter by breed, location, age, and more</li>
          <li>📝 Apply online for pet adoption</li>
          <li>📊 Manage applications in your personal dashboard</li>
          <li>🏠 Shelters can add and update pet listings</li>
          <li>🛡️ Admins maintain platform safety and functionality</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>👤 Who Is This For?</h2>
        <p>
          Our platform is designed for pet lovers, shelters, and administrators looking for an efficient
          and caring way to manage pet adoptions.
        </p>
      </section>

      <section className="about-section">
        <h2>💡 Why We Built This</h2>
        <p>
          Traditional pet adoption can be slow and frustrating. PawPal uses modern tools to streamline
          the process and ensure pets find loving homes faster.
        </p>
      </section>
    </div>
  );
};

export default About;
