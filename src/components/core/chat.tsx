import { type ChatMessage } from '@/lib/types';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/core/chat-header';
import { MultimodalInput } from '@/components/core/multimodal-input';
import { Messages } from '@/components/core/messages';
import { unstable_serialize } from 'swr/infinite';
import { createChatHistoryPaginationKeyGetter } from '@/components/core/sidebar-history';
import { toast } from '@/components/core/toast';
import { toast as sonnerToast } from 'sonner';
import { useSearchParams } from 'react-router';
import { ChatSDKError } from '@/lib/errors';
import { v4 as uuidv4 } from 'uuid';
import { useUserId } from '@/hooks/use-user-id';
import {
  BASE_URL,
  VLLM_BASE_URL,
  DEFAULT_VLLM_MODEL,
} from '@/constants/constants';
import { VLLMChatTransport } from '@/ai-module/vllm-transport';
import { saveMessages, saveChat, getChatById } from '@/lib/db/queries';
import { generateTitleFromUserMessage } from '@/actions/actions';

export const globalStreamingState = {
  messageId: '',
  content: '',
  isStreaming: false,
};

export function Chat({
  id,
  initialMessages,
  isReadonly,
}: {
  id: string;
  initialMessages: ChatMessage[];
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const userId = useUserId();
  const [input, setInput] = useState<string>('');

  // Create transport with callbacks
  const vllmTransport = useMemo(() => {
    return new VLLMChatTransport({
      baseUrl: VLLM_BASE_URL,
      model: DEFAULT_VLLM_MODEL,
      onStreamingUpdate: (messageId: string, content: string) => {
        globalStreamingState.messageId = messageId;
        globalStreamingState.content = content;
        globalStreamingState.isStreaming = true;
      },
      onStreamingEnd: () => {
        globalStreamingState.isStreaming = false;
      },
    });
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [status, setStatus] = useState<'ready' | 'submitted' | 'streaming'>(
    'ready',
  );
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const sendMessage = useCallback(
    async (message: ChatMessage) => {
      let currentMessages: ChatMessage[] = [];
      setMessages((prevMessages) => {
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

            // Refresh sidebar after title generation and chat creation
            mutate(
              unstable_serialize(createChatHistoryPaginationKeyGetter(userId)),
            );
          } finally {
            setIsCreatingChat(false);
          }
        }

        await saveMessages({
          messages: [
            {
              id: message.id,
              role: message.role,
              parts: message.parts,
              createdAt: new Date(),
              chatId: id,
            },
          ],
        });
      } catch (error) {
        toast({
          type: 'error',
          description: 'Error saving message',
        });
        setStatus('ready');
        return; // Early return if we can't save the message
      }

      setStatus('streaming');

      try {
        // Create abort controller for this request
        const controller = new AbortController();
        setAbortController(controller);

        // First, try to make the API call - don't create assistant message until we know it will work
        const assistantMessageId = uuidv4();
        const stream = await vllmTransport.sendMessages({
          trigger: 'submit-message',
          chatId: id,
          messageId: assistantMessageId,
          messages: currentMessages,
          abortSignal: controller.signal,
        });

        // Only create the assistant message after successful API call
        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          role: 'assistant',
          parts: [{ type: 'text', text: '' }],
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Initialize streaming state
        globalStreamingState.messageId = assistantMessageId;
        globalStreamingState.content = '';
        globalStreamingState.isStreaming = true;

        const reader = stream.getReader();
        let accumulatedContent = '';
        let lastUpdateTime = 0;
        const UPDATE_THROTTLE = 1; // Adjust this value to control the update frequency

        while (true) {
          // Check if request was aborted
          if (controller.signal.aborted) {
            sonnerToast.info('Response was stopped by user');
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          if (value.type === 'text-delta') {
            // @ts-ignore
            accumulatedContent += value.textDelta || '';
            globalStreamingState.content = accumulatedContent;

            // Throttle UI updates for smoother streaming
            const now = Date.now();
            if (now - lastUpdateTime > UPDATE_THROTTLE) {
              setMessages((current) =>
                current.map((msg) =>
                  msg.id === assistantMessageId
                    ? {
                        ...msg,
                        parts: [{ type: 'text', text: accumulatedContent }],
                      }
                    : msg,
                ),
              );
              lastUpdateTime = now;
            }
          }
        }

        // Final update to ensure all content is displayed
        setMessages((current) =>
          current.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, parts: [{ type: 'text', text: accumulatedContent }] }
              : msg,
          ),
        );

        globalStreamingState.isStreaming = false;
        setStatus('ready');
        setAbortController(null);

        await saveMessages({
          messages: [
            {
              id: assistantMessageId,
              role: 'assistant',
              parts: [{ type: 'text', text: accumulatedContent }],
              createdAt: new Date(),
              chatId: id,
            },
          ],
        });

        mutate(
          unstable_serialize(createChatHistoryPaginationKeyGetter(userId)),
        );
      } catch (error) {
        setStatus('ready');
        globalStreamingState.isStreaming = false;
        setAbortController(null);

        // Handle aborted requests gracefully
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.log('Error caught in chat component:', error);

        if (error instanceof ChatSDKError) {
          console.log(
            'ChatSDKError detected:',
            error.type,
            error.surface,
            error.message,
          );

          // Create an assistant message with the error (marked as error with special prefix)
          const errorMessageId = uuidv4();
          const errorMessage: ChatMessage = {
            id: errorMessageId,
            role: 'assistant',
            parts: [
              {
                type: 'text',
                text: `[ERROR_MESSAGE] **Service Error**\n\n${error.message}\n\n**What you can do:**\n\n- Check your model configuration\n- Try again in a few moments\n- [Contact us](/contact) if the issue persists\n\nWe apologize for the inconvenience and are here to help resolve this issue.`,
              },
            ],
          };

          // Add the error message to the chat
          setMessages((prev) => [...prev, errorMessage]);

          // Save the error message to the database
          try {
            await saveMessages({
              messages: [
                {
                  id: errorMessageId,
                  role: 'assistant',
                  parts: errorMessage.parts,
                  createdAt: new Date(),
                  chatId: id,
                },
              ],
            });
          } catch (saveError) {
            console.error('Failed to save error message:', saveError);
          }

          // Also show toast for immediate feedback
          toast({
            type: 'error',
            description: error.message,
          });
        } else {
          // Handle other errors
          console.log('Generic error:', error);

          // Create a generic error message
          const errorMessageId = uuidv4();
          const errorMessage: ChatMessage = {
            id: errorMessageId,
            role: 'assistant',
            parts: [
              {
                type: 'text',
                text: `[ERROR_MESSAGE] **Connection Error**\n\nFailed to send your message. This may be due to a temporary connectivity issue.\n\n**What you can do:**\n\n- Check your internet connection\n- Verify your model configuration\n- Try sending your message again\n- [Contact us](/contact) if the issue persists\n\nWe apologize for the inconvenience and are here to help resolve this issue.`,
              },
            ],
          };

          // Add the error message to the chat
          setMessages((prev) => [...prev, errorMessage]);

          toast({
            type: 'error',
            description: 'Failed to send message. Please try again.',
          });
        }
      }
    },
    [id, userId, isCreatingChat, vllmTransport, mutate],
  );

  const stop = useCallback(() => {
    // Abort the ongoing request if there's one
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }

    setStatus('ready');
    globalStreamingState.isStreaming = false;
  }, [abortController]);

  // Custom function to trigger AI response without saving user message (for edit functionality)
  const triggerAIResponse = useCallback(
    async (messages: ChatMessage[]) => {
      setStatus('streaming');

      try {
        // Create abort controller for this request
        const controller = new AbortController();
        setAbortController(controller);

        // Create assistant message
        const assistantMessageId = uuidv4();
        const stream = await vllmTransport.sendMessages({
          trigger: 'submit-message',
          chatId: id,
          messageId: assistantMessageId,
          messages: messages,
          abortSignal: controller.signal,
        });

        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          role: 'assistant',
          parts: [{ type: 'text', text: '' }],
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Initialize streaming state
        globalStreamingState.messageId = assistantMessageId;
        globalStreamingState.content = '';
        globalStreamingState.isStreaming = true;

        const reader = stream.getReader();
        let accumulatedContent = '';
        let lastUpdateTime = 0;
        const UPDATE_THROTTLE = 1;

        while (true) {
          if (controller.signal.aborted) {
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          if (value.type === 'text-delta' && value.textDelta) {
            accumulatedContent += value.textDelta;

            const now = Date.now();
            if (now - lastUpdateTime >= UPDATE_THROTTLE) {
              setMessages((prev) => {
                const newMessages = [...prev];
                const assistantIndex = newMessages.findIndex(
                  (msg) => msg.id === assistantMessageId,
                );
                if (assistantIndex !== -1) {
                  newMessages[assistantIndex] = {
                    ...newMessages[assistantIndex],
                    parts: [{ type: 'text', text: accumulatedContent }],
                  };
                }
                return newMessages;
              });
              lastUpdateTime = now;
            }
          }
        }

        // Final update
        setMessages((prev) => {
          const newMessages = [...prev];
          const assistantIndex = newMessages.findIndex(
            (msg) => msg.id === assistantMessageId,
          );
          if (assistantIndex !== -1) {
            newMessages[assistantIndex] = {
              ...newMessages[assistantIndex],
              parts: [{ type: 'text', text: accumulatedContent }],
            };
          }
          return newMessages;
        });

        // Save the assistant message to database
        await saveMessages({
          messages: [
            {
              id: assistantMessageId,
              role: 'assistant',
              parts: [{ type: 'text', text: accumulatedContent }],
              createdAt: new Date(),
              chatId: id,
            },
          ],
        });

        setStatus('ready');
        globalStreamingState.isStreaming = false;
      } catch (error) {
        console.error('Failed to get AI response:', error);
        setStatus('ready');
        globalStreamingState.isStreaming = false;
      }
    },
    [id, vllmTransport],
  );

  // Custom function to replace a specific AI response in place (for edit functionality)
  const replaceAIResponse = useCallback(
    async (messages: ChatMessage[], targetIndex: number) => {
      setStatus('streaming');

      try {
        // Create abort controller for this request
        const controller = new AbortController();
        setAbortController(controller);

        // Create assistant message
        const assistantMessageId = uuidv4();
        const stream = await vllmTransport.sendMessages({
          trigger: 'submit-message',
          chatId: id,
          messageId: assistantMessageId,
          messages: messages,
          abortSignal: controller.signal,
        });

        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          role: 'assistant',
          parts: [{ type: 'text', text: '' }],
        };

        // Insert the new AI response at the specific target index
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages.splice(targetIndex, 0, assistantMessage);
          return newMessages;
        });

        // Initialize streaming state
        globalStreamingState.messageId = assistantMessageId;
        globalStreamingState.content = '';
        globalStreamingState.isStreaming = true;

        const reader = stream.getReader();
        let accumulatedContent = '';
        let lastUpdateTime = 0;
        const UPDATE_THROTTLE = 1;

        while (true) {
          if (controller.signal.aborted) {
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          if (value.type === 'text-delta' && value.textDelta) {
            accumulatedContent += value.textDelta;

            const now = Date.now();
            if (now - lastUpdateTime >= UPDATE_THROTTLE) {
              setMessages((prev) => {
                const newMessages = [...prev];
                const assistantIndex = newMessages.findIndex(
                  (msg) => msg.id === assistantMessageId,
                );
                if (assistantIndex !== -1) {
                  newMessages[assistantIndex] = {
                    ...newMessages[assistantIndex],
                    parts: [{ type: 'text', text: accumulatedContent }],
                  };
                }
                return newMessages;
              });
              lastUpdateTime = now;
            }
          }
        }

        // Final update
        setMessages((prev) => {
          const newMessages = [...prev];
          const assistantIndex = newMessages.findIndex(
            (msg) => msg.id === assistantMessageId,
          );
          if (assistantIndex !== -1) {
            newMessages[assistantIndex] = {
              ...newMessages[assistantIndex],
              parts: [{ type: 'text', text: accumulatedContent }],
            };
          }
          return newMessages;
        });

        // Save the assistant message to database
        await saveMessages({
          messages: [
            {
              id: assistantMessageId,
              role: 'assistant',
              parts: [{ type: 'text', text: accumulatedContent }],
              createdAt: new Date(),
              chatId: id,
            },
          ],
        });

        setStatus('ready');
        globalStreamingState.isStreaming = false;
      } catch (error) {
        console.error('Failed to get AI response:', error);
        setStatus('ready');
        globalStreamingState.isStreaming = false;
      }
    },
    [id, vllmTransport],
  );

  const regenerate = () => {
    setMessages((currentMessages) => {
      if (currentMessages.length >= 2) {
        const lastUserMessage = currentMessages[currentMessages.length - 2];
        if (lastUserMessage.role === 'user') {
          // Remove the last message and send the user message again
          const newMessages = currentMessages.slice(0, -1);
          setTimeout(() => {
            sendMessage(lastUserMessage);
          }, 0);
          return newMessages;
        }
      }
      return currentMessages;
    });
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
      <div className='flex flex-col min-w-0 h-dvh bg-background'>
        <ChatHeader isReadonly={isReadonly} />

        <Messages
          chatId={id}
          status={status}
          messages={messages}
          setMessages={setMessages}
          // @ts-ignore
          regenerate={regenerate}
          isReadonly={isReadonly}
          isArtifactVisible={false}
          sendMessage={sendMessage}
          triggerAIResponse={triggerAIResponse}
          replaceAIResponse={replaceAIResponse}
        />

        <form className='flex mx-auto px-4 bg-background pb-1 md:pb-2 gap-2 w-full md:max-w-3xl'>
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
        <div className='mx-auto px-4 pb-1 md:pb-2 bg-background w-full md:max-w-3xl text-xs text-muted-foreground text-center space-y-1'>
          <p>
            AI model and website are hosted locally at Dalhousie University •
            All chat history is stored in your browser
          </p>
        </div>
      </div>
    </>
  );
}
