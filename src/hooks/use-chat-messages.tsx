import { useState, useEffect } from 'react';
import { getMessagesByChatId, getChatById } from '@/lib/db/queries';
import { convertToUIMessages } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { useUserId } from '@/hooks/use-user-id';
import { ChatSDKError } from '@/lib/errors';

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  chatExists: boolean;
}

export function useChatMessages(chatId: string): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [chatExists, setChatExists] = useState(false);
  const userId = useUserId();

  useEffect(() => {
    let isCancelled = false;

    async function loadMessages() {
      if (!chatId || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First, check if the chat exists and belongs to the current user
        const chat = await getChatById({ id: chatId });
        
        if (!chat) {
          setChatExists(false);
          setMessages([]);
          setIsLoading(false);
          return;
        }

        if (chat.userId !== userId) {
          throw new ChatSDKError('forbidden:chat', 'You do not have access to this chat');
        }

        setChatExists(true);

        const dbMessages = await getMessagesByChatId({ id: chatId });
        
        if (!isCancelled) {
          const uiMessages = convertToUIMessages(dbMessages);
          setMessages(uiMessages);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load chat messages'));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      isCancelled = true;
    };
  }, [chatId, userId]);

  return {
    messages,
    isLoading,
    error,
    chatExists,
  };
}
