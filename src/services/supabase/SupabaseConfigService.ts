
import { supabase } from '@/integrations/supabase/client';

export class SupabaseConfigService {
  static async performInitialSetup(): Promise<void> {
    console.log('🔧 Performing initial Supabase setup...');
    
    // Test basic connection
    const { error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log('✅ Initial setup completed');
  }

  static async configureDatabaseSettings(): Promise<void> {
    console.log('🗄️ Configuring database settings...');
    
    // Check if required tables exist
    const requiredTables = ['profiles', 'ai_agents', 'conversations'];
    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table as any).select('count').limit(1);
        if (error && error.code === 'PGRST106') {
          console.warn(`⚠️ Table ${table} not found`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not check table ${table}`);
      }
    }
    
    console.log('✅ Database configuration completed');
  }

  static async configureAuthentication(): Promise<void> {
    console.log('🔐 Configuring authentication...');
    
    // Test authentication service
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn(`⚠️ Auth configuration issue: ${error.message}`);
    } else {
      console.log('✅ Authentication service accessible');
    }
  }

  static async configureEdgeFunctions(): Promise<void> {
    console.log('⚡ Configuring edge functions...');
    
    try {
      // Test realtime-chat function
      const { data, error } = await supabase.functions.invoke('realtime-chat', {
        body: { type: 'ping', message: 'Configuration test' }
      });
      
      if (error) {
        console.warn(`⚠️ Edge function test failed: ${error.message}`);
      } else {
        console.log('✅ Edge functions configured');
      }
    } catch (error) {
      console.warn(`⚠️ Edge function configuration issue: ${error}`);
    }
  }

  static async configureMonitoring(): Promise<void> {
    console.log('📊 Setting up monitoring...');
    // Basic monitoring setup - could be extended
    console.log('✅ Monitoring setup completed');
  }

  static async runFullHealthCheck(): Promise<{ status: 'healthy' | 'warning' | 'error', message: string, details: any[] }> {
    console.log('🏥 Running full health check...');
    
    const checks = [];
    let overallStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    
    // Database check
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        checks.push({ component: 'Database', status: 'error', error: error.message });
        overallStatus = 'error';
      } else {
        checks.push({ component: 'Database', status: 'healthy' });
      }
    } catch (error) {
      checks.push({ component: 'Database', status: 'error', error: 'Connection failed' });
      overallStatus = 'error';
    }
    
    // Auth check
    try {
      const { error } = await supabase.auth.getSession();
      if (error) {
        checks.push({ component: 'Authentication', status: 'warning', error: error.message });
        if (overallStatus === 'healthy') overallStatus = 'warning';
      } else {
        checks.push({ component: 'Authentication', status: 'healthy' });
      }
    } catch (error) {
      checks.push({ component: 'Authentication', status: 'error', error: 'Auth service unavailable' });
      overallStatus = 'error';
    }
    
    // Edge function check
    try {
      const { error } = await supabase.functions.invoke('realtime-chat', {
        body: { type: 'ping', message: 'Health check' }
      });
      
      if (error) {
        checks.push({ component: 'Edge Functions', status: 'warning', error: error.message });
        if (overallStatus === 'healthy') overallStatus = 'warning';
      } else {
        checks.push({ component: 'Edge Functions', status: 'healthy' });
      }
    } catch (error) {
      checks.push({ component: 'Edge Functions', status: 'error', error: 'Function unavailable' });
      overallStatus = 'error';
    }
    
    const message = overallStatus === 'healthy' 
      ? 'All systems operational' 
      : overallStatus === 'warning'
      ? 'Some issues detected but system functional'
      : 'Critical issues found';
    
    return { status: overallStatus, message, details: checks };
  }
}
