'use client';

import type { Attachment, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/shared/chat-header';

import { fetcher, fetchWithErrorHandlers, generateUUID } from '@/lib/utils';
import { MultimodalInput } from '@/components/shared/multimodal-input';
import { Messages } from '@/components/shared/messages';
import { unstable_serialize } from 'swr/infinite';
//import { getChatHistoryPaginationKey } from './sidebar-history';
import { toast } from 'sonner';
//import { useSearchParams } from 'next/navigation';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { ChatSDKError } from '@/lib/errors';

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  isReadonly,
  autoResume,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  initialChatModel: string;
  isReadonly: boolean;
  autoResume: boolean;
}) {
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    experimental_resume,
    data,
  } = useChat({
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id,
      message: body.messages.at(-1),
      selectedChatModel: initialChatModel,
    }),
    // onFinish: () => {
    //   mutate(unstable_serialize(getChatHistoryPaginationKey));
    // },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast.error(error.message);
      }
    },
  });

  //const searchParams = useSearchParams();
  //const query = searchParams.get('query');

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  // useEffect(() => {
  //   if (input && !hasAppendedQuery) {
  //     append({
  //       role: 'user',
  //       content: input,
  //     });

  //     setHasAppendedQuery(true);
  //     window.history.replaceState({}, '', `/chat/${id}`);
  //   }
  // }, [query, append, hasAppendedQuery, id]);

  //const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  useAutoResume({
    autoResume,
    initialMessages,
    experimental_resume,
    data,
    setMessages,
  });

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
          reload={reload}
          isReadonly={isReadonly}
          //isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              //attachments={attachments}
              //setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
              //selectedVisibilityType={visibilityType}
            />
          )}
        </form>
      </div>

      {/* <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
        selectedVisibilityType={visibilityType}
      /> */}
    </>
  );
}
