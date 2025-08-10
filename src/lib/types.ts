import { z } from 'zod';

export type DataPart = { type: 'append-message'; message: string };

const textPartSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.enum(['text']),
});

export const chatRequestBodySchema = z.object({
  id: z.string().uuid(),
  message: z.object({
    id: z.string().uuid(),
    createdAt: z.coerce.date(),
    role: z.enum(['user']),
    content: z.string().min(1).max(2000),
    parts: z.array(textPartSchema),
  }),
  selectedChatModel: z.enum(['chat-model', 'chat-model-reasoning']),
});

export type ChatRequestBody = z.infer<typeof chatRequestBodySchema>;