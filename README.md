# OpenLLM Web Chat

An open-source, self-hosted, open access LLM chat application, featuring local-first (browser storage) data storage and real-time streaming responses.

https://github.com/user-attachments/assets/8662e4ab-06d3-4fbc-b248-13d98e5dc6a9

## Features

- **Real-time AI Chat**: Stream responses from OpenAI-compatible AI models
- **Local Data Persistence**: All conversations stored locally using IndexedDB
- **Multi-page Navigation**: Home, chat, about, and contact pages
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error recovery with user-friendly messages
- **Message Management**: Edit, regenerate, and manage conversation history

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS v4 with Radix UI components
- **Database**: Dexie (IndexedDB wrapper)
- **AI Integration**: Custom vLLM transport with Vercel AI SDK
- **Routing**: React Router v7

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Configuration

The application connects to OpenLLM Platform API (`https://api.openllm-platform.com/`) and uses `meta-llama/Llama-3.2-1B-Instruct` as the default model for both chat and title generation. The platform API the will route back to Timberlea server via HTTP.

## Developer API Guide

The application includes a comprehensive developer API guide accessible at `/developer` that provides OpenAI-compatible API examples for integrating with the OpenLLM Platform.

### Python Example

```python
# Please install OpenAI SDK first with: pip3 install openai

from openai import OpenAI

client = OpenAI(
    api_key="your-api-key-here",
    base_url="https://api.openllm-platform.com/v1"
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "What is the capital of Nova Scotia?"},
    ],
)

print(response.choices[0].message.content)
```

### Node.js Example

```javascript
// Please install OpenAI SDK first with: npm install openai

import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.openllm-platform.com/v1',
  apiKey: 'your-api-key-here',
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of Nova Scotia?' },
    ],
    model: 'meta-llama/Llama-3.2-1B-Instruct',
  });

  console.log(completion.choices[0].message.content);
}

main();
```

### cURL Example

```bash
curl https://api.openllm-platform.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key-here" \
  -d '{
    "model": "meta-llama/Llama-3.2-1B-Instruct",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "What is the capital of Nova Scotia?"
      }
    ]
  }'
```

All examples use the OpenAI-compatible endpoints and demonstrate API authentication, chat completion requests, and response handling. Visit the developer page in the application to access copy-paste ready code examples with pre-configured API keys and endpoints.

## Deployment

Configured for Dal Server deployment with base URL `/~huyh/openllm` and build output to `openllm/` directory.

## Architecture

- Local-first design with offline capability
- Provider-based state management
- Custom AI transport layer for VLLM compatibility
- Real-time message streaming with abort support

### Data Flow Diagram

```
┌─────────────────┐    HTTP POST      ┌──────────────────────┐
│   User Input    │ ────────────────► │    LLM API Server    │
│   (Chat UI)     │                   │ api.openllm-platform │
└─────────────────┘                   └──────────────────────┘
         │                                       │
         │ User Message                          │ SSE Stream
         ▼                                       ▼
┌─────────────────┐                   ┌──────────────────────┐
│  React State    │◄──── Chunks ──────│  VLLMChatTransport   │
│  (messages[])   │                   │  (Custom Transport)  │
└─────────────────┘                   └──────────────────────┘
         │                                       │
         │ Save Complete                         │ Text Deltas
         ▼                                       ▼
┌─────────────────┐                   ┌──────────────────────┐
│   IndexedDB     │                   │   UI Components      │
│   (Dexie ORM)   │                   │   (Real-time UI)     │
│                 │                   │                      │
│ • Users         │                   │ • Message bubbles    │
│ • Chats         │                   │ • Typing indicators  │
│ • Messages      │                   │ • Stream status      │
└─────────────────┘                   └──────────────────────┘
         │
         │ Persist & Retrieve
         ▼
┌─────────────────┐
│  Browser Store  │
│  (Local First)  │
│                 │
│ • Offline ready │
│ • Fast loading  │
│ • No server DB  │
└─────────────────┘
```

**Flow Explanation:**

1. User types message in chat UI
2. Message sent via custom vLLM transport to API server
3. Server streams response as Server-Sent Events (SSE)
4. Transport converts SSE chunks to UI-compatible format
5. React state updates in real-time with streaming text
6. Complete messages saved to IndexedDB via Dexie
7. UI renders messages with full offline capability
