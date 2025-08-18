import { useParams } from 'react-router';
import { Chat } from '@/components/core/chat';
import { DataStreamHandler } from '@/components/core/data-stream-handler';
import { useChatMessages } from '@/hooks/use-chat-messages';
import { DEFAULT_CHAT_MODEL } from '@/gen-ai/models';
import { validate as uuidValidate } from 'uuid';

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
        <div className="text-destructive">Error loading chat</div>
      </div>
    );
  }

  // Check if this is a valid UUID format (indicating a new chat that may not be saved yet)
  const isValidUUID = uuidValidate(id);
  
  if (!chatExists && !isLoading) {
    // If it's a valid UUID, it might be a new chat - allow it to proceed
    // If it's not a valid UUID, redirect to home
    if (!isValidUUID) {
      window.location.href = '/';
      return null;
    }
    // For valid UUIDs that don't exist in DB yet, proceed with empty messages
    // The chat will be created when the first message is sent
  }

  if (!chatExists) {
    // TODO: Handle the UI
    return (
      <div className="flex flex-col min-w-0 h-dvh bg-background items-center justify-center">
        <div className="text-destructive">Chat not found</div>
      </div>
    );
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
