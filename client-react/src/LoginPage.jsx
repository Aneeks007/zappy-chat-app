import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { Eye, EyeOff } from "lucide-react";
import "./LoginPage.css";
import zappyLogo from "./assets/zappy-logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
            setIsLoading(false);
          });
      } else {
        alert("Login failed.");
        setIsLoading(false);
      }
    } catch (err) {
      alert("Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <section className="glass-login-bg">
      <form onSubmit={handleLogin} className="glass-form">
        <img src={zappyLogo} alt="Zappy Logo" className="zappy-logo" />
        <h1>Login</h1>

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
          <span className="toggle-password" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
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
