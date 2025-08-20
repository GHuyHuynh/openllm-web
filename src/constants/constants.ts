export const VLLM_BASE_URL = 'http://129.173.22.43:30001';
export const DEFAULT_VLLM_MODEL = 'meta-llama/Llama-3.2-1B-Instruct';
export const DEFAULT_TITLE_MODEL = 'meta-llama/Llama-3.2-1B-Instruct';

function calculateBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    
    const userPathMatch = pathname.match(/^(\/~[^\/]+\/[^\/]+)/);
    if (userPathMatch) {
      return userPathMatch[1];
    }
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '';
    }
  }
  
  return '/~huyh/dalchat';
}

export const BASE_URL = calculateBaseUrl();