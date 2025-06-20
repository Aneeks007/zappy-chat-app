import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CometChat } from "@cometchat/chat-sdk-javascript";

import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CometChatApp from "./CometChat/CometChatApp";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // 🚫 Don’t move this below any condition

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
      try {
        const user = await CometChat.getLoggedinUser?.();
        if (user) setLoggedInUser(user);
      } catch (err) {
        console.warn("❌ Error fetching user:", err);
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
      <div className="safe-area-padding" />
    </div>
  );
}

export default App;
