import Dexie, { type EntityTable } from 'dexie';
import { z } from 'zod';

const uuidSchema = z.string().uuid();
const createdAtSchema = z.date();

const UserSchema = z.object({
  id: uuidSchema,
});

const ChatSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  createdAt: createdAtSchema,
  userId: uuidSchema,
});

const MessageSchema = z.object({
  id: uuidSchema,
  chatId: uuidSchema,
  role: z.string().nonempty(),
  createdAt: createdAtSchema,
  parts: z.unknown(),
});

const StreamSchema = z.object({
  id: uuidSchema,
  chatId: uuidSchema,
  createdAt: createdAtSchema,
});

export type User = z.infer<typeof UserSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type DBMessage = z.infer<typeof MessageSchema>;
export type Stream = z.infer<typeof StreamSchema>;

export interface DalAIDatabase extends Dexie {
  chat: EntityTable<Chat, 'id'>;
  message: EntityTable<DBMessage, 'id'>;
  user: EntityTable<User, 'id'>;
  stream: EntityTable<Stream, 'id'>;
}

export const db = new Dexie('dal-ai-db') as DalAIDatabase;

db.version(1).stores({
  chats: '&id, title, createdAt, userId',
  messages: '&id, chatId, role, createdAt, parts',
  users: '&id',
  streams: '&id, chatId, createdAt',
});
