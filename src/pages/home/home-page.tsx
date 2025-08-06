import { Chat } from '@/components/core/chat';
import { DEFAULT_CHAT_MODEL } from '@/gen-ai/models';
import { v4 as uuidv4 } from 'uuid';
import { DataStreamHandler } from '@/components/core/data-stream-handler';

export function HomePage() {
  const id = uuidv4();

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        isReadonly={false}
        autoResume={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
