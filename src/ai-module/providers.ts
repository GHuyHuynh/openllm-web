import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_REASONING_MODEL,
  vllm,
} from '@/ai-module/models';

export const myProvider = customProvider({
  languageModels: {
    'chat-model': vllm(DEFAULT_CHAT_MODEL),
    'chat-model-reasoning': wrapLanguageModel({
      model: vllm(DEFAULT_REASONING_MODEL),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
  },
});
