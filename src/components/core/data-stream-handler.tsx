import { useEffect, useRef } from 'react';
import { useDataStream } from './data-stream-provider';

export function DataStreamHandler() {
  const { dataStream } = useDataStream();

  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    newDeltas.forEach((delta) => {

      switch (delta.type) {
        case 'data-id':
          return {
            documentId: delta.data,
            status: 'streaming',
          };

        case 'data-title':
          return {
            title: delta.data,
            status: 'streaming',
          };

        case 'data-clear':
          return {
            content: '',
            status: 'streaming',
          };

        case 'data-finish':
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