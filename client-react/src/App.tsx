import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";

import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CometChatApp from "./CometChat/CometChatApp"; // 🚀 Mobile/desktop layout handler

function App() {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    CometChat.addLoginListener(
      "zappy-app",
      new CometChat.LoginListener({
        loginSuccess: (user: CometChat.User) => {
          setLoggedInUser(user);
        },
        logoutSuccess: () => {
          setLoggedInUser(null);
          navigate("/");
        },
      })
    );

    return () => CometChat.removeLoginListener("zappy-app");
  }, [navigate]);

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

      {/* ✅ Safe area fix for iOS Safari & Chrome Android */}
      <div className="safe-area-padding"></div>
    </div>
  );
}

export default App;
