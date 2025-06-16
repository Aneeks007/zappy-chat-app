import React from "react";
import "./ChatPage.css";

const ChatPage = () => {
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
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-user-info">
            <h3 className="chat-user-name">Richard Ray</h3>
            <span className="chat-status online">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          <div className="chat-bubble received">Yes, it’s available.</div>
          <div className="chat-bubble sent">Hi, is the watch still up for sale?</div>
          <div className="chat-bubble sent">Awesome! Can I see pictures?</div>
          <div className="chat-bubble received">Sure! Sending them now.</div>
          <div className="chat-bubble sent">Thanks! Looks good.</div>
          <div className="chat-bubble sent">I’ll take it. Can you ship?</div>
        </div>

        {/* Chat Input */}
        <div className="chat-input">
          <input type="text" placeholder="Type a message..." />
          <button type="button" className="send-btn">➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
