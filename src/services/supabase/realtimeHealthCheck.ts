
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export async function testRealtimeFeatures(): Promise<HealthCheckResult> {
  try {
    // Test realtime channel creation
    const channel = supabase.channel('health-check-test');
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        channel.unsubscribe();
        resolve({
          component: 'Real-time Features',
          status: 'warning',
          message: 'Real-time connection timeout - may need optimization',
          details: { timeout: true },
          timestamp: new Date().toISOString()
        });
      }, 5000);

      channel
        .on('presence', { event: 'sync' }, () => {
          clearTimeout(timeout);
          channel.unsubscribe();
          resolve({
            component: 'Real-time Features',
            status: 'healthy',
            message: 'Real-time features operational',
            details: { channelTest: 'successful' },
            timestamp: new Date().toISOString()
          });
        })
        .subscribe();
    });
  } catch (error) {
    return {
      component: 'Real-time Features',
      status: 'error',
      message: `Real-time test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error },
      timestamp: new Date().toISOString()
    };
  }
}
