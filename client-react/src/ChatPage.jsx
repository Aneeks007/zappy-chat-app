import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import ProfileDropdown from "./components/ProfileDropdown";

const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({
    name: "Aneek Shah",
    avatar: "/default-avatar.png",
  });

  const handleProfileUpdate = (updatedUser) => {
    console.log("User updated:", updatedUser);
    setUser(updatedUser);
    setShowProfile(false);
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const profileOption = Array.from(document.querySelectorAll('div[role="menuitem"]'))
        .find((el) => el.textContent?.includes(user.name));
      if (profileOption) {
        profileOption.onclick = () => setShowProfile(true);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [user.name]);

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <h2 className="chat-title">Chats</h2>
        <div className="chat-item active">Richard Ray</div>
        <div className="chat-item">Sarah Beth</div>
        <div className="chat-item">Robert Allen</div>
        <div className="chat-item">Epic Game</div>
      </div>

      {/* Chat Main */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-user-info">
            <ProfileDropdown user={user} onUpdate={handleProfileUpdate} />
            <span className="chat-status online">Online</span>
          </div>
        </div>

        <div className="chat-messages">
          <div className="chat-bubble received">Yes, it’s available.</div>
          <div className="chat-bubble sent">Hi, is the watch still up for sale?</div>
          <div className="chat-bubble sent">Awesome! Can I see pictures?</div>
          <div className="chat-bubble received">Sure! Sending them now.</div>
          <div className="chat-bubble sent">Thanks! Looks good.</div>
          <div className="chat-bubble sent">I’ll take it. Can you ship?</div>
        </div>

        <div className="chat-input">
          <input type="text" placeholder="Type a message..." />
          <button type="button" className="send-btn">➤</button>
        </div>
      </div>

      {showProfile && (
        <div style={{ position: "absolute", top: 60, right: 20, zIndex: 9999 }}>
          <ProfileDropdown user={user} onUpdate={handleProfileUpdate} />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
