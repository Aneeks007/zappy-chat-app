import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";

import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CometChatApp from "./CometChat/CometChatApp";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔁 Handle viewport height on mobile
  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    updateVh();
    window.addEventListener('resize', updateVh);
    return () => window.removeEventListener('resize', updateVh);
  }, []);

  // 📡 Listen for login/logout
  useEffect(() => {
    CometChat.addLoginListener(
      "zappy-app",
      new CometChat.LoginListener({
        loginSuccess: (user: CometChat.User) => setLoggedInUser(user),
        logoutSuccess: () => {
          setLoggedInUser(null);
          navigate("/");
        },
      })
    );
    return () => CometChat.removeLoginListener("zappy-app");
  }, [navigate]);

  // 🧠 Fetch if already logged in
  useEffect(() => {
    const fetchUser = async () => {
      const user = await CometChatUIKitLoginListener?.getLoggedInUser?.();
      if (user) setLoggedInUser(user);
    };
    fetchUser();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat" element={<CometChatApp user={loggedInUser} />} />
      </Routes>
    </div>
  );
}

export default App;
