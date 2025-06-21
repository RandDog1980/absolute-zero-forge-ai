
import { HealthCheckResult, SUPABASE_URL, SUPABASE_ANON_KEY } from './types';

export async function testEnvironmentConfiguration(): Promise<HealthCheckResult> {
  const issues: string[] = [];
  const details: any = {};

  // Check URL configuration
  if (!SUPABASE_URL || SUPABASE_URL.includes('localhost')) {
    if (SUPABASE_URL.includes('localhost')) {
      details.environment = 'development';
    } else {
      issues.push('Invalid Supabase URL configuration');
    }
  } else {
    details.environment = 'production';
    details.supabaseUrl = SUPABASE_URL;
  }

  // Check key configuration
  if (!SUPABASE_ANON_KEY) {
    issues.push('Missing Supabase anon key');
  } else {
    details.hasAnonKey = true;
  }

  const status = issues.length === 0 ? 'healthy' : 'error';
  return {
    component: 'Environment Configuration',
    status,
    message: status === 'healthy' 
      ? 'Environment configuration optimal'
      : `Configuration issues: ${issues.join(', ')}`,
    details,
    timestamp: new Date().toISOString()
  };
}
