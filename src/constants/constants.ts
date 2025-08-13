export const VLLM_BASE_URL = 'http://localhost:11434';
export const DEFAULT_VLLM_MODEL = 'smollm2:135m';

export const BASE_URL = import.meta.env.BASE_URL;

if (BASE_URL === '' || BASE_URL === '/' || BASE_URL === undefined || BASE_URL === null) {
  throw new Error('BASE_URL is not set');
}