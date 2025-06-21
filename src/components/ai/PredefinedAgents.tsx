
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { predefinedAgents } from './data';
import AgentCard from './components/AgentCard';
import { PredefinedAgent } from './types/PredefinedAgent';

const PredefinedAgents = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<PredefinedAgent | null>(null);

  const categories = [
    { id: 'all', label: 'All Agents', count: predefinedAgents.length },
    { id: 'popular', label: 'Popular', count: predefinedAgents.filter(agent => agent.popular).length },
    { id: 'technical', label: 'Technical', count: predefinedAgents.filter(agent => agent.category === 'technical').length },
    { id: 'creative', label: 'Creative', count: predefinedAgents.filter(agent => agent.category === 'creative').length },
    { id: 'business', label: 'Business', count: predefinedAgents.filter(agent => agent.category === 'business').length },
    { id: 'support', label: 'Support', count: predefinedAgents.filter(agent => agent.category === 'support').length },
    { id: 'database', label: 'Database', count: predefinedAgents.filter(agent => agent.category === 'database').length }
  ];

  const filteredAgents = selectedCategory === 'all' 
    ? predefinedAgents
    : selectedCategory === 'popular'
    ? predefinedAgents.filter(agent => agent.popular)
    : predefinedAgents.filter(agent => agent.category === selectedCategory);

  const handleAgentSelect = (agent: PredefinedAgent) => {
    setSelectedAgent(agent);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Agents</h2>
          <p className="text-muted-foreground">Choose from our collection of specialized AI agents</p>
        </div>
        <Badge variant="secondary">{filteredAgents.length} agents</Badge>
      </div>

      <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onSelect={handleAgentSelect}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedAgent && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedAgent.avatar}</span>
              {selectedAgent.name}
              {selectedAgent.popular && <Badge>Popular</Badge>}
            </CardTitle>
            <CardDescription>
              {selectedAgent.age} • {selectedAgent.gender} • {selectedAgent.personality}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{selectedAgent.description}</p>
            
            <div>
              <h4 className="font-medium mb-2">Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.capabilities.map((capability, index) => (
                  <Badge key={index} variant="outline">{capability}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Use Cases</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {selectedAgent.useCases.map((useCase, index) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button>Start Conversation</Button>
              <Button variant="outline">View Details</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredefinedAgents;
