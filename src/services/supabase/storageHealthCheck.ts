
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export async function testStorageConfiguration(): Promise<HealthCheckResult> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return {
        component: 'Storage Configuration',
        status: 'warning',
        message: 'Storage service may not be configured or accessible',
        details: { error: error.message },
        timestamp: new Date().toISOString()
      };
    }

    return {
      component: 'Storage Configuration',
      status: 'healthy',
      message: `Storage service operational (${data.length} bucket(s) configured)`,
      details: { 
        bucketCount: data.length,
        buckets: data.map(b => b.name)
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      component: 'Storage Configuration',
      status: 'warning',
      message: 'Storage service test inconclusive',
      details: { error },
      timestamp: new Date().toISOString()
    };
  }
}
