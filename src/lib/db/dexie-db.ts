import Dexie, { type EntityTable } from 'dexie';
import { z } from 'zod';

const ChatSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  createdAt: z.date(),
  userId: z.string().uuid(),
});

type Chat = z.infer<typeof ChatSchema>;

export interface DalAIDatabase extends Dexie {
  chats: EntityTable<Chat, 'id'>;
}

const db = new Dexie('dal-ai-db') as DalAIDatabase;

db.version(1).stores({
  chats: '&id, title, createdAt, userId',
});

export { db, type Chat };
