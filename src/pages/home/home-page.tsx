import { Chat } from '@/components/core/chat';
import { DEFAULT_CHAT_MODEL } from '@/ai-module/models';
import { v4 as uuidv4 } from 'uuid';
import { DataStreamHandler } from '@/components/core/data-stream-handler';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export function HomePage() {
  const location = useLocation();
  const [chatKey, setChatKey] = useState(() => uuidv4());
  const [chatId, setChatId] = useState(() => uuidv4());

  // Reset chat when URL changes back to root
  useEffect(() => {
    if (location.pathname === '/') {
      const newId = uuidv4();
      setChatKey(newId);
      setChatId(newId);
    }
  }, [location.pathname, location.key]); // location.key changes on navigation

  const chatModelFromCookie = document.cookie.split('; ').find(row => row.startsWith('chat-model='));

  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          key={chatKey}
          id={chatId}
          initialMessages={[]}
          initialChatModel={DEFAULT_CHAT_MODEL}
          isReadonly={false}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        key={chatKey}
        id={chatId}
        initialMessages={[]}
        initialChatModel={chatModelFromCookie.split('=')[1]}
        isReadonly={false}
      />
      <DataStreamHandler />
    </>
  );
}