import React, { useEffect, useState } from 'react';
import { CometChatHome as DesktopChatUI } from './components/CometChatHome/CometChatHome';
import MobileChatUI from '../mobile/MobileChatUI';

interface CometChatAppProps {
  user?: any;
  group?: any;
}

function CometChatApp({ user, group }: CometChatAppProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Show greeting once after login
  useEffect(() => {
    const greet = localStorage.getItem("greeting");
    if (greet) {
      alert(greet); // ✅ Change to toast/snackbar if needed
      localStorage.removeItem("greeting");
    }
  }, []);

  return isMobile ? (
    <MobileChatUI user={user} group={group} />
  ) : (
    <DesktopChatUI defaultUser={user} defaultGroup={group} />
  );
}

export default CometChatApp;
