
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ExpertAssistant = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStartChat = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to chat with DataMaster Chen.",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement the actual chat functionality
    // For now, we'll show a placeholder message
    toast({
      title: "Chat with DataMaster Chen",
      description: "Starting conversation with our Supabase expert...",
    });
    
    console.log("Opening chat with DataMaster Chen");
    // This could redirect to a chat interface or open a modal
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Expert Configuration Assistant
        </CardTitle>
        <CardDescription>
          Get help from DataMaster Chen, our Supabase specialist AI agent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          DataMaster Chen is trained on the complete Supabase configuration manual and can help you with:
        </p>
        <div className="grid gap-2 md:grid-cols-2 text-sm">
          <ul className="space-y-1">
            <li>• End-to-end setup guidance</li>
            <li>• Database architecture design</li>
            <li>• Connection testing and validation</li>
            <li>• Performance optimization</li>
          </ul>
          <ul className="space-y-1">
            <li>• Automated troubleshooting</li>
            <li>• Security configuration</li>
            <li>• Real-time feature setup</li>
            <li>• Production deployment guidance</li>
          </ul>
        </div>
        <Button 
          onClick={handleStartChat}
          className="w-full"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Start Chat with DataMaster Chen
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExpertAssistant;
