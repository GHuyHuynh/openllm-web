import { generateText, type UIMessage } from 'ai';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  deleteChatById,
} from '@/lib/db/queries';
import { myProvider } from '@/gen-ai/providers';

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {

  console.log("This called");

  const { text: title } = await generateText({
    model: myProvider.languageModel('title-model'),
    system: `\n
    You are a title generator. Read the user's message and create a short title (2-12 words) that summarizes their question or topic. Respond with ONLY the title text - no JSON, no formatting, no explanations, no quotes.`,
    prompt: JSON.stringify(message),
  });

  // Fallback to "Untitled" if no title is generated from the title model
  if (!title) {
    return "Untitled";
  }

  return title;
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
