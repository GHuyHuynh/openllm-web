import { type UIMessage } from 'ai';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  deleteChatById,
} from '@/lib/db/queries';
import { getTitleTransport } from '@/ai-module/vllm-transport-singleton';
import { v4 as uuidv4 } from 'uuid';
import { deleteAllUserData } from '@/lib/db/queries';

// Promise cache to prevent duplicate concurrent title generation for the same message
const titlePromiseCache = new Map<string, Promise<string>>();

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  if (titlePromiseCache.has(message.id)) {
    return await titlePromiseCache.get(message.id)!;
  }
  
  // Create and cache the promise
  const titlePromise = generateTitleInternal(message);
  titlePromiseCache.set(message.id, titlePromise);
  
  try {
    const result = await titlePromise;
    
    // Clean up the promise cache after successful completion
    setTimeout(() => titlePromiseCache.delete(message.id), 5000);
    
    return result;
  } catch (error) {
    // Remove failed promise from cache immediately
    titlePromiseCache.delete(message.id);
    return "Untitled";
  }
}

async function generateTitleInternal(message: UIMessage): Promise<string> {
  try {
    const transport = getTitleTransport();
    
    // Create a system message and user message for title generation
    const titleMessages = [
      {
        id: uuidv4(),
        role: 'system' as const,
        parts: [{ 
          type: 'text' as const, 
          text: 'You are a title generator. Read the user\'s message and create a short title (2-8 words) that summarizes their question or topic. Respond with ONLY the title text - no JSON, no formatting, no explanations, no quotes.' 
        }],
      },
      {
        id: uuidv4(),
        role: 'user' as const,
        parts: [{ 
          type: 'text' as const, 
          text: `Generate a title for this message: ${JSON.stringify(message.parts.filter(p => p.type === 'text').map(p => (p as any).text).join(''))}` 
        }],
      }
    ];

    const stream = await transport.sendMessages({
      trigger: 'submit-message',
      chatId: 'title-generation',
      messageId: uuidv4(),
      messages: titleMessages,
      abortSignal: undefined,
    });

    const reader = stream.getReader();
    let title = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      if (value.type === 'text-delta') {
        title += (value as any).textDelta || '';
      }
    }

    // Clean up the title and fallback to "Untitled" if empty
    const cleanTitle = title.trim().replace(/^["']|["']$/g, ''); // Remove quotes
    return cleanTitle || "Untitled";
  } catch (error) {
    return "Untitled";
  }
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function deleteChatAction({ id }: { id: string }) {
  await deleteChatById({ id });
}

export async function deleteAllUserDataAction({ userId }: { userId: string }) {
  await deleteAllUserData({ userId });
}

export async function saveChatModelAsCookie(model: string) {
  // max-age=31536000 is 365 days (1 year)
  document.cookie = `chat-model=${model}; path=/; max-age=31536000;`;
}
