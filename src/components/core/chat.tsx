import { type ChatMessage } from '@/lib/types';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/core/chat-header';
import { MultimodalInput } from '@/components/core/multimodal-input';
import { Messages } from '@/components/core/messages';
import { unstable_serialize } from 'swr/infinite';
import { createChatHistoryPaginationKeyGetter } from '@/components/core/sidebar-history';
import { toast } from '@/components/core/toast';
import { useSearchParams } from 'react-router';
import { ChatSDKError } from '@/lib/errors';
import { v4 as uuidv4 } from 'uuid';
import { useUserId } from '@/hooks/use-user-id';
import { BASE_URL } from '@/constants/constants';
import { VLLMChatTransport } from '@/gen-ai/vllm-transport';
import { saveMessages, saveChat, getChatById } from '@/lib/db/queries';
import { generateTitleFromUserMessage } from '@/actions/commons';

export const globalStreamingState = {
  messageId: '',
  content: '',
  isStreaming: false
};

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  isReadonly,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const userId = useUserId();
  const [input, setInput] = useState<string>('');

  // Create transport with callbacks
  const vllmTransport = useMemo(() => {
    return new VLLMChatTransport({
      baseUrl: 'http://129.173.22.43:30001',
      model: 'gemma3:270m',
      onStreamingUpdate: (messageId: string, content: string) => {
        globalStreamingState.messageId = messageId;
        globalStreamingState.content = content;
        globalStreamingState.isStreaming = true;
      },
      onStreamingEnd: () => {
        globalStreamingState.isStreaming = false;
      }
    });
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [status, setStatus] = useState<'ready' | 'submitted' | 'streaming'>('ready');
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  
  const sendMessage = useCallback(async (message: ChatMessage) => {
    console.log('sendMessage called with message role:', message.role, 'chat ID:', id);
    
    let currentMessages: ChatMessage[] = [];
    setMessages(prevMessages => {
      currentMessages = [...prevMessages, message];
      return currentMessages;
    });
    setStatus('submitted');
    
    try {
      // Check if this is the first message by checking if chat exists
      const existingChat = await getChatById({ id });
      
      if (!existingChat && message.role === 'user' && !isCreatingChat) {
        setIsCreatingChat(true);
        
        try {
          const title = await generateTitleFromUserMessage({
            message,
          });
          
          await saveChat({
            id,
            userId,
            title,
          });
        } finally {
          setIsCreatingChat(false);
        }
      }
      
      await saveMessages({
        messages: [{
          id: message.id,
          role: message.role,
          parts: message.parts,
          createdAt: new Date(),
          chatId: id,
        }],
      });
    } catch (error) {
      toast({
        type: 'error',
        description: 'Error saving message',
      });
    }
    
    const assistantMessageId = uuidv4();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      parts: [{ type: 'text', text: '' }],
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setStatus('streaming');
    
    // Initialize streaming state
    globalStreamingState.messageId = assistantMessageId;
    globalStreamingState.content = '';
    globalStreamingState.isStreaming = true;
    
    try {
      const stream = await vllmTransport.sendMessages({
        trigger: 'submit-message',
        chatId: id,
        messageId: assistantMessageId,
        messages: currentMessages,
        abortSignal: undefined,
      });
      
      const reader = stream.getReader();
      let accumulatedContent = '';
      let lastUpdateTime = 0;
      const UPDATE_THROTTLE = 1; // Adjust this value to control the update frequency
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        if (value.type === 'text-delta') {
          // @ts-ignore
          accumulatedContent += value.textDelta || '';
          globalStreamingState.content = accumulatedContent;
          
          // Throttle UI updates for smoother streaming
          const now = Date.now();
          if (now - lastUpdateTime > UPDATE_THROTTLE) {
            setMessages(current => 
              current.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, parts: [{ type: 'text', text: accumulatedContent }] }
                  : msg
              )
            );
            lastUpdateTime = now;
          }
        }
      }
      
      // Final update to ensure all content is displayed
      setMessages(current => 
        current.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, parts: [{ type: 'text', text: accumulatedContent }] }
            : msg
        )
      );
      
      globalStreamingState.isStreaming = false;
      setStatus('ready');
      
      await saveMessages({
        messages: [
          {
            id: assistantMessageId,
            role: 'assistant',
            parts: [{ type: 'text', text: accumulatedContent }],
            createdAt: new Date(),
            chatId: id,
          }
        ],
      });
      
      mutate(unstable_serialize(createChatHistoryPaginationKeyGetter(userId)));
      
    } catch (error) {
      setStatus('ready');
      globalStreamingState.isStreaming = false;
      
      if (error instanceof ChatSDKError) {
        toast({
          type: 'error',
          description: error.message,
        });
      }
    }
  }, [id, userId, isCreatingChat, vllmTransport, mutate]);
  
  const stop = () => {
    setStatus('ready');
    globalStreamingState.isStreaming = false;
  };
  
  const regenerate = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.role === 'user') {
        setMessages(messages.slice(0, -1));
        sendMessage(lastUserMessage);
      }
    }
  };
  
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
        id: uuidv4(),
        role: 'user' as const,
        parts: [{ type: 'text', text: query }],
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, '', `${BASE_URL}/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          selectedModelId={initialChatModel}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          status={status}
          messages={messages}
          setMessages={setMessages}
          // @ts-ignore
          regenerate={regenerate}
          isReadonly={isReadonly}
          isArtifactVisible={false}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              status={status}
              stop={stop}
              messages={messages}
              setMessages={setMessages}
              // @ts-ignore
              sendMessage={sendMessage}
            />
          )}
        </form>
      </div>
    </>
  );
}
