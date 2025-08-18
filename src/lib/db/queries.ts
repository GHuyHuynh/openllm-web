import { ChatSDKError } from '@/lib/errors';
import { db, type Chat, type DBMessage } from '@/lib/db/schema';

export async function createUser({ id }: { id: string }) {
  try {
    return await db.user.add({ id });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to create user');
  }
}

export async function getUserById({ id }: { id: string }) {
  try {
    return await db.user.get(id);
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get user by id');
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.chat.add({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
  } catch (error) {
    // If the chat already exists, that's okay - just return success
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ConstraintError') {
      return; // Chat already exists, which is fine
    }
    console.error('Database error in saveChat:', error);
    throw new ChatSDKError('bad_request:database', `Failed to save chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const selectedChat = await db.chat.get(id);
    if (!selectedChat) {
      return null;
    }
    return selectedChat;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get chat by id');
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    const returnMessage = await db.message.where('id').equals(id).toArray();
    return returnMessage;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get message by id',
    );
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      // Find the reference chat for cursor
      const selectedChat = await db.chat.get(startingAfter);

      if (!selectedChat) {
        throw new ChatSDKError(
          'not_found:database',
          `Chat with id ${startingAfter} not found`,
        );
      }

      // Get chats created after the reference chat
      filteredChats = await db.chat
        .where('userId')
        .equals(id)
        .and(chat => chat.createdAt > selectedChat.createdAt)
        .reverse() // For descending order by createdAt
        .limit(extendedLimit)
        .toArray();
    } else if (endingBefore) {
      // Find the reference chat for cursor
      const selectedChat = await db.chat.get(endingBefore);

      if (!selectedChat) {
        throw new ChatSDKError(
          'not_found:database',
          `Chat with id ${endingBefore} not found`,
        );
      }

      // Get chats created before the reference chat
      filteredChats = await db.chat
        .where('userId')
        .equals(id)
        .and(chat => chat.createdAt < selectedChat.createdAt)
        .reverse() // For descending order by createdAt
        .limit(extendedLimit)
        .toArray();
    } else {
      // Get all chats for the user
      filteredChats = await db.chat
        .where('userId')
        .equals(id)
        .reverse() // For descending order by createdAt
        .limit(extendedLimit)
        .toArray();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get chats by user id',
    );
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    return await db.message.bulkAdd(messages);
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save messages');
  }
}

export async function getMessagesByChatId({
  id,
}: {
  id: string;
}) {
  try {
    const messages = await db.message.orderBy('createdAt').filter(msg => msg.chatId === id).toArray();
    return messages;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get messages by chat id');
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.chat.delete(id);
    await db.message.where('chatId').equals(id).delete();
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to delete chat by id');
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db.message
      .where('chatId')
      .equals(chatId)
      .and(message => message.createdAt >= timestamp)
      .toArray();

    const messageIds = messagesToDelete.map(message => message.id);

    if (messageIds.length > 0) {
      return await db.message
        .where('chatId')
        .equals(chatId)
        .and(message => messageIds.includes(message.id))
        .delete();
    }
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to delete messages by chat id after timestamp');
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { 
  id: string; differenceInHours: number 
}) {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000,
    );

    const userChats = await db.chat
      .where('userId')
      .equals(id)
      .toArray();
    
    const userChatIds = userChats.map(chat => chat.id);

    if (userChatIds.length === 0) {
      return 0;
    }

    const messageCount = await db.message
      .where('role')
      .equals('user')
      .and(message => 
        message.createdAt >= twentyFourHoursAgo && 
        userChatIds.includes(message.chatId)
      )
      .count();

    return messageCount;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get message count by user id');
  }
}

// export async function createStreamId({
//   streamId,
//   chatId,
// }: {
//   streamId: string;
//   chatId: string;
// }) {
//   try {
//     return await db.stream.add({
//       id: streamId,
//       chatId,
//       createdAt: new Date(),
//     });
//   } catch (error) {
//     throw new ChatSDKError('bad_request:database', 'Failed to create stream id');
//   }
// }

// export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
//   try {
//     const streamIds = await db.stream.where('chatId').equals(chatId).toArray();
//     const returnStreamIds = streamIds.map(stream => stream.id);
//     return returnStreamIds;
//   } catch (error) {
//     throw new ChatSDKError('bad_request:database', 'Failed to get stream ids by chat id');
//   }
// }
