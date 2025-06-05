
import { RequiredAuth } from '@/components/auth/RequiredAuth';
import { ShieldCheck, Users, MessageSquareWarning, GanttChartSquare, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Keep Card for content structure within tabs

export default function AdminPage() {
  return (
    <RequiredAuth allowedRoles={['ADMIN']} redirectTo='/'>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center">
            <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
            Admin Panel
          </h1>
        </div>
        <p className="text-muted-foreground">
          Welcome to the CivicConnect Admin Panel. Select a tab below to manage different aspects of the platform.
        </p>
        
        <Tabs defaultValue="user_management" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="user_management">
              <Users className="mr-2 h-4 w-4" /> User Management
            </TabsTrigger>
            <TabsTrigger value="content_moderation">
              <MessageSquareWarning className="mr-2 h-4 w-4" /> Content Moderation
            </TabsTrigger>
            <TabsTrigger value="election_data">
              <GanttChartSquare className="mr-2 h-4 w-4" /> Election Data
            </TabsTrigger>
            <TabsTrigger value="platform_analytics">
              <BarChart3 className="mr-2 h-4 w-4" /> Platform Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user_management">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>View, edit, and manage user accounts and roles.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                  <li>View all registered users with sorting and filtering capabilities.</li>
                  <li>Assign or change user roles (Voter, Candidate, Admin).</li>
                  <li>Activate, deactivate, or suspend user accounts.</li>
                  <li>Verify candidate profiles and manage verification status.</li>
                  <li>Reset user passwords or manage multi-factor authentication.</li>
                  <li>View user activity logs and login history.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content_moderation">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquareWarning className="mr-2 h-5 w-5 text-primary" />
                  Content Moderation
                </CardTitle>
                <CardDescription>Review reported content and manage platform posts.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                  <li>Review a queue of reported feed posts, comments, and user profiles.</li>
                  <li>Moderate user-generated content for policy violations (e.g., hate speech, misinformation).</li>
                  <li>Take actions: approve, reject, edit content, or warn/ban users.</li>
                  <li>Manage content flags, warnings, and strike systems.</li>
                  <li>View history of moderation actions and justifications.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="election_data">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GanttChartSquare className="mr-2 h-5 w-5 text-primary" />
                  Election & Campaign Data Management
                </CardTitle>
                <CardDescription>Manage election timelines, candidate data, campaign details, and regions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                  <li>Add, edit, or remove election events, dates, and deadlines for the timeline.</li>
                  <li>Manage candidate profiles: update details, party affiliations, and regions.</li>
                  <li>Oversee campaign pages: approve new campaigns, manage content, and monitor activity.</li>
                  <li>Define or update electoral regions and associate them with relevant elections/candidates.</li>
                  <li>Import or export election-related data in various formats (e.g., CSV).</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform_analytics">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                  Platform Analytics & Reporting
                </CardTitle>
                <CardDescription>View key metrics and platform usage statistics for insights and reporting.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                  <li>Dashboard with key metrics: active users, new signups, post interactions.</li>
                  <li>Track volunteer signup rates, areas of interest, and campaign assignments.</li>
                  <li>View popular candidates, trending campaigns, and manifesto summary usage.</li>
                  <li>Analyze content performance: views, likes, shares on posts and campaign updates.</li>
                  <li>Generate reports on user demographics, engagement, and platform growth.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequiredAuth>
  );
}
