
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PredefinedAgents from '@/components/ai/PredefinedAgents';
import AgentCreator from '@/components/ai/AgentCreator';
import AgentList from '@/components/ai/AgentList';
import ConversationMemory from '@/components/ai/ConversationMemory';
import VoiceInterface from '@/components/ai/VoiceInterface';
import SupabaseSetupAssistant from '@/components/ai/SupabaseSetupAssistant';
import DatabaseUtilitiesTab from '@/components/ai/DatabaseUtilitiesTab';

const AIEngine = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        <SidebarInset>
          <Header />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">AI Engine</h1>
                <p className="text-muted-foreground mt-2">
                  Create, manage, and interact with AI agents
                </p>
              </div>

              <Tabs defaultValue="predefined" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="predefined">Agents</TabsTrigger>
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="manage">Manage</TabsTrigger>
                  <TabsTrigger value="memory">Memory</TabsTrigger>
                  <TabsTrigger value="voice">Voice</TabsTrigger>
                  <TabsTrigger value="setup">Setup</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                </TabsList>

                <TabsContent value="predefined" className="mt-6">
                  <PredefinedAgents />
                </TabsContent>

                <TabsContent value="create" className="mt-6">
                  <AgentCreator />
                </TabsContent>

                <TabsContent value="manage" className="mt-6">
                  <AgentList />
                </TabsContent>

                <TabsContent value="memory" className="mt-6">
                  <ConversationMemory />
                </TabsContent>

                <TabsContent value="voice" className="mt-6">
                  <VoiceInterface />
                </TabsContent>

                <TabsContent value="setup" className="mt-6">
                  <SupabaseSetupAssistant />
                </TabsContent>

                <TabsContent value="database" className="mt-6">
                  <DatabaseUtilitiesTab />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AIEngine;
