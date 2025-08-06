import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';

export type DataStreamDelta = {
  type:
    | 'text-delta'
    | 'code-delta'
    | 'sheet-delta'
    | 'image-delta'
    | 'title'
    | 'id'
    | 'suggestion'
    | 'clear'
    | 'finish'
    | 'kind';
  content: string;
};

export function DataStreamHandler({ id }: { id: string }) {
  const { data: dataStream } = useChat({ id });
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    (newDeltas as DataStreamDelta[]).forEach((delta: DataStreamDelta) => {

        switch (delta.type) {
          case 'id':
            return {
              documentId: delta.content as string,
              status: 'streaming',
            };

          case 'title':
            return {
              title: delta.content as string,
              status: 'streaming',
            };

          case 'kind':
            return {
              kind: delta.content as string,
              status: 'streaming',
            };

          case 'clear':
            return {
              content: '',
              status: 'streaming',
            };

          case 'finish':
            return {
              status: 'idle',
            };

          default:
            return null;
        }
    });
  }, [dataStream]);

  return null;
}
