import { Button } from '@/components/ui/button';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Textarea } from '@/components/ui/textarea';
import { updateMessage, saveMessages } from '@/lib/db/queries';
import { db } from '@/lib/db/schema';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/types';
import { getTextFromMessage } from '@/lib/utils';
import { VLLMChatTransport } from '@/ai-module/vllm-transport';
import { VLLM_BASE_URL, DEFAULT_VLLM_MODEL } from '@/constants/constants';

export type MessageEditorProps = {
  message: ChatMessage;
  setMode: Dispatch<SetStateAction<'view' | 'edit'>>;
  setMessages: UseChatHelpers<ChatMessage>['setMessages'];
  regenerate: UseChatHelpers<ChatMessage>['regenerate'];
  sendMessage?: (message: ChatMessage) => void;
  triggerAIResponse?: (messages: ChatMessage[]) => Promise<void>;
  replaceAIResponse?: (
    messages: ChatMessage[],
    targetIndex: number,
  ) => Promise<void>;
  chatId: string;
};

export function MessageEditor({
  message,
  setMode,
  setMessages,
  regenerate,
  sendMessage,
  triggerAIResponse,
  replaceAIResponse,
  chatId,
}: MessageEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Create transport instance
  const vllmTransport = useMemo(() => {
    return new VLLMChatTransport({
      baseUrl: VLLM_BASE_URL,
      model: DEFAULT_VLLM_MODEL,
    });
  }, []);

  const [draftContent, setDraftContent] = useState<string>(
    getTextFromMessage(message),
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftContent(event.target.value);
    adjustHeight();
  };

  return (
    <div className='flex flex-col gap-2 w-full'>
      <Textarea
        data-testid='message-editor'
        ref={textareaRef}
        className='bg-transparent outline-none overflow-hidden resize-none !text-base rounded-xl w-full'
        value={draftContent}
        onChange={handleInput}
      />

      <div className='flex flex-row gap-2 justify-end'>
        <Button
          variant='outline'
          className='h-fit py-2 px-3'
          onClick={() => {
            setMode('view');
          }}
        >
          Cancel
        </Button>
        <Button
          data-testid='message-editor-send-button'
          variant='default'
          className='h-fit py-2 px-3'
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true);

            try {
              const updatedMessage: ChatMessage = {
                ...message,
                parts: [{ type: 'text', text: draftContent }],
              };

              // Update the message in the database
              await updateMessage({
                id: message.id,
                parts: updatedMessage.parts,
              });

              // Update only the current message in state, keep all others unchanged
              setMessages((messages) => {
                const index = messages.findIndex((m) => m.id === message.id);
                if (index !== -1) {
                  const newMessages = [...messages];
                  newMessages[index] = updatedMessage;
                  return newMessages;
                }
                return messages;
              });

              setMode('view');

              // Simple approach: find and replace the AI response in place
              setMessages((currentMessages) => {
                const userIndex = currentMessages.findIndex(
                  (m) => m.id === message.id,
                );
                const aiIndex = userIndex + 1;

                // Check if there's an AI response right after this user message
                if (
                  userIndex !== -1 &&
                  aiIndex < currentMessages.length &&
                  currentMessages[aiIndex].role === 'assistant'
                ) {
                  const oldAIId = currentMessages[aiIndex].id;

                  // Delete the old AI response from database
                  db.message.delete(oldAIId).catch((error) => {
                    console.error('Failed to delete old AI response:', error);
                  });

                  // Create new AI response with new ID
                  const newAIMessage: ChatMessage = {
                    id: `ai-${Date.now()}-${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                    role: 'assistant',
                    parts: [{ type: 'text', text: 'Thinking...' }],
                  };

                  // Replace the AI response at the exact same index
                  const newMessages = [...currentMessages];
                  newMessages[aiIndex] = newAIMessage;

                  // Start generating the AI response
                  setTimeout(async () => {
                    try {
                      const stream = await vllmTransport.sendMessages({
                        trigger: 'submit-message',
                        chatId: chatId,
                        messageId: newAIMessage.id,
                        messages: currentMessages.slice(0, userIndex + 1),
                        abortSignal: new AbortController().signal,
                      });

                      const reader = stream.getReader();
                      let accumulatedContent = '';

                      while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        if (value.type === 'text-delta' && value.textDelta) {
                          accumulatedContent += value.textDelta;

                          // Update the message in place
                          setMessages((prev) => {
                            const updated = [...prev];
                            const targetIndex = updated.findIndex(
                              (m) => m.id === newAIMessage.id,
                            );
                            if (targetIndex !== -1) {
                              updated[targetIndex] = {
                                ...updated[targetIndex],
                                parts: [
                                  { type: 'text', text: accumulatedContent },
                                ],
                              };
                            }
                            return updated;
                          });
                        }
                      }

                      // Save final response to database
                      await saveMessages({
                        messages: [
                          {
                            id: newAIMessage.id,
                            role: 'assistant',
                            parts: [{ type: 'text', text: accumulatedContent }],
                            createdAt: new Date(),
                            chatId: chatId,
                          },
                        ],
                      });
                    } catch (error) {
                      console.error('Failed to generate AI response:', error);
                      // Revert to error message
                      setMessages((prev) => {
                        const updated = [...prev];
                        const targetIndex = updated.findIndex(
                          (m) => m.id === newAIMessage.id,
                        );
                        if (targetIndex !== -1) {
                          updated[targetIndex] = {
                            ...updated[targetIndex],
                            parts: [
                              {
                                type: 'text',
                                text: 'Failed to generate response. Please try again.',
                              },
                            ],
                          };
                        }
                        return updated;
                      });
                    }
                  }, 100);

                  return newMessages;
                }

                return currentMessages;
              });
            } catch (error) {
              console.error('Failed to update message:', error);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
