
import { supabase } from '@/integrations/supabase/client';
import { SupabaseConfigService } from './SupabaseConfigService';

export class AutoConfigurationService {
  static async runAutoConfiguration(): Promise<{ status: 'healthy' | 'warning' | 'error', message: string, details: any[] }> {
    console.log('🚀 Starting Automatic Supabase Configuration...');
    
    try {
      // Step 1: Initial Setup
      await SupabaseConfigService.performInitialSetup();
      
      // Step 2: Database Configuration
      await SupabaseConfigService.configureDatabaseSettings();
      
      // Step 3: Authentication Setup
      await SupabaseConfigService.configureAuthentication();
      
      // Step 4: Edge Functions
      await SupabaseConfigService.configureEdgeFunctions();
      
      // Step 5: Monitoring Setup
      await SupabaseConfigService.configureMonitoring();
      
      // Step 6: Run Health Check
      const healthResult = await SupabaseConfigService.runFullHealthCheck();
      
      if (healthResult.status === 'healthy') {
        console.log('✅ Auto-configuration completed successfully');
      } else {
        console.warn('⚠️  Auto-configuration completed with warnings:', healthResult.message);
      }
      
      return healthResult;
    } catch (error) {
      console.error('❌ Auto-configuration failed:', error);
      return {
        status: 'error',
        message: `Auto-configuration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: [{ component: 'Auto Configuration', error }]
      };
    }
  }

  static async validateAllRequiredAppsAndServices(): Promise<{
    requiredApps: string[];
    missingApps: string[];
    recommendations: string[];
  }> {
    console.log('🔍 Validating Required Apps and Services...');
    
    const requiredApps = [
      'Supabase CLI (for local development)',
      'Node.js (v18 or higher)',
      'Git (for version control)',
      'Browser with developer tools'
    ];
    
    const missingApps: string[] = [];
    const recommendations: string[] = [];
    
    // Check if we can access Supabase
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        missingApps.push('Supabase connection');
        recommendations.push('Verify Supabase project configuration and API keys');
      }
    } catch (error) {
      missingApps.push('Supabase connection');
      recommendations.push('Check internet connection and Supabase service status');
    }
    
    // Check Node.js version (if available)
    if (typeof process !== 'undefined' && process.version) {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      if (majorVersion < 18) {
        missingApps.push('Node.js v18+');
        recommendations.push('Update Node.js to version 18 or higher');
      }
    }
    
    // Add general recommendations
    recommendations.push('Install Supabase CLI: npm install -g supabase');
    recommendations.push('Ensure all required environment variables are set');
    recommendations.push('Verify database schema is up to date');
    
    return {
      requiredApps,
      missingApps,
      recommendations
    };
  }
}
