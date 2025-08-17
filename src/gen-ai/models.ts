import { VLLM_BASE_URL } from '@/constants/constants';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const DEFAULT_CHAT_MODEL: string = 'gemma3:270m';
export const DEFAULT_TITLE_MODEL: string = 'gemma3:270m-it-qat';
export const DEFAULT_REASONING_MODEL: string = 'deepseek-r1:1.5b';

export const vllm = createOpenAICompatible({
  name: 'vllm',
  baseURL: `${VLLM_BASE_URL}/v1`,
});

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];
