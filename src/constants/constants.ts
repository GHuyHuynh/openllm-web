// Intentionally expose API URL on the client side. For full transparency and open source.
export const VLLM_BASE_URL = 'https://api.openllm-platform.com/';
export const DEFAULT_VLLM_MODEL = 'meta-llama/Llama-3.2-1B-Instruct';
export const DEFAULT_TITLE_MODEL = 'meta-llama/Llama-3.2-1B-Instruct';
export const VLLM_API_KEY = import.meta.env.VITE_VLLM_API_KEY;

function calculateBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;

    const userPathMatch = pathname.match(/^(\/~[^\/]+\/[^\/]+)/);
    if (userPathMatch) {
      return userPathMatch[1];
    }

    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      return '';
    }
  }

  return '/~huyh/openllm';
}

export const BASE_URL = calculateBaseUrl();
