import type { UIMessage } from '@ai-sdk/react';
import type { UIMessageChunk, ChatRequestOptions, ChatTransport } from 'ai-latest';

/**
 * Custom chat transport for vllm backend that implements the ChatTransport interface.
 * This allows useChat to work directly with vllm's OpenAI-compatible API.
 */
export class VLLMChatTransport implements ChatTransport<UIMessage> {
  private baseUrl: string;
  private model: string;
  private defaultHeaders: Record<string, string>;

  constructor(options: {
    baseUrl: string;
    model: string;
    apiKey?: string;
    headers?: Record<string, string>;
  }) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
    this.model = options.model;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(options.apiKey && { 'Authorization': `Bearer ${options.apiKey}` }),
      ...options.headers,
    };
  }

  async sendMessages(options: {
    trigger: 'submit-message' | 'regenerate-message';
    chatId: string;
    messageId: string | undefined;
    messages: UIMessage[];
    abortSignal: AbortSignal | undefined;
  } & ChatRequestOptions): Promise<ReadableStream<UIMessageChunk>> {
    
    // Convert UI messages to OpenAI format
    const openAIMessages = this.convertToOpenAIMessages(options.messages);
    
    // Prepare the request body for vllm
    const requestBody = {
      model: this.model,
      messages: openAIMessages,
      stream: true,
      ...options.body, // Allow additional body parameters
    };

    // Merge headers
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    try {
      // Make request to vllm backend
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: options.abortSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      // Convert the SSE stream to UIMessageChunk stream
      return this.convertSSEToUIMessageStream(response.body, options.abortSignal);
      
    } catch (error) {
      // Return an error stream
      return this.createErrorStream(error as Error);
    }
  }

  async reconnectToStream(options: {
    chatId: string;
  } & ChatRequestOptions): Promise<ReadableStream<UIMessageChunk> | null> {
    // vllm doesn't typically support reconnecting to streams
    // Return null to indicate no active stream to reconnect to
    return null;
  }

  /**
   * Convert UI messages to OpenAI-compatible message format
   */
  private convertToOpenAIMessages(messages: UIMessage[]) {
    return messages.map(message => {
      // Combine all text parts into a single content string
      const content = message.parts
        .filter(part => part.type === 'text')
        .map(part => (part as any).text)
        .join('');

      return {
        role: message.role,
        content,
      };
    });
  }

  /**
   * Convert Server-Sent Events stream to UIMessageChunk stream
   */
  private convertSSEToUIMessageStream(
    responseBody: ReadableStream<Uint8Array>,
    abortSignal?: AbortSignal
  ): ReadableStream<UIMessageChunk> {
    const messageId = this.generateId();
    let hasStarted = false;

    return new ReadableStream<UIMessageChunk>({
      async start(controller) {
        const reader = responseBody.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.trim() === '') continue;
              
              if (line.startsWith('data: ')) {
                const data = line.slice(6); // Remove 'data: ' prefix
                
                if (data === '[DONE]') {
                  // End the text stream
                  controller.enqueue({
                    type: 'text-end',
                    id: messageId,
                  });
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta;
                  
                  if (delta?.content) {
                    // Send text-start if this is the first chunk
                    if (!hasStarted) {
                      controller.enqueue({
                        type: 'text-start',
                        id: messageId,
                      });
                      hasStarted = true;
                    }

                    // Send text delta
                    controller.enqueue({
                      type: 'text-delta',
                      id: messageId,
                      delta: delta.content,
                    });
                  }
                } catch (parseError) {
                  // Skip invalid JSON lines
                  continue;
                }
              }
            }

            // Check if request was aborted
            if (abortSignal?.aborted) {
              controller.close();
              return;
            }
          }
          
          // If we reach here without seeing [DONE], close gracefully
          if (hasStarted) {
            controller.enqueue({
              type: 'text-end',
              id: messageId,
            });
          }
          controller.close();
          
        } catch (error) {
          controller.enqueue({
            type: 'error',
            errorText: (error as Error).message,
          });
          controller.close();
        } finally {
          reader.releaseLock();
        }
      },
    });
  }

  /**
   * Create an error stream for handling failures
   */
  private createErrorStream(error: Error): ReadableStream<UIMessageChunk> {
    return new ReadableStream<UIMessageChunk>({
      start(controller) {
        controller.enqueue({
          type: 'error',
          errorText: error.message,
        });
        controller.close();
      },
    });
  }

  /**
   * Generate a unique ID for messages
   */
  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}