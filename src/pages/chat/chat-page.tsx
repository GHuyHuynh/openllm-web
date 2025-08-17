import { useParams } from 'react-router';
import { Chat } from '@/components/core/chat';
import { DataStreamHandler } from '@/components/core/data-stream-handler';
import { useChatMessages } from '@/hooks/use-chat-messages';
import { DEFAULT_CHAT_MODEL } from '@/gen-ai/models';

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    // Redirect to home if no ID is provided
    window.location.href = '/';
    return null;
  }

  const { messages, isLoading, error, chatExists } = useChatMessages(id);

  const chatModelFromCookie = document.cookie.split('; ').find(row => row.startsWith('chat-model='));
  const chatModel = chatModelFromCookie ? chatModelFromCookie.split('=')[1] : DEFAULT_CHAT_MODEL;

  if (isLoading) {
    return (
      <div className="flex flex-col min-w-0 h-dvh bg-background items-center justify-center">
        <div className="text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-w-0 h-dvh bg-background items-center justify-center">
        <div className="text-destructive">Error loading chat: {error.message}</div>
      </div>
    );
  }

  if (!chatExists && !isLoading) {
    // Chat doesn't exist, redirect to home
    window.location.href = '/';
    return null;
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={messages}
        initialChatModel={chatModel}
        isReadonly={false}
      />
      <DataStreamHandler />
    </>
  );
}
