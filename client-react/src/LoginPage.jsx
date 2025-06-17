import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import "./LoginPage.css";
import zappyLogo from "./assets/zappy-logo.png"; // your new logo image

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
          <span
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "14px",
              color: "#555",
              userSelect: "none",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button type="submit">Log in</button>

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
