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

export type User = z.infer<typeof UserSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type DBMessage = z.infer<typeof MessageSchema>;

export interface OpenLLMDatabase extends Dexie {
  chat: EntityTable<Chat, 'id'>;
  message: EntityTable<DBMessage, 'id'>;
  user: EntityTable<User, 'id'>;
}

export const db = new Dexie('openllm-db') as OpenLLMDatabase;

db.version(1).stores({
  chat: '&id, title, createdAt, userId',
  message: '&id, chatId, role, createdAt, parts',
  user: '&id',
});
