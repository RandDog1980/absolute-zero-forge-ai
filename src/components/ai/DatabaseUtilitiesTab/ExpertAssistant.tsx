
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ExpertAssistant = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expert Configuration Assistant</CardTitle>
        <CardDescription>
          Get help from DataMaster Chen, our Supabase specialist AI agent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
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
      </CardContent>
    </Card>
  );
};

export default ExpertAssistant;
