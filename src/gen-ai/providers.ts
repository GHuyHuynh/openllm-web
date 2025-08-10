import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_REASONING_MODEL,
  DEFAULT_TITLE_MODEL,
  ollama,
} from '@/gen-ai/models';

export const myProvider = customProvider({
  languageModels: {
    'chat-model': ollama(DEFAULT_CHAT_MODEL),
    'chat-model-reasoning': wrapLanguageModel({
      model: ollama(DEFAULT_REASONING_MODEL),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': ollama(DEFAULT_TITLE_MODEL),
  },
});
