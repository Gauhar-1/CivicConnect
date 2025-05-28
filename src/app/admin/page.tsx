
import { RequiredAuth } from '@/components/auth/RequiredAuth';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <RequiredAuth allowedRoles={['ADMIN']} redirectTo='/'>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShieldCheck className="mr-3 h-7 w-7 text-primary" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground">
          Welcome to the CivicConnect Admin Panel. Manage users, content, and platform settings.
        </p>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Key metrics and quick actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for the admin dashboard content.</p>
            <p className="mt-4">Future features could include:</p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>User Management</li>
              <li>Content Moderation (Reports, Posts)</li>
              <li>Election Data Management</li>
              <li>Platform Analytics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </RequiredAuth>
  );
}
