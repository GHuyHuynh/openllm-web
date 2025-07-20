import { streamModelResponse } from '@/gen-ai/stream';
import { useEffect, useState } from 'react';
import { ModelSelector } from '@/components/shared/model-selector';
import { MultimodalInput } from '@/components/shared/multimodal-input';
import { Chat } from '../chat/chat';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function Base() {
  const [text, setText] = useState('');

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
    <>
    <SidebarProvider defaultOpen={true}>
        <SidebarInset>
          <Chat
            id={'1'}
            initialMessages={[]}
            initialChatModel={'deepseek-r1'}
            isReadonly={false}
            autoResume={true}
          />
        </SidebarInset>
      </SidebarProvider>
      
    </>
  )
}