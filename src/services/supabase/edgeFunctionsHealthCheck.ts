
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export async function testEdgeFunctions(): Promise<HealthCheckResult> {
  try {
    // Test config-check function
    const startTime = Date.now();
    const { data, error } = await supabase.functions.invoke('config-check');
    const responseTime = Date.now() - startTime;

    if (error) {
      return {
        component: 'Edge Functions',
        status: 'error',
        message: `Edge function test failed: ${error.message}`,
        details: { error: error.message, function: 'config-check' },
        timestamp: new Date().toISOString()
      };
    }

    const status = responseTime > 2000 ? 'warning' : 'healthy';
    return {
      component: 'Edge Functions',
      status,
      message: status === 'healthy'
        ? `Edge functions operational (${responseTime}ms)`
        : `Edge functions slow response (${responseTime}ms)`,
      details: { 
        responseTime, 
        functionResponse: data,
        testedFunction: 'config-check'
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      component: 'Edge Functions',
      status: 'error',
      message: `Edge function test error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error },
      timestamp: new Date().toISOString()
    };
  }
}
