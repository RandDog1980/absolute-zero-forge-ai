
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export async function testPerformanceMetrics(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const tests = [];
  
  try {
    // Test multiple concurrent requests to measure performance
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
        details: { totalTime, testCount: tests.length },
        timestamp: new Date().toISOString()
      };
    }

    const status = totalTime > 3000 ? 'warning' : 'healthy';
    return {
      component: 'Performance Metrics',
      status,
      message: status === 'healthy'
        ? `Performance metrics optimal (${totalTime}ms for ${tests.length} tests)`
        : `Performance metrics show latency (${totalTime}ms for ${tests.length} tests)`,
      details: { 
        totalTime, 
        testCount: tests.length,
        averageTime: Math.round(totalTime / tests.length)
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      component: 'Performance Metrics',
      status: 'error',
      message: `Performance test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error },
      timestamp: new Date().toISOString()
    };
  }
}
