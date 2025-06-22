
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Settings, Shield, Zap, Monitor, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SupabaseConfigService } from '../../../services/supabase/SupabaseConfigService';

const ConfigurationSections = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleConfigStep = async (stepId: string, configFunction: () => Promise<void>) => {
    setLoadingStates(prev => ({ ...prev, [stepId]: true }));
    
    try {
      await configFunction();
      setCompletedSteps(prev => ({ ...prev, [stepId]: true }));
      toast({
        title: "Configuration Successful",
        description: `${stepId} has been configured successfully.`,
      });
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: `Failed to configure ${stepId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [stepId]: false }));
    }
  };

  const sections = [
    {
      id: 'initial-setup',
      icon: <Database className="h-5 w-5" />,
      title: "Initial Setup",
      description: "Get started with Supabase configuration",
      steps: [
        "Create Supabase account and project",
        "Get project credentials (URL, keys)",
        "Set up database extensions",
        "Create initial table structure"
      ],
      action: () => SupabaseConfigService.performInitialSetup()
    },
    {
      id: 'database-config',
      icon: <Settings className="h-5 w-5" />,
      title: "Database Configuration",
      description: "Core database setup and migrations",
      steps: [
        "Access SQL Editor",
        "Run initial migrations",
        "Enable required extensions",
        "Set up real-time publications"
      ],
      action: () => SupabaseConfigService.configureDatabaseSettings()
    },
    {
      id: 'auth-setup',
      icon: <Shield className="h-5 w-5" />,
      title: "Authentication Setup",
      description: "Configure auth providers and security",
      steps: [
        "Configure auth settings",
        "Set up OAuth providers",
        "Configure URL redirects",
        "Set up user roles system"
      ],
      action: () => SupabaseConfigService.configureAuthentication()
    },
    {
      id: 'edge-functions',
      icon: <Zap className="h-5 w-5" />,
      title: "Edge Functions",
      description: "Deploy and configure serverless functions",
      steps: [
        "Enable Edge Functions",
        "Set up environment secrets",
        "Deploy platform functions",
        "Configure webhooks"
      ],
      action: () => SupabaseConfigService.configureEdgeFunctions()
    },
    {
      id: 'monitoring',
      icon: <Monitor className="h-5 w-5" />,
      title: "Monitoring & Health",
      description: "Set up monitoring and health checks",
      steps: [
        "Configure database monitoring",
        "Set up alerts and notifications",
        "Test health check functions",
        "Performance optimization"
      ],
      action: () => SupabaseConfigService.configureMonitoring()
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <Card key={section.id} className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {section.icon}
              {section.title}
              {completedSteps[section.id] && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
            <CardDescription className="text-sm">
              {section.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex items-start gap-2 text-sm">
                  <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleConfigStep(section.id, section.action)}
              disabled={loadingStates[section.id] || completedSteps[section.id]}
              className="w-full"
              variant={completedSteps[section.id] ? "outline" : "default"}
            >
              {loadingStates[section.id] ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                  Configuring...
                </>
              ) : completedSteps[section.id] ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Configured
                </>
              ) : (
                `Configure ${section.title}`
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConfigurationSections;
