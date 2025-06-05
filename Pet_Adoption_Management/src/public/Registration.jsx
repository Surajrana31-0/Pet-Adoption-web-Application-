import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/Registration.css';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormMessage({ text: '', type: '' });

    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      setFormMessage({ text: 'Please fill in all fields.', type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setFormMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    // Dummy success action
    setFormMessage({ text: 'Registration successful! Redirecting to Login...', type: 'success' });

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <>
      <header>Pet Adoption</header>
      <main>
        <h2>Register</h2>
        {formMessage.text && (
          <div className={formMessage.type === 'error' ? 'error-message' : 'success-message'}>
            {formMessage.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />

          <button type="submit" className="btn">Register</button>
        </form>

        <div className="links">
          Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a>
        </div>
      </main>
    </>
  );
};

export default Registration; 