import { Chat } from '@/components/core/chat';
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

  return (
    <>
      <Chat key={chatKey} id={chatId} initialMessages={[]} isReadonly={false} />
      <DataStreamHandler />
    </>
  );
}
