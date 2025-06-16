import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import logo from "./assets/zappy-logo.png";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      if (res.status === 201) {
        alert("Signup successful. Please login.");
        navigate("/");
      } else {
        alert("Signup failed. Username may already exist.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  return (
    <section className="glass-login-bg">
      <form className="glass-form" onSubmit={handleSignup}>
        <img src={logo} alt="Zappy Logo" className="form-logo" />
        <h1>Sign Up</h1>
        <div className="inputbox">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Full Name</label>
        </div>
        <div className="inputbox">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>User ID</label>
        </div>
        <div className="inputbox">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>
        <button type="submit">Sign Up</button>
        <div className="register">
          <p>
            Already have an account?{" "}
            <a href="#" onClick={() => navigate("/")}>
              Login
            </a>
          </p>
        </div>
      </form>
    </section>
  );
};

export default SignUpPage;
