import React, { useState, useRef } from "react";
import "./ProfileDropdown.css";

const ProfileDropdown = ({ user, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate({ name, avatar });
    setIsOpen(false);
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
        <img src={avatar} alt="avatar" className="avatar" />
        <span>{user.name}</span>
      </div>

      {isOpen && (
        <div className="dropdown-panel">
          <label>Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Change Avatar</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {avatar && <img src={avatar} alt="preview" className="preview" />}

          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
