import { streamText } from 'ai';
import { ollama } from '@/gen-ai/models';
import { DEFAULT_CHAT_MODEL } from '@/gen-ai/models';

export async function streamModelResponse(prompt: string) {
  const result = streamText({
    model: ollama(DEFAULT_CHAT_MODEL),
    prompt: prompt,
  });

  return result;
}