import { 
  getMessageById,
  deleteMessagesByChatIdAfterTimestamp
} from "@/lib/db/queries";
import { ChatSDKError } from "../errors";

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });
  if (!message) {
    throw new ChatSDKError('bad_request:database', 'Message not found');
  }
  
  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}
