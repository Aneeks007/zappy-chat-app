/* eslint-disable react/no-unescaped-entities */
import './styles/CometChatApp.css';
import { CometChatHome } from '../CometChat/components/CometChatHome/CometChatHome';
import React, { useEffect, useState } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { CometChatUIKit } from '@cometchat/chat-uikit-react';
import '@cometchat/chat-uikit-react/css-variables.css';

interface CometChatHomeProps {
  user?: CometChat.User;
  group?: CometChat.Group;
}

function MobileChatUI({ user, group }: CometChatHomeProps) {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);

  // ✅ Fix full height on all mobile devices
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  // ✅ Listen for CometChat login/logout
  useEffect(() => {
    CometChat.addLoginListener(
      'zappy-app',
      new CometChat.LoginListener({
        loginSuccess: (user: CometChat.User) => setLoggedInUser(user),
        logoutSuccess: () => setLoggedInUser(null),
      })
    );
    return () => CometChat.removeLoginListener('zappy-app');
  }, []);

  // ✅ Check if user is already logged in
  useEffect(() => {
    CometChatUIKit.getLoggedinUser().then((user: CometChat.User | null) => {
      setLoggedInUser(user ?? null);
    });
  }, []);

  // ✅ Prevent Enter key propagation on search bar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement?.classList.contains('cometchat-search-bar__input')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="CometChatApp" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {loggedInUser ? (
        <CometChatHome defaultGroup={group} defaultUser={user} />
      ) : (
        <LoginPlaceholder />
      )}
    </div>
  );
}

export default MobileChatUI;

const LoginPlaceholder = () => {
  return (
    <div className="login-placeholder">
      <div className="cometchat-logo" />
      <h3>This is where your website&apos;s login screen should appear.</h3>
    </div>
  );
};
