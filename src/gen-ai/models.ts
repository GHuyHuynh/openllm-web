import { createOllama } from 'ollama-ai-provider';
import { OLLAMA_BASE_URL } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';

export const DEFAULT_CHAT_MODEL: string = 'smollm2:135m';
export const DEFAULT_TITLE_MODEL: string = 'smollm2:135m';
export const DEFAULT_REASONING_MODEL: string = 'deepseek-r1:1.5b';

export const ollama = createOllama({
  baseURL: `${OLLAMA_BASE_URL}/api`,
});


export interface ChatModel {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

interface OllamaTagsResponse {
  models: OllamaModel[];
}

async function fetchModels(): Promise<Array<ChatModel>> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);

  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }

  const data: OllamaTagsResponse = await response.json();
  
  return data.models.map((model): ChatModel => ({
    id: model.name,
    name: model.name,
    description: `${model.details.parameter_size} ${model.details.family} model (${model.details.quantization_level})`,
    tags: model.details.families || [model.details.family],
  }));
}

export function useListModels() {
  return useQuery({
    queryKey: ['list-models'],
    queryFn: fetchModels,
  });
}
