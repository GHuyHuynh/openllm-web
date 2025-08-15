import { type ChatMessage } from '@/lib/types';
import { useDataStream } from '@/components/core/data-stream-provider';
import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
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

const vllmTransport = new VLLMChatTransport({
  baseUrl: 'http://localhost:11434',
  model: 'smollm2:135m',
});

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
  const { setDataStream } = useDataStream();

  const [input, setInput] = useState<string>('');

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate
  } = useChat({
    id,
    messages: initialMessages,
    //experimental_throttle: 100,
    generateId: () => uuidv4(),
    // NOTE: This is a workaround to use the vllm transport with the ai sdk because of the beta
    // Nothing major because of the tool type mismatch but we dont use tools in this app
    // @ts-expect-error - tool type mismatch
    transport: vllmTransport,
    onData: (dataPart) => {
      setDataStream((ds) => (ds ? [...ds, dataPart] : []));
    },
    onFinish: () => {
      mutate(unstable_serialize(createChatHistoryPaginationKeyGetter(userId)));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast({
          type: 'error',
          description: error.message,
        });
      }
    },
  });

  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
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
              sendMessage={sendMessage}
            />
          )}
        </form>
      </div>
    </>
  );
}
