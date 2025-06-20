import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";

import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CometChatApp from "./CometChat/CometChatApp"; // 🚀 Handles mobile/desktop

function App() {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  
  const navigate = useNavigate(); // ✅ always call hooks at top level
  const location = useLocation();

  useEffect(() => {
    CometChat.addLoginListener(
      "zappy-app",
      new CometChat.LoginListener({
        loginSuccess: (user: CometChat.User) => {
          setLoggedInUser(user);
        },
        logoutSuccess: () => {
          setLoggedInUser(null);
          navigate("/"); // works now without hook violation
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
      <Routes location={location}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat" element={<CometChatApp user={loggedInUser} />} />
      </Routes>

      <div className="safe-area-padding" />
    </div>
  );
}

export default App;
