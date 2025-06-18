import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import "./LoginPage.css";
import zappyLogo from "./assets/zappy-logo.png";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("https://zappy-backend-2s1w.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("chat-user", JSON.stringify(data));
        CometChatUIKit.login(email)
          .then(() => navigate("/chat"))
          .catch((error) => {
            console.error("CometChat login failed:", error);
            alert("CometChat login failed.");
          });
      } else {
        alert("Login failed.");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="glass-login-bg">
      <form onSubmit={handleLogin} className="glass-form">
        <img src={zappyLogo} alt="Zappy Logo" className="zappy-logo" />
        <h1>Login</h1>

        <div className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun size={20} color="#fff" /> : <Moon size={20} />}
        </div>

        <div className="inputbox">
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>User ID</label>
        </div>

        <div className="inputbox">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
          <span
            className="toggle-password"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? <Eye size={18} color="#fff" /> : <EyeOff size={18} color="#fff" />}
          </span>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <div className="register">
          <p>
            Don't have an account?{" "}
            <a href="#" onClick={() => navigate("/signup")}>
              Register
            </a>
          </p>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
