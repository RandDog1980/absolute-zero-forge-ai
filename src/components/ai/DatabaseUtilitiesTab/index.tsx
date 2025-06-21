
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import ConfigurationSections from './ConfigurationSections';
import CommonIssues from './CommonIssues';
import ProductionChecklist from './ProductionChecklist';
import ExpertAssistant from './ExpertAssistant';

const DatabaseUtilitiesTab = () => {
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
          <ConfigurationSections />
        </CardContent>
      </Card>

      <CommonIssues />
      <ProductionChecklist />
      <ExpertAssistant />
    </div>
  );
};

export default DatabaseUtilitiesTab;
