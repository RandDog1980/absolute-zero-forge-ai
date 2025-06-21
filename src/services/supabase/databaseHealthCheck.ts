
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export async function testDatabaseConnection(): Promise<HealthCheckResult> {
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        component: 'Database Connection',
        status: 'error',
        message: `Database connection failed: ${error.message}`,
        details: { error: error.message, code: error.code },
        timestamp: new Date().toISOString()
      };
    }

    const status = responseTime > 1000 ? 'warning' : 'healthy';
    return {
      component: 'Database Connection',
      status,
      message: status === 'healthy' 
        ? `Database connection successful (${responseTime}ms)`
        : `Database connection slow (${responseTime}ms)`,
      details: { responseTime, query: 'profiles table test' },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      component: 'Database Connection',
      status: 'error',
      message: `Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error },
      timestamp: new Date().toISOString()
    };
  }
}
