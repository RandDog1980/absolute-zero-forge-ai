
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult, SUPABASE_URL } from './types';

export async function testAPIConfiguration(): Promise<HealthCheckResult> {
  try {
    // Test basic API functionality
    const { data, error } = await supabase
      .from('ai_agents')
      .select('count')
      .limit(1);

    if (error) {
      return {
        component: 'API Configuration',
        status: 'error',
        message: `API configuration error: ${error.message}`,
        details: { error: error.message, code: error.code },
        timestamp: new Date().toISOString()
      };
    }

    return {
      component: 'API Configuration',
      status: 'healthy',
      message: 'API configuration and REST endpoints operational',
      details: { 
        testQuery: 'ai_agents table access',
        apiUrl: SUPABASE_URL
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      component: 'API Configuration',
      status: 'error',
      message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error },
      timestamp: new Date().toISOString()
    };
  }
}
