
import React from 'react';
import SystemValidationDashboard from '@/components/ai/SystemValidationDashboard';

const SystemValidation = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Validation</h1>
          <p className="mt-2 text-lg text-gray-600">
            Comprehensive Supabase system testing and validation suite
          </p>
        </div>
        <SystemValidationDashboard />
      </div>
    </div>
  );
};

export default SystemValidation;
