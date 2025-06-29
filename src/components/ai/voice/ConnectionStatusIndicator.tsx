
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface ConnectionStatusIndicatorProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: 'Connected',
          className: 'bg-green-100 text-green-800'
        };
      case 'connecting':
        return {
          icon: <Loader className="h-3 w-3 animate-spin" />,
          text: 'Connecting...',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Error',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Disconnected',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge className={config.className}>
      {config.icon}
      <span className="ml-1">{config.text}</span>
    </Badge>
  );
};

export default ConnectionStatusIndicator;
