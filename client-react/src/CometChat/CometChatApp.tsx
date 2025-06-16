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

  return isMobile ? (
    <MobileChatUI user={user} group={group} />
  ) : (
    <DesktopChatUI defaultUser={user} defaultGroup={group} />
  );
}

export default CometChatApp;
