import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import ProfileDropdown from "./components/ProfileDropdown";
import {
  generateAESKey,
  encryptWithAES,
  encryptAESKeyWithRSA,
  decryptAESKeyWithRSA,
  decryptWithAES
} from "./e2ee";

const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({
    name: "Aneek Shah",
    avatar: "/default-avatar.png",
  });

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]); // encrypted messages

  const handleProfileUpdate = (updatedUser) => {
    console.log("User updated:", updatedUser);
    setUser(updatedUser);
    setShowProfile(false);
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const profileOption = Array.from(
        document.querySelectorAll('div[role="menuitem"]')
      ).find((el) => el.textContent?.includes(user.name));
      if (profileOption) {
        profileOption.onclick = () => setShowProfile(true);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [user.name]);

  const handleSendMessage = async () => {
    const receiverUsername = "RichardRay"; // Replace with dynamic selection if needed

    try {
      const aes = await generateAESKey();
      const { ciphertext, iv } = await encryptWithAES(aes.key, messageText);

      const res = await fetch(
        `https://zappy-prxq.onrender.com/api/auth/public-key/${receiverUsername}`
      );
      const { publicKey } = await res.json();

      const encryptedAESKey = await encryptAESKeyWithRSA(publicKey, aes.raw);

      const newEncryptedMessage = {
        text: ciphertext,
        custom: {
          iv,
          encryptedAESKey,
          receiver: receiverUsername,
        },
        sender: user.username || "Aneek Shah",
      };

      // Simulate sending (replace with CometChat/StreamChat send)
      setMessages((prev) => [...prev, newEncryptedMessage]);
      setMessageText("");
    } catch (err) {
      console.error("❌ Encryption error:", err);
      alert("Message encryption failed.");
    }
  };

  const decryptMessage = async (msg) => {
    try {
      const privateKey = localStorage.getItem("zappy_private_key");
      if (!privateKey || !msg?.custom?.encryptedAESKey) return msg.text;

      const aesKey = await decryptAESKeyWithRSA(privateKey, msg.custom.encryptedAESKey);
      const plainText = await decryptWithAES(aesKey, msg.text, msg.custom.iv);

      return plainText;
    } catch (err) {
      console.warn("❌ Decryption failed:", err);
      return msg.text;
    }
  };

  const EncryptedMessageBubble = ({ msg }) => {
    const [text, setText] = useState("Decrypting...");

    useEffect(() => {
      const decrypt = async () => {
        const result = await decryptMessage(msg);
        setText(result);
      };
      decrypt();
    }, [msg]);

    return (
      <div className={`chat-bubble ${msg.sender === user.username ? "sent" : "received"}`}>
        {text}
      </div>
    );
  };

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
          {messages.map((msg, index) => (
            <EncryptedMessageBubble key={index} msg={msg} />
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            type="button"
            className="send-btn"
            onClick={handleSendMessage}
          >
            ➤
          </button>
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
