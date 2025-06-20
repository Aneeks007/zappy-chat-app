import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";

import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CometChatApp from "./CometChat/CometChatApp";

const App = () => {
  const navigate = useNavigate(); // ✅ Must be called directly here
  const location = useLocation();

  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);

  useEffect(() => {
    CometChat.addLoginListener(
      "zappy-app",
      new CometChat.LoginListener({
        loginSuccess: (user: CometChat.User) => {
          setLoggedInUser(user);
        },
        logoutSuccess: () => {
          setLoggedInUser(null);
          navigate("/"); // ✅ This is fine now
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
      <div className="safe-area-padding" />
    </div>
  );
};

export default App;
