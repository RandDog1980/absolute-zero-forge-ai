
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle } from 'lucide-react';

const CommonIssues = () => {
  const commonIssues = [
    {
      issue: "Row-level security policy violations",
      solution: "Ensure user_id columns are not nullable, check RLS policies, verify authentication"
    },
    {
      issue: "Authentication redirects not working",
      solution: "Configure Site URL and Redirect URLs in Authentication → URL Configuration"
    },
    {
      issue: "Edge Functions failing",
      solution: "Check function logs, verify all secrets are set, test functions individually"
    },
    {
      issue: "Real-time features not working",
      solution: "Ensure tables are in supabase_realtime publication with REPLICA IDENTITY FULL"
    },
    {
      issue: "Storage upload failures",
      solution: "Check bucket policies, verify file size limits, ensure proper MIME types"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Common Issues & Solutions
        </CardTitle>
        <CardDescription>
          Quick fixes for frequently encountered Supabase configuration problems
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {commonIssues.map((item, index) => (
              <div key={index}>
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Issue: {item.issue}</h4>
                  <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                    <strong>Solution:</strong> {item.solution}
                  </p>
                </div>
                {index < commonIssues.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CommonIssues;
