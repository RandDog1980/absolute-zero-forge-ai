
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Settings, Shield, Zap, Monitor, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SupabaseConfigService } from '../../../services/supabase/SupabaseConfigService';
import SystemValidationSection from './SystemValidationSection';

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
        description: `${stepId.replace('-', ' ')} has been configured successfully.`,
      });
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: `Failed to configure ${stepId.replace('-', ' ')}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [stepId]: false }));
    }
  };

  const handleHealthCheck = async () => {
    setLoadingStates(prev => ({ ...prev, 'health-check': true }));
    
    try {
      const result = await SupabaseConfigService.runFullHealthCheck();
      toast({
        title: "Health Check Complete",
        description: result.message,
        variant: result.status === 'error' ? 'destructive' : 'default',
      });
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, 'health-check': false }));
    }
  };

  const sections = [
    {
      id: 'initial-setup',
      icon: <Database className="h-5 w-5" />,
      title: "Initial Setup",
      description: "Verify Supabase connection and basic configuration",
      steps: [
        "Test database connection",
        "Validate project credentials",
        "Verify table structure",
        "Check basic permissions"
      ],
      action: () => SupabaseConfigService.performInitialSetup()
    },
    {
      id: 'database-config',
      icon: <Settings className="h-5 w-5" />,
      title: "Database Configuration",
      description: "Test database tables and access permissions",
      steps: [
        "Test profiles table access",
        "Test AI agents table access",
        "Verify RLS policies",
        "Check table relationships"
      ],
      action: () => SupabaseConfigService.configureDatabaseSettings()
    },
    {
      id: 'auth-setup',
      icon: <Shield className="h-5 w-5" />,
      title: "Authentication Setup",
      description: "Verify authentication service functionality",
      steps: [
        "Test auth service connection",
        "Verify session management",
        "Check user registration flow",
        "Test login/logout functions"
      ],
      action: () => SupabaseConfigService.configureAuthentication()
    },
    {
      id: 'edge-functions',
      icon: <Zap className="h-5 w-5" />,
      title: "Edge Functions",
      description: "Test serverless function connectivity",
      steps: [
        "Test config-check function",
        "Verify function deployment",
        "Check environment secrets",
        "Test function responses"
      ],
      action: () => SupabaseConfigService.configureEdgeFunctions()
    },
    {
      id: 'monitoring',
      icon: <Monitor className="h-5 w-5" />,
      title: "Monitoring & Health",
      description: "Set up health monitoring and performance checks",
      steps: [
        "Test database response times",
        "Verify health check functions",
        "Set up performance monitoring",
        "Configure alert thresholds"
      ],
      action: () => SupabaseConfigService.configureMonitoring()
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Components</TabsTrigger>
          <TabsTrigger value="comprehensive">Comprehensive Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
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
                    disabled={loadingStates[section.id]}
                    className="w-full"
                    variant={completedSteps[section.id] ? "outline" : "default"}
                  >
                    {loadingStates[section.id] ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                System Health Check
              </CardTitle>
              <CardDescription>
                Run a comprehensive health check of all Supabase services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleHealthCheck}
                disabled={loadingStates['health-check']}
                className="w-full"
              >
                {loadingStates['health-check'] ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Health Check...
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4 mr-2" />
                    Run Complete Health Check
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comprehensive">
          <SystemValidationSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationSections;
