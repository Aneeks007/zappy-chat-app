import React, { useState } from 'react';
import './SignupPage.css';
import { useNavigate } from 'react-router-dom';
import zappyLogo from './assets/zappy-logo.png';
import { generateKeyPair } from './utils/e2ee'; // ✅ Import key generator

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
      // ✅ Generate E2EE key pair
      const { publicKey, privateKey } = await generateKeyPair();

      // ✅ Store private key securely in localStorage
      localStorage.setItem("zappy_private_key", privateKey);

      // ✅ Append public key to signup form data
      const payload = {
        ...formData,
        publicKey,
      };

      const res = await fetch('https://zappy-prxq.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
