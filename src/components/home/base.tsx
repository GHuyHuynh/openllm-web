import { streamModelResponse } from '@/ai/stream';
import { useEffect, useState } from 'react';

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
    <div>
      <h1>Hello World</h1>
      <div className="mt-4 p-4 border rounded-md">
        <h2 className="text-lg font-semibold mb-2">AI Response:</h2>
        <div className="whitespace-pre-wrap">{text}</div>
      </div>
    </div>
  )
}