
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

interface VoiceControlsProps {
  isConnected: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
  onConnect: () => void;
  onDisconnect: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isConnected,
  connectionStatus,
  onConnect,
  onDisconnect
}) => {
  if (!isConnected && connectionStatus !== 'connecting') {
    return (
      <Button 
        onClick={onConnect}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        <Phone className="h-5 w-5 mr-2" />
        Start Voice Chat
      </Button>
    );
  }

  if (connectionStatus === 'connecting') {
    return (
      <Button 
        disabled
        className="bg-yellow-600 text-white"
        size="lg"
      >
        <Mic className="h-5 w-5 mr-2 animate-pulse" />
        Connecting...
      </Button>
    );
  }

  return (
    <Button 
      onClick={onDisconnect}
      variant="destructive"
      size="lg"
    >
      <PhoneOff className="h-5 w-5 mr-2" />
      End Voice Chat
    </Button>
  );
};

export default VoiceControls;
