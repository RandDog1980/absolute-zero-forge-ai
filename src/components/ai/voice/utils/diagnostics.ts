
import { supabase } from '@/integrations/supabase/client';

export class Absolute0AIDiagnostics {
  static async runFullDiagnostic() {
    console.log('🔍 Starting Absolute-0.AI full diagnostic...');
    
    const results = {
      overall: false,
      supabase: { success: false, message: '', details: {} },
      realtimeChat: { success: false, message: '', details: {} },
      apiKey: { success: false, message: '', details: {} },
      timestamp: new Date().toISOString()
    };

    try {
      // Test Supabase connection
      console.log('📡 Testing Supabase connection...');
      const { data, error: dbError } = await supabase.from('profiles').select('count').limit(1);
      
      if (dbError) {
        results.supabase = {
          success: false,
          message: `Database connection failed: ${dbError.message}`,
          details: { error: dbError.code, message: dbError.message }
        };
      } else {
        results.supabase = {
          success: true,
          message: 'Supabase connection successful',
          details: { status: 'connected' }
        };
      }

      // Test realtime-chat edge function
      console.log('⚡ Testing realtime-chat function...');
      try {
        const { data: functionData, error: functionError } = await supabase.functions.invoke('realtime-chat', {
          body: { type: 'ping', message: 'Diagnostic test' }
        });

        if (functionError) {
          results.realtimeChat = {
            success: false,
            message: `Edge function error: ${functionError.message}`,
            details: { error: functionError }
          };
        } else if (functionData?.success) {
          results.realtimeChat = {
            success: true,
            message: 'Realtime chat function operational',
            details: { response: functionData }
          };
        } else {
          results.realtimeChat = {
            success: false,
            message: 'Edge function returned unexpected response',
            details: { response: functionData }
          };
        }
      } catch (error) {
        results.realtimeChat = {
          success: false,
          message: `Edge function test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: { error }
        };
      }

      // Test API key configuration (indirectly)
      console.log('🔑 Testing API key configuration...');
      if (results.realtimeChat.success) {
        results.apiKey = {
          success: true,
          message: 'API key appears to be configured correctly',
          details: { status: 'configured' }
        };
      } else {
        results.apiKey = {
          success: false,
          message: 'API key configuration cannot be verified - edge function failed',
          details: { status: 'unknown' }
        };
      }

      // Determine overall status
      results.overall = results.supabase.success && results.realtimeChat.success && results.apiKey.success;

      console.log('✅ Diagnostic completed:', results);
      return results;

    } catch (error) {
      console.error('❌ Diagnostic failed:', error);
      return {
        ...results,
        overall: false,
        error: error instanceof Error ? error.message : 'Unknown diagnostic error'
      };
    }
  }

  static async testVoiceConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🎤 Testing voice connection...');
      
      // Test if we can create an SSE connection to the realtime-chat function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        return {
          success: false,
          message: 'No authentication session found',
          details: { requiresAuth: true }
        };
      }

      // Test the edge function with a ping
      const { data, error } = await supabase.functions.invoke('realtime-chat', {
        body: { type: 'ping', message: 'Voice connection test' }
      });

      if (error) {
        return {
          success: false,
          message: `Voice connection test failed: ${error.message}`,
          details: { error }
        };
      }

      return {
        success: true,
        message: 'Voice connection system is operational',
        details: { response: data }
      };

    } catch (error) {
      return {
        success: false,
        message: `Voice connection test error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      };
    }
  }
}
