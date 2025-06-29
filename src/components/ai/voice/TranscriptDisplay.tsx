
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      {transcript ? (
        <div className="text-sm">
          <p className="whitespace-pre-wrap">{transcript}</p>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>Transcript will appear here during conversation</p>
        </div>
      )}
    </ScrollArea>
  );
};

export default TranscriptDisplay;
