import { getChatsByUserId } from "@/lib/db/queries";
import { ChatSDKError } from '@/lib/errors';

export interface GetChatHistoryWithPaginationParams {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}

export async function getChatHistoryWithPagination({
  id,
  limit,
  startingAfter,
  endingBefore,
}: GetChatHistoryWithPaginationParams) {
  const limitNumber = limit || 10;

  if (startingAfter && endingBefore) {
    return new ChatSDKError('bad_request:history', 'Invalid search parameters');
  }

  const chats = await getChatsByUserId({
    id,
    limit: limitNumber,
    startingAfter,
    endingBefore,
  });

  return chats;
}
