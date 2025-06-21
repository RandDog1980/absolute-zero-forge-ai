
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProductionChecklist = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Deployment Checklist</CardTitle>
        <CardDescription>
          Essential steps before going live with your Supabase configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Pre-Production</h4>
            <ul className="space-y-1 text-sm">
              <li>✓ All database tables with RLS policies</li>
              <li>✓ User registration and login working</li>
              <li>✓ Edge functions deployed and responding</li>
              <li>✓ Real-time features operational</li>
              <li>✓ All secrets and environment variables set</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Post-Deployment</h4>
            <ul className="space-y-1 text-sm">
              <li>✓ Monitor performance metrics regularly</li>
              <li>✓ Set up log aggregation for debugging</li>
              <li>✓ Test disaster recovery procedures</li>
              <li>✓ Enable automated backups</li>
              <li>✓ Configure rate limiting and security</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionChecklist;
