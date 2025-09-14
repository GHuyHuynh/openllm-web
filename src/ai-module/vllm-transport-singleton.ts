import { VLLMChatTransport } from '@/ai-module/vllm-transport';
import {
  VLLM_BASE_URL,
  DEFAULT_TITLE_MODEL,
  VLLM_API_KEY,
} from '@/constants/constants';

// Shared transport instance for title generation
let titleTransport: VLLMChatTransport | null = null;

export function getTitleTransport(): VLLMChatTransport {
  if (!titleTransport) {
    titleTransport = new VLLMChatTransport({
      baseUrl: VLLM_BASE_URL,
      model: DEFAULT_TITLE_MODEL,
      apiKey: VLLM_API_KEY,
    });
  }
  return titleTransport;
}
