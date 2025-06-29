
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Absolute0AIDiagnostics } from './utils/diagnostics';

const SystemStatusIndicator = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const results = await Absolute0AIDiagnostics.runFullDiagnostic();
      setDiagnostics(results);
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (success: boolean) => {
    if (success) {
      return <Badge className="bg-green-100 text-green-800">✅ Ready</Badge>;
    }
    return <Badge variant="destructive">❌ Error</Badge>;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Status</span>
          <Button
            onClick={runDiagnostics}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {diagnostics ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(diagnostics.overall)}
                <span className="font-medium">Overall Status</span>
              </div>
              {getStatusBadge(diagnostics.overall)}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.supabase.success)}
                  <span>Supabase Connection</span>
                </div>
                <span className={diagnostics.supabase.success ? 'text-green-600' : 'text-red-600'}>
                  {diagnostics.supabase.message}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.realtimeChat.success)}
                  <span>Voice Chat Function</span>
                </div>
                <span className={diagnostics.realtimeChat.success ? 'text-green-600' : 'text-red-600'}>
                  {diagnostics.realtimeChat.message}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.apiKey.success)}
                  <span>OpenAI API Key</span>
                </div>
                <span className={diagnostics.apiKey.success ? 'text-green-600' : 'text-red-600'}>
                  {diagnostics.apiKey.message}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span>Running diagnostics...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusIndicator;
