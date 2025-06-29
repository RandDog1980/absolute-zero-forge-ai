import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Index from '@/pages/Index';
import Templates from '@/pages/Templates';
import Workflows from '@/pages/Workflows';
import AIEngine from '@/pages/AIEngine';
import Pricing from '@/pages/Pricing';
import Account from '@/pages/Account';
import Auth from '@/pages/Auth';
import LLMConfig from '@/pages/LLMConfig';
import VBAGenerator from '@/pages/VBAGenerator';
import LowNoCodeBuilder from '@/pages/LowNoCodeBuilder';
import WorkflowVisualBuilder from '@/pages/WorkflowVisualBuilder';
import ThemeCustomizerPage from '@/pages/ThemeCustomizer';
import Projects from '@/pages/Projects';
import Documentation from '@/pages/Documentation';
import Admin from '@/pages/Admin';
import Agency from '@/pages/Agency';
import Testing from '@/pages/Testing';
import Integrations from '@/pages/Integrations';

// Create QueryClient outside of component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
        <Route path="/ai-engine" element={<ProtectedRoute><AIEngine /></ProtectedRoute>} />
        <Route path="/llm-config" element={<ProtectedRoute><LLMConfig /></ProtectedRoute>} />
        <Route path="/vba-generator" element={<ProtectedRoute><VBAGenerator /></ProtectedRoute>} />
        <Route path="/low-no-code-builder" element={<ProtectedRoute><LowNoCodeBuilder /></ProtectedRoute>} />
        <Route path="/theme-customizer" element={<ProtectedRoute><ThemeCustomizerPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/documentation" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/agency" element={<ProtectedRoute><Agency /></ProtectedRoute>} />
        <Route path="/testing" element={<ProtectedRoute><Testing /></ProtectedRoute>} />
        <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/workflow-builder" element={<ProtectedRoute><WorkflowVisualBuilder /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
