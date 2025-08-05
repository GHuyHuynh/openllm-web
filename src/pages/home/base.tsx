import { streamModelResponse } from '@/gen-ai/stream';
import { useEffect, useState } from 'react';
// import { ModelSelector } from '@/components/shared/model-selector';
// import { MultimodalInput } from '@/components/shared/multimodal-input';
import { Chat } from '../chat/chat';
import { DEFAULT_CHAT_MODEL } from '@/gen-ai/models';

export function Base() {
  // TODO: Remove this 
  const [_, setText] = useState('');

  useEffect(() => {
    const fetchText = async () => {
      const result = await streamModelResponse('Write a short vegetarian pasta recipe.');

      let accumulatedText = '';
      for await (const textPart of result.textStream) {
        accumulatedText += textPart;
        setText(accumulatedText);
      }
    };

    fetchText();
  }, []);

  return (
    <Chat
      id={'1'}
      initialMessages={[]}
      initialChatModel={DEFAULT_CHAT_MODEL}
      isReadonly={false}
      autoResume={true}
    />
  )
}