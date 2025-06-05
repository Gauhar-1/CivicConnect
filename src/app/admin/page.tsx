
import { RequiredAuth } from '@/components/auth/RequiredAuth';
import { ShieldCheck, Users, MessageSquareWarning, GanttChartSquare, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <RequiredAuth allowedRoles={['ADMIN']} redirectTo='/'>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center">
            <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          {/* Add quick action buttons here if needed later */}
        </div>
        <p className="text-muted-foreground">
          Welcome to the CivicConnect Admin Panel. Manage users, content, elections, and platform settings from here.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>View, edit, and manage user accounts and roles.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>View all registered users</li>
                <li>Assign or change user roles (Voter, Candidate, Admin)</li>
                <li>Activate/deactivate user accounts</li>
                <li>Verify candidate profiles</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquareWarning className="mr-2 h-5 w-5 text-primary" />
                Content Moderation
              </CardTitle>
              <CardDescription>Review reported content and manage platform posts.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Review reported feed posts and comments</li>
                <li>Moderate user-generated content for policy violations</li>
                <li>Manage content flags and warnings</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GanttChartSquare className="mr-2 h-5 w-5 text-primary" />
                Election Data Management
              </CardTitle>
              <CardDescription>Manage election timelines, candidate data, and regions.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Add or update election events and deadlines</li>
                <li>Manage candidate profiles and party affiliations</li>
                <li>Define or update electoral regions</li>
                <li>Import/export election-related data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Platform Analytics
              </CardTitle>
              <CardDescription>View key metrics and platform usage statistics.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Track user engagement (active users, post interactions)</li>
                <li>Monitor volunteer signup rates</li>
                <li>View popular candidates and campaigns</li>
                <li>Analyze content performance</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequiredAuth>
  );
}
