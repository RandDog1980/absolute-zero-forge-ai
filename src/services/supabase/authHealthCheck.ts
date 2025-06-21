
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export async function testAuthentication(): Promise<HealthCheckResult> {
  try {
    const { data: session, error } = await supabase.auth.getSession();
    
    if (error) {
      return {
        component: 'Authentication',
        status: 'error',
        message: `Auth service error: ${error.message}`,
        details: { error: error.message },
        timestamp: new Date().toISOString()
      };
    }

    const hasSession = !!session.session;
    return {
      component: 'Authentication',
      status: 'healthy',
      message: hasSession 
        ? 'Authentication service active with valid session'
        : 'Authentication service operational (no active session)',
      details: { 
        hasSession,
        userId: session.session?.user?.id || null,
        provider: session.session?.user?.app_metadata?.provider || null
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      component: 'Authentication',
      status: 'error',
      message: `Authentication test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error },
      timestamp: new Date().toISOString()
    };
  }
}
