
import React from 'react';
import LLMProvidersContent from './LLMProvidersContent';
import { useToast } from '@/hooks/use-toast';

const LLMProviders = () => {
  const { toast } = useToast();

  const handleLock = (providerId: string) => {
    // Implement actual locking functionality
    console.log(`Locking provider: ${providerId}`);
    toast({
      title: "Provider Locked",
      description: `${providerId} has been locked for exclusive use.`,
    });
  };

  return <LLMProvidersContent onLock={handleLock} />;
};

export default LLMProviders;
