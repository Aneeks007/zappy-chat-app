import React, { useState } from 'react';
import './SignupPage.css';
import { useNavigate } from 'react-router-dom';
import zappyLogo from './assets/zappy-logo.png';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://zappy-prxq.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate('/');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Signup failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="glass-login-bg">
      <form className="glass-form" onSubmit={handleSignup}>
        <img src={zappyLogo} alt="Zappy Logo" className="zappy-logo" />
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>Sign Up</h2>

        <div className="inputbox">
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <label>Full Name</label>
        </div>

        <div className="inputbox">
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
          <label>User ID</label>
        </div>

        <div className="inputbox">
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <label>Password</label>
        </div>

        <button type="submit">Register</button>

        <div className="register">
          Already have an account? <a href="/">Login</a>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
