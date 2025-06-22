
import React from 'react';
import LLMProvidersContent from './LLMProvidersContent';
import { useToast } from '@/hooks/use-toast';

const LLMProviders = () => {
  const { toast } = useToast();

  const handleLock = () => {
    // Implement actual locking functionality
    console.log(`Locking provider for exclusive use`);
    toast({
      title: "Provider Locked",
      description: "Provider has been locked for exclusive use.",
    });
  };

  return <LLMProvidersContent onLock={handleLock} />;
};

export default LLMProviders;
