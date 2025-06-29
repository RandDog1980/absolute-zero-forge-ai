
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';

interface AgentSelectorProps {
  selectedAgent?: any;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ selectedAgent }) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">
              {selectedAgent?.name || 'Absolute-0.AI Assistant'}
            </h3>
            <p className="text-sm text-blue-700">
              {selectedAgent?.description || 'Your AI conversational partner'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentSelector;
