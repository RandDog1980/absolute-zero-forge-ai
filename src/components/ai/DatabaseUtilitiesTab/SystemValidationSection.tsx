
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Monitor,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AutoConfigurationService } from '@/services/supabase/AutoConfigurationService';
import { SupabaseSystemValidator } from '@/services/supabase/SupabaseSystemValidator';

const SystemValidationSection = () => {
  const { toast } = useToast();
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [configStatus, setConfigStatus] = useState<'idle' | 'success' | 'warning' | 'error'>('idle');
  const [validationResults, setValidationResults] = useState<any>(null);

  const runAutoConfiguration = async () => {
    setIsConfiguring(true);
    setConfigStatus('idle');
    
    try {
      toast({
        title: "Auto-Configuration Started",
        description: "Setting up all Supabase components automatically...",
      });

      const result = await AutoConfigurationService.runAutoConfiguration();
      
      if (result.status === 'healthy') {
        setConfigStatus('success');
        toast({
          title: "Configuration Complete",
          description: "All Supabase components configured successfully!",
        });
      } else if (result.status === 'warning') {
        setConfigStatus('warning');
        toast({
          title: "Configuration Complete with Warnings",
          description: result.message,
        });
      } else {
        setConfigStatus('error');
        toast({
          title: "Configuration Issues Detected",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setConfigStatus('error');
      toast({
        title: "Auto-Configuration Failed",
        description: `Configuration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  const runCompleteValidation = async () => {
    setIsValidating(true);
    
    try {
      toast({
        title: "System Validation Started",
        description: "Running comprehensive system validation (up to 5 retry attempts)...",
      });

      const validator = new SupabaseSystemValidator();
      const results = await validator.runCompleteSystemValidation();
      
      setValidationResults(results);
      
      if (results.overall === 'healthy') {
        toast({
          title: "Validation Complete - All Systems Healthy",
          description: "All components passed validation tests!",
        });
      } else if (results.overall === 'warning') {
        toast({
          title: "Validation Complete - Warnings Detected",
          description: `${results.results.filter(r => r.status === 'warning').length} components need attention`,
        });
      } else {
        toast({
          title: "Validation Complete - Critical Issues Found",
          description: `${results.results.filter(r => r.status === 'fail').length} critical failures detected`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: `System validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Settings className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automatic Configuration
            {configStatus !== 'idle' && (
              <Badge className={getStatusColor(configStatus)}>
                {configStatus.toUpperCase()}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Automatically configure all Supabase components and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <ul className="space-y-1">
              <li>• Database connection setup</li>
              <li>• Authentication configuration</li>
              <li>• Edge functions deployment</li>
              <li>• Storage bucket creation</li>
            </ul>
            <ul className="space-y-1">
              <li>• Real-time features setup</li>
              <li>• RLS policy validation</li>
              <li>• Performance optimization</li>
              <li>• Health monitoring setup</li>
            </ul>
          </div>
          <Button
            onClick={runAutoConfiguration}
            disabled={isConfiguring}
            className="w-full"
          >
            {isConfiguring ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Configuring...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run Auto-Configuration
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Complete System Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Complete System Validation
          </CardTitle>
          <CardDescription>
            Comprehensive testing with automatic retry (up to 5 attempts)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <ul className="space-y-1">
              <li>• Database connection testing</li>
              <li>• CRUD operation validation</li>
              <li>• Authentication flow testing</li>
              <li>• Edge function execution</li>
            </ul>
            <ul className="space-y-1">
              <li>• Real-time feature testing</li>
              <li>• Performance benchmarking</li>
              <li>• Security policy validation</li>
              <li>• Integration testing</li>
            </ul>
          </div>
          <Button
            onClick={runCompleteValidation}
            disabled={isValidating}
            variant="outline"
            className="w-full"
          >
            {isValidating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Validation...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Complete Validation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Validation Results Summary */}
      {validationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Validation Results</span>
              <Badge className={getStatusColor(validationResults.overall)}>
                {validationResults.overall.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">{validationResults.summary}</p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {validationResults.results.filter(r => r.status === 'pass').length}
                </div>
                <div className="text-sm text-green-700">Passed</div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {validationResults.results.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-yellow-700">Warnings</div>
              </div>
              
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {validationResults.results.filter(r => r.status === 'fail').length}
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
            </div>

            {validationResults.retryCount > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ℹ️ Validation completed after {validationResults.retryCount} retry attempt(s)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemValidationSection;
