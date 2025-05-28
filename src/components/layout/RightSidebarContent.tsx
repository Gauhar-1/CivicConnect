import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Users, Search, HandHeart } from 'lucide-react';

const trendingElections = [
  { id: '1', name: 'City Council Election 2024', date: 'Nov 5, 2024' },
  { id: '2', name: 'Mayoral Race - Springfield', date: 'Oct 15, 2024' },
  { id: '3', name: 'School Board Levy Vote', date: 'Sep 30, 2024' },
];

export function RightSidebarContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Trending Elections
          </CardTitle>
          <CardDescription>Stay updated on key upcoming elections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingElections.map((election) => (
            <div key={election.id}>
              <h4 className="font-semibold text-sm">{election.name}</h4>
              <p className="text-xs text-muted-foreground">{election.date}</p>
            </div>
          ))}
           <Button variant="outline" size="sm" className="w-full mt-2">View All Timelines</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Search className="mr-2 h-5 w-5 text-primary" />
            Discover Campaigns
          </CardTitle>
          <CardDescription>Find and follow campaigns that matter to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">
            Explore campaigns by location, party, or popularity. Get involved!
          </p>
          <Link href="/campaigns" passHref>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Find Campaigns
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <HandHeart className="mr-2 h-5 w-5 text-primary" />
            Volunteer Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">
            Make a difference in your community. Sign up to volunteer for a campaign.
          </p>
          <Link href="/volunteer-signup" passHref>
            <Button variant="secondary" className="w-full">
              Sign Up to Volunteer
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
