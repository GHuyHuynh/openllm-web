import { createOllama } from 'ollama-ai-provider';
import { OLLAMA_BASE_URL, DEFAULT_OLLAMA_MODEL } from '@/constants/constants';

const ollama = createOllama({
  baseURL: OLLAMA_BASE_URL,
});

export const defaultModel = ollama(DEFAULT_OLLAMA_MODEL);