
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Settings, Shield, Zap, Monitor, AlertTriangle } from 'lucide-react';

const DatabaseUtilitiesTab = () => {
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

  const commonIssues = [
    {
      issue: "Row-level security policy violations",
      solution: "Ensure user_id columns are not nullable, check RLS policies, verify authentication"
    },
    {
      issue: "Authentication redirects not working",
      solution: "Configure Site URL and Redirect URLs in Authentication → URL Configuration"
    },
    {
      issue: "Edge Functions failing",
      solution: "Check function logs, verify all secrets are set, test functions individually"
    },
    {
      issue: "Real-time features not working",
      solution: "Ensure tables are in supabase_realtime publication with REPLICA IDENTITY FULL"
    },
    {
      issue: "Storage upload failures",
      solution: "Check bucket policies, verify file size limits, ensure proper MIME types"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-indigo-500" />
        <h2 className="text-2xl font-bold">Database Utilities</h2>
        <Badge variant="secondary">Supabase Configuration</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Complete Supabase Configuration Guide
          </CardTitle>
          <CardDescription>
            Comprehensive manual for configuring all Supabase features for the Absolute-0.AI platform
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Common Issues & Solutions
          </CardTitle>
          <CardDescription>
            Quick fixes for frequently encountered Supabase configuration problems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {commonIssues.map((item, index) => (
                <div key={index}>
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Issue: {item.issue}</h4>
                    <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                      <strong>Solution:</strong> {item.solution}
                    </p>
                  </div>
                  {index < commonIssues.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production Deployment Checklist</CardTitle>
          <CardDescription>
            Essential steps before going live with your Supabase configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Pre-Production</h4>
              <ul className="space-y-1 text-sm">
                <li>✓ All database tables with RLS policies</li>
                <li>✓ User registration and login working</li>
                <li>✓ Edge functions deployed and responding</li>
                <li>✓ Real-time features operational</li>
                <li>✓ All secrets and environment variables set</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Post-Deployment</h4>
              <ul className="space-y-1 text-sm">
                <li>✓ Monitor performance metrics regularly</li>
                <li>✓ Set up log aggregation for debugging</li>
                <li>✓ Test disaster recovery procedures</li>
                <li>✓ Enable automated backups</li>
                <li>✓ Configure rate limiting and security</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default DatabaseUtilitiesTab;
