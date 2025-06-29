
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Download,
  Eye,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SupabaseSystemValidator } from '@/services/supabase/SupabaseSystemValidator';

interface ValidationResult {
  component: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
  recommendations?: string[];
}

interface SystemValidationReport {
  overall: 'healthy' | 'warning' | 'critical';
  summary: string;
  results: ValidationResult[];
  timestamp: string;
  retryCount: number;
}

const SystemValidationDashboard = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [validationReport, setValidationReport] = useState<SystemValidationReport | null>(null);
  const [showErrorReport, setShowErrorReport] = useState(false);
  const [errorReport, setErrorReport] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const validator = new SupabaseSystemValidator();

  const runSystemValidation = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      toast({
        title: "System Validation Started",
        description: "Running comprehensive Supabase system validation...",
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      const report = await validator.runCompleteSystemValidation();
      
      clearInterval(progressInterval);
      setProgress(100);
      setValidationReport(report);

      if (report.overall === 'critical') {
        const extensiveReport = await validator.generateExtensiveErrorReport(report);
        setErrorReport(extensiveReport);
        
        toast({
          title: "Validation Complete - Critical Issues Found",
          description: `${report.results.filter(r => r.status === 'fail').length} critical failures detected. Review the error report.`,
          variant: "destructive",
        });
      } else if (report.overall === 'warning') {
        toast({
          title: "Validation Complete - Warnings Detected",
          description: `${report.results.filter(r => r.status === 'warning').length} warnings found. System is functional but needs optimization.`,
        });
      } else {
        toast({
          title: "Validation Complete - All Systems Healthy",
          description: "All Supabase components are functioning optimally.",
        });
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: `System validation encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const downloadErrorReport = () => {
    const blob = new Blob([errorReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supabase-validation-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-900">System Validation Dashboard</h2>
              <p className="text-blue-700 text-sm mt-1">
                Comprehensive Supabase system validation and testing suite
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              onClick={runSystemValidation}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunning ? 'Running Validation...' : 'Start Complete Validation'}
            </Button>

            {validationReport && (
              <div className="flex gap-2">
                <Badge className={
                  validationReport.overall === 'healthy' ? 'bg-green-100 text-green-800' :
                  validationReport.overall === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {validationReport.overall.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  Last run: {new Date(validationReport.timestamp).toLocaleString()}
                </span>
              </div>
            )}

            {errorReport && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowErrorReport(!showErrorReport)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showErrorReport ? 'Hide' : 'View'} Error Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadErrorReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            )}
          </div>

          {isRunning && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Validation Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Validation Results</span>
              <Badge className={
                validationReport.overall === 'healthy' ? 'bg-green-100 text-green-800' :
                validationReport.overall === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {validationReport.overall.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{validationReport.summary}</p>
            
            {validationReport.retryCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Validation required {validationReport.retryCount} retry attempt(s) to complete
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {validationReport.results.map((result, index) => (
                <Card key={index} className="border-l-4 border-l-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{result.component}</h4>
                      {getStatusIcon(result.status)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{result.message}</p>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </Badge>
                    
                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Recommendations:</p>
                        <ul className="text-xs text-gray-600 ml-2">
                          {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Report */}
      {showErrorReport && errorReport && (
        <Card>
          <CardHeader>
            <CardTitle>Extensive Error Report</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 whitespace-pre-wrap">
              {errorReport}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemValidationDashboard;
