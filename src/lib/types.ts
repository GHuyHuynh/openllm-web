import { z } from 'zod';
import type { UIMessage } from 'ai';

export type DataPart = { type: 'append-message'; message: string };

export type ChatTools = {};

const textPartSchema = z.object({
  type: z.enum(['text']),
  text: z.string().min(1).max(2000),
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

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  appendMessage: string;
  id: string;
  title: string;
  clear: null;
  finish: null;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  message: z.object({
    id: z.string().uuid(),
    role: z.enum(['user']),
    parts: z.array(textPartSchema),
  }),
  selectedChatModel: z.enum(['chat-model', 'chat-model-reasoning']),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
