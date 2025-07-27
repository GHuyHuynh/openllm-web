export const ollamaServerUrl = import.meta.env.VITE_OLLAMA_SERVER_URL;

if (!ollamaServerUrl) {
  throw new Error('OLLAMA_SERVER_URL is not set');
}