import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CometChat } from "@cometchat/chat-sdk-javascript";
// 👇 Comment or fix this if you’re not using UIKit
// import { CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";

import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CometChatApp from "./CometChat/CometChatApp"; // 🚀 Handles mobile/desktop

function App() {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);

  let navigate: ReturnType<typeof useNavigate> | undefined;
  let location: ReturnType<typeof useLocation> | undefined;

  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (err) {
    console.warn("⚠️ Router context not ready yet:", err);
  }

  useEffect(() => {
    if (!navigate) return;

    CometChat.addLoginListener(
      "zappy-app",
      new CometChat.LoginListener({
        loginSuccess: (user: CometChat.User) => {
          setLoggedInUser(user);
        },
        logoutSuccess: () => {
          setLoggedInUser(null);
          navigate && navigate("/");
        },
      })
    );

    return () => CometChat.removeLoginListener("zappy-app");
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await CometChat.getLoggedinUser?.();
        if (user) setLoggedInUser(user);
      } catch (err) {
        console.warn("❌ Failed to fetch logged-in user:", err);
      }
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

      {/* ✅ Invisible padding div for safe area inset on mobile */}
      <div className="safe-area-padding" />
    </div>
  );
}

export default App;
