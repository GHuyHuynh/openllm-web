import { z } from 'zod/v4';
import {
  type ProviderMetadata,
} from 'ai';
import type {
  InferUIMessageData,
  InferUIMessageMetadata,
  UIMessage,
} from 'ai';
import { type providerMetadataSchema } from '@/lib/ui-message-types/provider-metadata';


export const uiMessageChunkSchema = z.union([
  z.strictObject({
    type: z.literal('text-start'),
    id: z.string(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('text-delta'),
    id: z.string(),
    delta: z.string(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('text-end'),
    id: z.string(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('error'),
    errorText: z.string(),
  }),
  z.strictObject({
    type: z.literal('reasoning'),
    text: z.string(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('reasoning-start'),
    id: z.string(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('reasoning-delta'),
    id: z.string(),
    delta: z.string(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('reasoning-end'),
    id: z.string(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('reasoning-part-finish'),
  }),
  z.strictObject({
    type: z.literal('source-url'),
    sourceId: z.string(),
    url: z.string(),
    title: z.string().optional(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('source-document'),
    sourceId: z.string(),
    mediaType: z.string(),
    title: z.string(),
    filename: z.string().optional(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.literal('file'),
    url: z.string(),
    mediaType: z.string(),
    providerMetadata: providerMetadataSchema.optional(),
  }),
  z.strictObject({
    type: z.string().startsWith('data-'),
    id: z.string().optional(),
    data: z.unknown(),
    transient: z.boolean().optional(),
  }),
  z.strictObject({
    type: z.literal('start-step'),
  }),
  z.strictObject({
    type: z.literal('finish-step'),
  }),
  z.strictObject({
    type: z.literal('start'),
    messageId: z.string().optional(),
    messageMetadata: z.unknown().optional(),
  }),
  z.strictObject({
    type: z.literal('finish'),
    messageMetadata: z.unknown().optional(),
  }),
  z.strictObject({
    type: z.literal('abort'),
  }),
  z.strictObject({
    type: z.literal('message-metadata'),
    messageMetadata: z.unknown(),
  }),
]);


export type UIMessageChunk<
  METADATA = unknown,
> =
  | {
      type: 'text-start';
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'text-delta';
      delta: string;
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'text-end';
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'reasoning-start';
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'reasoning-delta';
      id: string;
      delta: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'reasoning-end';
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'error';
      errorText: string;
    }
  | {
      type: 'start-step';
    }
  | {
      type: 'finish-step';
    }
  | {
      type: 'start';
      messageId?: string;
      messageMetadata?: METADATA;
    }
  | {
      type: 'finish';
      messageMetadata?: METADATA;
    }
  | {
      type: 'abort';
    }
  | {
      type: 'message-metadata';
      messageMetadata: METADATA;
    };

export type InferUIMessageChunk<T extends UIMessage> = UIMessageChunk<
  InferUIMessageMetadata<T>,
  InferUIMessageData<T>
>;