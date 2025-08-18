import { generateText, type UIMessage } from 'ai';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  deleteChatById,
} from '@/lib/db/queries';
import { myProvider } from '@/gen-ai/providers';

// Promise cache to prevent duplicate concurrent title generation for the same message
const titlePromiseCache = new Map<string, Promise<string>>();

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  console.log("generateTitleFromUserMessage called for message ID:", message.id);
  
  // Check if we already have a promise for this message ID
  if (titlePromiseCache.has(message.id)) {
    console.log("Returning existing promise for message ID:", message.id);
    return await titlePromiseCache.get(message.id)!;
  }
  
  // Create and cache the promise
  const titlePromise = generateTitleInternal(message);
  titlePromiseCache.set(message.id, titlePromise);
  
  try {
    const result = await titlePromise;
    console.log("Generated title:", result, "for message ID:", message.id);
    
    // Clean up the promise cache after successful completion
    setTimeout(() => titlePromiseCache.delete(message.id), 5000);
    
    return result;
  } catch (error) {
    // Remove failed promise from cache immediately
    titlePromiseCache.delete(message.id);
    throw error;
  }
}

async function generateTitleInternal(message: UIMessage): Promise<string> {

  const { text: title } = await generateText({
    model: myProvider.languageModel('title-model'),
    system: `\n
    You are a title generator. Read the user's message and create a short title (2-12 words) that summarizes their question or topic. Respond with ONLY the title text - no JSON, no formatting, no explanations, no quotes.`,
    prompt: JSON.stringify(message),
  });

  // Fallback to "Untitled" if no title is generated from the title model
  return title || "Untitled";
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

export async function saveChatModelAsCookie(model: string) {
  // max-age=31536000 is 365 days (1 year)
  document.cookie = `chat-model=${model}; path=/; max-age=31536000;`;
}
