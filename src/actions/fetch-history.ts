import type { ChatHistory } from "@/components/core/sidebar-history";
import { getChatsByUserId } from "@/lib/db/queries";
import { ChatSDKError } from '@/lib/errors';

export interface GetChatHistoryWithPaginationParams {
  userId: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}

async function getChatHistoryWithPagination({
  userId,
  limit,
  startingAfter,
  endingBefore,
}: GetChatHistoryWithPaginationParams) {
  const limitNumber = limit || 10;

  if (startingAfter && endingBefore) {
    return new ChatSDKError('bad_request:history', 'Invalid search parameters');
  }

  const chats = await getChatsByUserId({
    id: userId,
    limit: limitNumber,
    startingAfter,
    endingBefore,
  });

  return chats;
}

export const fetchChatHistory = async (params: GetChatHistoryWithPaginationParams): Promise<ChatHistory> => {
  const result = await getChatHistoryWithPagination(params);
  
  if (result instanceof Error) {
    throw new ChatSDKError('bad_request:history', 'Failed to get chat history');
  }
  
  return result;
};

