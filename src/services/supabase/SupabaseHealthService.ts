
import { ComprehensiveHealthReport, HealthCheckResult } from './types';
import { testDatabaseConnection } from './databaseHealthCheck';
import { testAuthentication } from './authHealthCheck';
import { testEdgeFunctions } from './edgeFunctionsHealthCheck';
import { testAPIConfiguration } from './apiHealthCheck';
import { testRealtimeFeatures } from './realtimeHealthCheck';
import { testStorageConfiguration } from './storageHealthCheck';
import { testEnvironmentConfiguration } from './environmentHealthCheck';
import { testPerformanceMetrics } from './performanceHealthCheck';
import { attemptAutoFix } from './autoFix';

export class SupabaseHealthService {
  static async runComprehensiveHealthCheck(): Promise<ComprehensiveHealthReport> {
    console.log('🔍 Starting Comprehensive Supabase Health Check...');
    
    const checks: HealthCheckResult[] = [];
    const recommendations: string[] = [];

    // Run all health checks
    checks.push(await testDatabaseConnection());
    checks.push(await testAuthentication());
    checks.push(await testEdgeFunctions());
    checks.push(await testAPIConfiguration());
    checks.push(await testRealtimeFeatures());
    checks.push(await testStorageConfiguration());
    checks.push(await testEnvironmentConfiguration());
    checks.push(await testPerformanceMetrics());

    // Analyze results
    const errorCount = checks.filter(c => c.status === 'error').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    
    let overall: 'healthy' | 'warning' | 'error' = 'healthy';
    let summary = 'All Supabase components are functioning optimally';
    
    if (errorCount > 0) {
      overall = 'error';
      summary = `${errorCount} critical issue(s) detected requiring immediate attention`;
      recommendations.push('Address all error-level issues immediately');
    } else if (warningCount > 0) {
      overall = 'warning';
      summary = `${warningCount} optimization opportunity(ies) identified`;
      recommendations.push('Consider addressing warning-level optimizations');
    }

    // Add general recommendations
    if (overall === 'healthy') {
      recommendations.push('System is healthy - consider implementing monitoring for production');
      recommendations.push('Review Row Level Security policies periodically');
      recommendations.push('Monitor database performance metrics regularly');
    }

    return {
      overall,
      summary,
      checks,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  static async fixCommonIssues(): Promise<string[]> {
    const fixes: string[] = [];
    
    try {
      // Run health check first
      const report = await this.runComprehensiveHealthCheck();
      
      for (const check of report.checks) {
        if (check.status === 'error') {
          const fix = await attemptAutoFix(check);
          if (fix) {
            fixes.push(fix);
          }
        }
      }
      
      return fixes;
    } catch (error) {
      fixes.push(`Auto-fix process failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return fixes;
    }
  }
}
