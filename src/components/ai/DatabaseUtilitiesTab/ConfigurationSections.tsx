
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Settings, Shield, Zap, Monitor } from 'lucide-react';

const ConfigurationSections = () => {
  const sections = [
    {
      icon: <Database className="h-5 w-5" />,
      title: "Initial Setup",
      description: "Get started with Supabase configuration",
      steps: [
        "Create Supabase account and project",
        "Get project credentials (URL, keys)",
        "Set up database extensions",
        "Create initial table structure"
      ]
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Database Configuration",
      description: "Core database setup and migrations",
      steps: [
        "Access SQL Editor",
        "Run initial migrations",
        "Enable required extensions",
        "Set up real-time publications"
      ]
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Authentication Setup",
      description: "Configure auth providers and security",
      steps: [
        "Configure auth settings",
        "Set up OAuth providers",
        "Configure URL redirects",
        "Set up user roles system"
      ]
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Edge Functions",
      description: "Deploy and configure serverless functions",
      steps: [
        "Enable Edge Functions",
        "Set up environment secrets",
        "Deploy platform functions",
        "Configure webhooks"
      ]
    },
    {
      icon: <Monitor className="h-5 w-5" />,
      title: "Monitoring & Health",
      description: "Set up monitoring and health checks",
      steps: [
        "Configure database monitoring",
        "Set up alerts and notifications",
        "Test health check functions",
        "Performance optimization"
      ]
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section, index) => (
        <Card key={index} className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {section.icon}
              {section.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {section.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex items-start gap-2 text-sm">
                  <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConfigurationSections;
