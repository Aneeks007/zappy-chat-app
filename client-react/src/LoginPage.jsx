import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning Aneek!");
    else if (hour < 18) setGreeting("Good Afternoon Aneek!");
    else setGreeting("Good Evening Aneek!");
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/chat");
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <div className="login-box">
        <h2 className="greeting">{greeting}</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
