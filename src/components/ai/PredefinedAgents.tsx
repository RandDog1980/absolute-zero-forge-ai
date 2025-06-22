
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { predefinedAgents } from './data';
import AgentCard from './components/AgentCard';
import { PredefinedAgent } from './types/PredefinedAgent';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PredefinedAgents = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<PredefinedAgent | null>(null);
  const [loadingAgent, setLoadingAgent] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Ensure predefinedAgents is always an array
  const agentsArray = Array.isArray(predefinedAgents) ? predefinedAgents : [];

  const categories = [
    { id: 'all', label: 'All Agents', count: agentsArray.length },
    { id: 'popular', label: 'Popular', count: agentsArray.filter(agent => agent.popular).length },
    { id: 'technical', label: 'Technical', count: agentsArray.filter(agent => agent.category === 'technical').length },
    { id: 'creative', label: 'Creative', count: agentsArray.filter(agent => agent.category === 'creative').length },
    { id: 'business', label: 'Business', count: agentsArray.filter(agent => agent.category === 'business').length },
    { id: 'support', label: 'Support', count: agentsArray.filter(agent => agent.category === 'support').length },
    { id: 'database', label: 'Database', count: agentsArray.filter(agent => agent.category === 'database').length }
  ];

  const filteredAgents = selectedCategory === 'all' 
    ? agentsArray
    : selectedCategory === 'popular'
    ? agentsArray.filter(agent => agent.popular)
    : agentsArray.filter(agent => agent.category === selectedCategory);

  const handleAgentSelect = (agent: PredefinedAgent) => {
    setSelectedAgent(agent);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleStartConversation = async (agent: PredefinedAgent) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a conversation with an AI agent.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAgent(agent.id);
    
    try {
      // Create or activate the agent in the database
      const { data: existingAgent, error: fetchError } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id)
        .eq('name', agent.name)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingAgent) {
        // Create new agent instance
        const { error: createError } = await supabase
          .from('ai_agents')
          .insert({
            user_id: user.id,
            name: agent.name,
            description: agent.description,
            type: agent.category,
            status: 'active',
            configuration: {
              personality: agent.personality,
              capabilities: agent.capabilities,
              avatar: agent.avatar
            },
            specialization: agent.category === 'technical' ? 'development' : 'design'
          });

        if (createError) {
          throw createError;
        }
      } else {
        // Activate existing agent
        const { error: updateError } = await sulabase
          .from('ai_agents')
          .update({ status: 'active' })
          .eq('id', existingAgent.id);

        if (updateError) {
          throw updateError;
        }
      }

      toast({
        title: "Agent Activated",
        description: `${agent.name} is now ready to assist you!`,
      });

      // Here you could redirect to a chat interface or open a chat modal
      console.log(`Starting conversation with ${agent.name}`);
      
    } catch (error) {
      toast({
        title: "Failed to Start Conversation",
        description: `Could not activate ${agent.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoadingAgent(null);
    }
  };

  const handleViewDetails = (agent: PredefinedAgent) => {
    // Open agent details modal or navigate to agent details page
    console.log(`Viewing details for ${agent.name}`);
    toast({
      title: "Agent Details",
      description: `Viewing detailed information for ${agent.name}`,
    });
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
                  selected={selectedAgent?.id === agent.id}
                  onSelect={() => handleAgentSelect(agent)}
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
              <Button 
                onClick={() => handleStartConversation(selectedAgent)}
                disabled={loadingAgent === selectedAgent.id}
              >
                {loadingAgent === selectedAgent.id ? 'Activating...' : 'Start Conversation'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleViewDetails(selectedAgent)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredefinedAgents;
