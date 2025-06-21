
export interface HealthCheckResult {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: any;
  timestamp: string;
}

export interface ComprehensiveHealthReport {
  overall: 'healthy' | 'warning' | 'error';
  summary: string;
  checks: HealthCheckResult[];
  recommendations: string[];
  timestamp: string;
}

// Configuration constants
export const SUPABASE_URL = "https://rnhtpciitjycpqqimgce.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaHRwY2lpdGp5Y3BxcWltZ2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NTE2NTksImV4cCI6MjA2NTUyNzY1OX0.9ZkfiUQ43jLzi-WHeRxX6NB_VvoAvouQvy1o2XO5tdA";
