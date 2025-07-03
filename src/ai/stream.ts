import { streamText } from 'ai';
import { defaultModel } from '@/ai/models';

export async function streamModelResponse(prompt: string) {
  const result = streamText({
    model: defaultModel,
    prompt: prompt,
  });

  return result;
}