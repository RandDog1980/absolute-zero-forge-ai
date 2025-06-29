
import React from 'react';
import { Mic, Volume2 } from 'lucide-react';

interface AudioStatusDisplayProps {
  isRecording: boolean;
  isSpeaking: boolean;
}

const AudioStatusDisplay: React.FC<AudioStatusDisplayProps> = ({
  isRecording,
  isSpeaking
}) => {
  return (
    <div className="flex items-center justify-center gap-8">
      <div className="flex flex-col items-center">
        <div className={`p-4 rounded-full ${
          isRecording 
            ? 'bg-red-100 text-red-600 animate-pulse' 
            : 'bg-gray-100 text-gray-400'
        }`}>
          <Mic className="h-8 w-8" />
        </div>
        <span className="text-sm mt-2">
          {isRecording ? 'Recording' : 'Microphone'}
        </span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className={`p-4 rounded-full ${
          isSpeaking 
            ? 'bg-blue-100 text-blue-600 animate-pulse' 
            : 'bg-gray-100 text-gray-400'
        }`}>
          <Volume2 className="h-8 w-8" />
        </div>
        <span className="text-sm mt-2">
          {isSpeaking ? 'AI Speaking' : 'Audio Output'}
        </span>
      </div>
    </div>
  );
};

export default AudioStatusDisplay;
