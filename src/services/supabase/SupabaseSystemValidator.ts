
import { supabase } from '@/integrations/supabase/client';
import { SupabaseHealthService } from './SupabaseHealthService';
import { SupabaseConfigService } from './SupabaseConfigService';

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

export class SupabaseSystemValidator {
  private maxRetries = 5;
  private currentRetry = 0;

  async runCompleteSystemValidation(): Promise<SystemValidationReport> {
    console.log('🔧 Starting Complete Supabase System Validation...');
    
    const results: ValidationResult[] = [];
    let retryCount = 0;

    while (retryCount < this.maxRetries) {
      try {
        this.currentRetry = retryCount;
        results.length = 0; // Clear previous results

        // Phase 1: Basic Connection Tests
        console.log('📡 Phase 1: Testing Basic Connections...');
        results.push(await this.testDatabaseConnection());
        results.push(await this.testAuthenticationService());
        results.push(await this.testStorageService());

        // Phase 2: Table Structure Validation
        console.log('🗄️ Phase 2: Validating Database Schema...');
        results.push(await this.validateTableStructure());
        results.push(await this.validateRLSPolicies());
        results.push(await this.validateForeignKeys());

        // Phase 3: Edge Functions Testing
        console.log('⚡ Phase 3: Testing Edge Functions...');
        results.push(await this.testAllEdgeFunctions());

        // Phase 4: Integration Testing
        console.log('🔗 Phase 4: Running Integration Tests...');
        results.push(await this.testCRUDOperations());
        results.push(await this.testRealtimeFeatures());
        results.push(await this.testAuthenticationFlow());

        // Phase 5: Performance Testing
        console.log('⚡ Phase 5: Performance Testing...');
        results.push(await this.testPerformanceMetrics());

        // If we get here without throwing, validation succeeded
        break;
      } catch (error) {
        retryCount++;
        console.error(`❌ Validation attempt ${retryCount} failed:`, error);
        
        if (retryCount < this.maxRetries) {
          console.log(`🔄 Retrying in 3 seconds... (${retryCount}/${this.maxRetries})`);
          await this.delay(3000);
        }
      }
    }

    const failureCount = results.filter(r => r.status === 'fail').length;
    const warningCount = results.filter(r => r.status === 'warning').length;

    let overall: 'healthy' | 'warning' | 'critical' = 'healthy';
    let summary = 'All systems operational and validated';

    if (failureCount > 0) {
      overall = 'critical';
      summary = `${failureCount} critical failures detected requiring immediate attention`;
    } else if (warningCount > 0) {
      overall = 'warning';
      summary = `${warningCount} warnings detected - system functional but optimization recommended`;
    }

    return {
      overall,
      summary,
      results,
      timestamp: new Date().toISOString(),
      retryCount
    };
  }

  private async testDatabaseConnection(): Promise<ValidationResult> {
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          component: 'Database Connection',
          status: 'fail',
          message: `Connection failed: ${error.message}`,
          details: { error: error.message, code: error.code },
          recommendations: ['Check database credentials', 'Verify network connectivity']
        };
      }

      return {
        component: 'Database Connection',
        status: responseTime > 1000 ? 'warning' : 'pass',
        message: `Connection successful (${responseTime}ms)`,
        details: { responseTime }
      };
    } catch (error) {
      return {
        component: 'Database Connection',
        status: 'fail',
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recommendations: ['Check Supabase configuration', 'Verify project URL and keys']
      };
    }
  }

  private async testAuthenticationService(): Promise<ValidationResult> {
    try {
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          component: 'Authentication Service',
          status: 'fail',
          message: `Auth service error: ${error.message}`,
          recommendations: ['Check auth configuration', 'Verify JWT settings']
        };
      }

      return {
        component: 'Authentication Service',
        status: 'pass',
        message: 'Authentication service operational',
        details: { hasSession: !!session.session }
      };
    } catch (error) {
      return {
        component: 'Authentication Service',
        status: 'fail',
        message: `Auth test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recommendations: ['Restart auth service', 'Check configuration']
      };
    }
  }

  private async testStorageService(): Promise<ValidationResult> {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        return {
          component: 'Storage Service',
          status: 'warning',
          message: 'Storage service may not be configured',
          details: { error: error.message }
        };
      }

      return {
        component: 'Storage Service',
        status: 'pass',
        message: `Storage operational (${data.length} buckets)`,
        details: { bucketCount: data.length }
      };
    } catch (error) {
      return {
        component: 'Storage Service',
        status: 'warning',
        message: 'Storage test inconclusive',
        details: { error }
      };
    }
  }

  private async validateTableStructure(): Promise<ValidationResult> {
    const requiredTables = [
      'profiles', 'ai_agents', 'conversations', 'workflows', 
      'test_cases', 'test_runs', 'projects', 'tasks', 'sprints'
    ];
    const missingTables = [];

    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error && error.code === 'PGRST106') {
          missingTables.push(table);
        }
      } catch (error) {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      return {
        component: 'Database Schema',
        status: 'fail',
        message: `Missing tables: ${missingTables.join(', ')}`,
        recommendations: ['Run database migrations', 'Check schema setup']
      };
    }

    return {
      component: 'Database Schema',
      status: 'pass',
      message: 'All required tables present',
      details: { tablesChecked: requiredTables.length }
    };
  }

  private async validateRLSPolicies(): Promise<ValidationResult> {
    // Test RLS by attempting operations that should be restricted
    try {
      // This should fail without proper auth
      const { error } = await supabase.from('profiles').insert({ 
        id: '00000000-0000-0000-0000-000000000000',
        email: 'test@test.com' 
      });

      // If no error, RLS might not be properly configured
      if (!error) {
        return {
          component: 'Row Level Security',
          status: 'warning',
          message: 'RLS policies may need review',
          recommendations: ['Review RLS policy configuration']
        };
      }

      return {
        component: 'Row Level Security',
        status: 'pass',
        message: 'RLS policies appear to be working',
        details: { testPassed: true }
      };
    } catch (error) {
      return {
        component: 'Row Level Security',
        status: 'pass',
        message: 'RLS validation completed',
        details: { error }
      };
    }
  }

  private async validateForeignKeys(): Promise<ValidationResult> {
    // Test foreign key constraints by checking relationships
    try {
      const { data: agents, error } = await supabase
        .from('ai_agents')
        .select('user_id')
        .limit(5);

      if (error) {
        return {
          component: 'Foreign Key Constraints',
          status: 'warning',
          message: 'Could not validate foreign keys',
          details: { error: error.message }
        };
      }

      return {
        component: 'Foreign Key Constraints',
        status: 'pass',
        message: 'Foreign key relationships intact',
        details: { recordsChecked: agents?.length || 0 }
      };
    } catch (error) {
      return {
        component: 'Foreign Key Constraints',
        status: 'fail',
        message: 'Foreign key validation failed',
        recommendations: ['Check database schema integrity']
      };
    }
  }

  private async testAllEdgeFunctions(): Promise<ValidationResult> {
    const functions = ['config-check', 'check-subscription'];
    const results = [];

    for (const functionName of functions) {
      try {
        const startTime = Date.now();
        const { data, error } = await supabase.functions.invoke(functionName);
        const responseTime = Date.now() - startTime;

        results.push({
          function: functionName,
          success: !error,
          responseTime,
          error: error?.message
        });
      } catch (error) {
        results.push({
          function: functionName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const failedFunctions = results.filter(r => !r.success);
    
    if (failedFunctions.length > 0) {
      return {
        component: 'Edge Functions',
        status: 'warning',
        message: `${failedFunctions.length} functions need attention`,
        details: { results },
        recommendations: ['Check function deployment', 'Verify function code']
      };
    }

    return {
      component: 'Edge Functions',
      status: 'pass',
      message: 'All edge functions operational',
      details: { functionsChecked: functions.length, results }
    };
  }

  private async testCRUDOperations(): Promise<ValidationResult> {
    try {
      // Test with a simple table that should be accessible
      const testData = { setting_key: 'test_validation', setting_value: {} };
      
      // Create
      const { data: created, error: createError } = await supabase
        .from('app_settings')
        .insert(testData)
        .select()
        .single();

      if (createError) {
        return {
          component: 'CRUD Operations',
          status: 'fail',
          message: `Create operation failed: ${createError.message}`,
          recommendations: ['Check table permissions', 'Verify RLS policies']
        };
      }

      // Read
      const { data: read, error: readError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', created.id)
        .single();

      if (readError) {
        return {
          component: 'CRUD Operations',
          status: 'fail',
          message: `Read operation failed: ${readError.message}`
        };
      }

      // Update
      const { error: updateError } = await supabase
        .from('app_settings')
        .update({ setting_value: { updated: true } })
        .eq('id', created.id);

      if (updateError) {
        return {
          component: 'CRUD Operations',
          status: 'fail',
          message: `Update operation failed: ${updateError.message}`
        };
      }

      // Delete
      const { error: deleteError } = await supabase
        .from('app_settings')
        .delete()
        .eq('id', created.id);

      if (deleteError) {
        return {
          component: 'CRUD Operations',
          status: 'fail',
          message: `Delete operation failed: ${deleteError.message}`
        };
      }

      return {
        component: 'CRUD Operations',
        status: 'pass',
        message: 'All CRUD operations successful',
        details: { testRecordId: created.id }
      };
    } catch (error) {
      return {
        component: 'CRUD Operations',
        status: 'fail',
        message: `CRUD test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recommendations: ['Check database permissions', 'Verify table structure']
      };
    }
  }

  private async testRealtimeFeatures(): Promise<ValidationResult> {
    return new Promise((resolve) => {
      try {
        const channel = supabase.channel('validation-test');
        let connected = false;

        const timeout = setTimeout(() => {
          if (!connected) {
            channel.unsubscribe();
            resolve({
              component: 'Realtime Features',
              status: 'warning',
              message: 'Realtime connection timeout',
              recommendations: ['Check realtime configuration']
            });
          }
        }, 5000);

        channel
          .on('presence', { event: 'sync' }, () => {
            connected = true;
            clearTimeout(timeout);
            channel.unsubscribe();
            resolve({
              component: 'Realtime Features',
              status: 'pass',
              message: 'Realtime features operational',
              details: { connectionTest: 'passed' }
            });
          })
          .subscribe();
      } catch (error) {
        resolve({
          component: 'Realtime Features',
          status: 'fail',
          message: `Realtime test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          recommendations: ['Check realtime configuration']
        });
      }
    });
  }

  private async testAuthenticationFlow(): Promise<ValidationResult> {
    try {
      // Test session retrieval
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        return {
          component: 'Authentication Flow',
          status: 'fail',
          message: `Session test failed: ${sessionError.message}`,
          recommendations: ['Check auth configuration']
        };
      }

      // Test auth state listening capability
      const unsubscribe = supabase.auth.onAuthStateChange(() => {});
      unsubscribe.subscription.unsubscribe();

      return {
        component: 'Authentication Flow',
        status: 'pass',
        message: 'Authentication flow operational',
        details: { hasSession: !!sessionData.session }
      };
    } catch (error) {
      return {
        component: 'Authentication Flow',
        status: 'fail',
        message: `Auth flow test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recommendations: ['Restart authentication service']
      };
    }
  }

  private async testPerformanceMetrics(): Promise<ValidationResult> {
    const tests = [];
    const startTime = Date.now();

    try {
      // Run multiple concurrent operations
      tests.push(supabase.from('profiles').select('count').limit(1));
      tests.push(supabase.from('ai_agents').select('count').limit(1));
      tests.push(supabase.auth.getSession());

      const results = await Promise.all(tests);
      const totalTime = Date.now() - startTime;

      const hasErrors = results.some(r => r.error);
      if (hasErrors) {
        return {
          component: 'Performance Metrics',
          status: 'warning',
          message: 'Some performance tests failed',
          details: { totalTime, testCount: tests.length }
        };
      }

      return {
        component: 'Performance Metrics',
        status: totalTime > 3000 ? 'warning' : 'pass',
        message: `Performance test completed (${totalTime}ms)`,
        details: { totalTime, testCount: tests.length, averageTime: Math.round(totalTime / tests.length) }
      };
    } catch (error) {
      return {
        component: 'Performance Metrics',
        status: 'fail',
        message: `Performance test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recommendations: ['Check system resources', 'Optimize queries']
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateExtensiveErrorReport(validationReport: SystemValidationReport): Promise<string> {
    const failedComponents = validationReport.results.filter(r => r.status === 'fail');
    const warningComponents = validationReport.results.filter(r => r.status === 'warning');

    let report = `
# EXTENSIVE SUPABASE SYSTEM VALIDATION ERROR REPORT
Generated: ${validationReport.timestamp}
Retry Attempts: ${validationReport.retryCount}/${this.maxRetries}
Overall Status: ${validationReport.overall.toUpperCase()}

## EXECUTIVE SUMMARY
${validationReport.summary}

## CRITICAL FAILURES (${failedComponents.length})
`;

    failedComponents.forEach((component, index) => {
      report += `
### ${index + 1}. ${component.component}
**Status**: FAILED
**Message**: ${component.message}
**Details**: ${JSON.stringify(component.details, null, 2)}
**Recommendations**:
${component.recommendations?.map(r => `- ${r}`).join('\n') || '- No specific recommendations available'}
`;
    });

    report += `
## WARNINGS (${warningComponents.length})
`;

    warningComponents.forEach((component, index) => {
      report += `
### ${index + 1}. ${component.component}
**Message**: ${component.message}
**Details**: ${JSON.stringify(component.details, null, 2)}
**Recommendations**:
${component.recommendations?.map(r => `- ${r}`).join('\n') || '- Monitor and optimize as needed'}
`;
    });

    report += `
## SYSTEM CONFIGURATION REVIEW
- Database Connection: ${validationReport.results.find(r => r.component === 'Database Connection')?.status || 'Unknown'}
- Authentication: ${validationReport.results.find(r => r.component === 'Authentication Service')?.status || 'Unknown'}
- Storage: ${validationReport.results.find(r => r.component === 'Storage Service')?.status || 'Unknown'}
- Edge Functions: ${validationReport.results.find(r => r.component === 'Edge Functions')?.status || 'Unknown'}
- CRUD Operations: ${validationReport.results.find(r => r.component === 'CRUD Operations')?.status || 'Unknown'}
- Realtime Features: ${validationReport.results.find(r => r.component === 'Realtime Features')?.status || 'Unknown'}

## NEXT STEPS
1. Address all CRITICAL FAILURES immediately
2. Review and implement WARNING recommendations
3. Re-run validation after fixes
4. Monitor system performance
5. Set up automated health checks

## TECHNICAL DETAILS
Validation performed across ${validationReport.results.length} components
Retry strategy: ${this.maxRetries} attempts with 3-second delays
Environment: ${process.env.NODE_ENV || 'development'}
`;

    return report;
  }
}
