import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const { email, password } = formData;

    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    // Simple dummy validation
    if(email === "user@example.com" && password === "password123") {
      alert('Login successful! Redirecting to home page...');
      navigate('/');
    } else {
      setErrorMsg('Invalid email or password.');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Password recovery feature is not implemented yet.');
  };

  return (
    <>
      <header>Pet Adoption</header>
      <main>
        <h2>Login</h2>
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        
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
          
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button type="submit" className="btn">Login</button>
        </form>

        <div className="links">
          <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Register</a> | 
          <a href="#" onClick={handleForgotPassword} style={{ color: 'var(--error)' }}>Forgot Password?</a>
        </div>
      </main>
    </>
  );
};

export default Login; 