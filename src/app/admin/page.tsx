
'use client';

import { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import {
  ShieldCheck, Users, MessageSquareWarning, GanttChartSquare, BarChart3, FileText, CalendarDays,
  Filter, Search as SearchIcon, Trash2, Edit3, PlusCircle, Eye, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, XCircle, LayoutDashboard
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RequiredAuth } from '@/components/auth/RequiredAuth';
import { mockAdminUsers as initialMockAdminUsers, mockReportedContent as initialMockReportedContent, mockElectionEvents as initialMockElectionEvents } from '@/lib/mockData';
import type { AdminUser, ReportedContentItem, ElectionEvent, Role, UserStatus, ReportedContentStatus, ElectionEventType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, addDays, isWithinInterval } from 'date-fns';

// Helper to get badge color for User Status
function getUserStatusBadgeVariant(status: UserStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Active': return 'default'; // Greenish or primary
    case 'Suspended': return 'destructive';
    case 'Pending Verification': return 'secondary'; // Yellowish
    default: return 'outline';
  }
}

// Helper to get badge color for Content Status
function getContentStatusBadgeVariant(status: ReportedContentStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Pending': return 'secondary';
    case 'Approved': return 'default';
    case 'Rejected': return 'destructive';
    default: return 'outline';
  }
}

// Helper to get badge color for Event Type
function getEventTypeBadgeVariant(type: ElectionEventType): "default" | "secondary" | "destructive" | "outline" {
    switch (type) {
        case 'Deadline': return 'destructive';
        case 'Key Event': return 'default'; // or 'primary' like
        case 'Election Day': return 'secondary'; // Or some other distinct color
        default: return 'outline';
    }
}


export default function AdminPage() {
  const { toast } = useToast();

  // User Management State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialMockAdminUsers);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<Role | 'all'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<UserStatus | 'all'>('all');

  // Content Moderation State
  const [reportedContent, setReportedContent] = useState<ReportedContentItem[]>(initialMockReportedContent);
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | ReportedContentItem['contentType']>('all');
  const [contentStatusFilter, setContentStatusFilter] = useState<ReportedContentStatus | 'all'>('all');

  // Election Data State
  const [electionEvents, setElectionEvents] = useState<ElectionEvent[]>(initialMockElectionEvents);
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<ElectionEventType | 'all'>('all');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<ElectionEvent> | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);


  // Memoized filters
  const filteredAdminUsers = useMemo(() => {
    return adminUsers.filter(user =>
      (user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) &&
      (userRoleFilter === 'all' || user.role === userRoleFilter) &&
      (userStatusFilter === 'all' || user.status === userStatusFilter)
    );
  }, [adminUsers, userSearchTerm, userRoleFilter, userStatusFilter]);

  const filteredReportedContent = useMemo(() => {
    return reportedContent.filter(item =>
      (item.contentSnippet.toLowerCase().includes(contentSearchTerm.toLowerCase()) || item.reportedBy.toLowerCase().includes(contentSearchTerm.toLowerCase())) &&
      (contentTypeFilter === 'all' || item.contentType === contentTypeFilter) &&
      (contentStatusFilter === 'all' || item.status === contentStatusFilter)
    );
  }, [reportedContent, contentSearchTerm, contentTypeFilter, contentStatusFilter]);

  const filteredElectionEvents = useMemo(() => {
    return electionEvents.filter(event =>
        (event.title.toLowerCase().includes(eventSearchTerm.toLowerCase()) || event.description.toLowerCase().includes(eventSearchTerm.toLowerCase())) &&
        (eventTypeFilter === 'all' || event.type === eventTypeFilter)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [electionEvents, eventSearchTerm, eventTypeFilter]);

  // User actions
  const handleRoleChange = (userId: string, newRole: Role) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, verified: newRole === 'CANDIDATE' ? u.verified : undefined } : u));
    toast({ title: "User Role Updated", description: `User ${userId} role changed to ${newRole}.` });
  };

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast({ title: "User Status Updated", description: `User ${userId} status changed to ${newStatus}.` });
  };

  const handleVerificationToggle = (userId: string) => {
    setAdminUsers(prev => prev.map(u => u.id === userId && u.role === 'CANDIDATE' ? { ...u, verified: !u.verified } : u));
    toast({ title: "Candidate Verification Updated", description: `User ${userId} verification status toggled.` });
  };

  // Content moderation actions
  const handleContentStatusChange = (itemId: string, newStatus: ReportedContentStatus) => {
    setReportedContent(prev => prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item));
    toast({ title: "Content Status Updated", description: `Item ${itemId} status changed to ${newStatus}.` });
  };

  // Event actions
  const openEventDialog = (event: Partial<ElectionEvent> | null = null) => {
    setCurrentEvent(event || { title: '', date: new Date().toISOString().split('T')[0], type: 'Key Event', description: '' });
    setEditingEventId(event?.id || null);
    setIsEventDialogOpen(true);
  };

  const handleEventFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "type" && currentEvent) { // Handle select specifically
         setCurrentEvent(prev => prev ? { ...prev, type: value as ElectionEventType } : null);
    } else if (currentEvent) {
        setCurrentEvent(prev => prev ? { ...prev, [name]: value } : null);
    }
  };
  
  const handleEventSelectChange = (value: string) => {
    if (currentEvent) {
        setCurrentEvent(prev => prev ? { ...prev, type: value as ElectionEventType } : null);
    }
  };


  const handleSaveEvent = () => {
    if (!currentEvent || !currentEvent.title || !currentEvent.date || !currentEvent.type || !currentEvent.description) {
      toast({ title: "Error", description: "All event fields are required.", variant: "destructive" });
      return;
    }
    if (editingEventId) {
      setElectionEvents(prev => prev.map(e => e.id === editingEventId ? { ...e, ...currentEvent } as ElectionEvent : e));
      toast({ title: "Event Updated", description: `Event "${currentEvent.title}" has been updated.` });
    } else {
      const newEvent: ElectionEvent = {
        id: `event-${Date.now()}`,
        ...currentEvent as Omit<ElectionEvent, 'id'>
      };
      setElectionEvents(prev => [newEvent, ...prev]);
      toast({ title: "Event Added", description: `Event "${newEvent.title}" has been added.` });
    }
    setIsEventDialogOpen(false);
    setCurrentEvent(null);
    setEditingEventId(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setElectionEvents(prev => prev.filter(e => e.id !== eventId));
    toast({ title: "Event Deleted", description: `Event ${eventId} has been deleted.` });
  };

  // Overview Tab Stats
  const totalUsers = adminUsers.length;
  const pendingModerationItems = reportedContent.filter(item => item.status === 'Pending').length;
  const upcomingEventsCount = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = addDays(now, 30);
    return electionEvents.filter(event => {
      try {
        const eventDate = parseISO(event.date); // Ensure date is parsed correctly
        return isWithinInterval(eventDate, { start: now, end: thirtyDaysFromNow });
      } catch (e) {
        // console.error("Error parsing event date for overview:", event.date, e);
        return false; // If date is invalid, don't count it
      }
    }).length;
  }, [electionEvents]);


  return (
    <RequiredAuth allowedRoles={['ADMIN']} redirectTo='/'>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center">
            <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
            Admin Panel
          </h1>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <TabsTrigger value="overview">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
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

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Currently registered users</p>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Moderation</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingModerationItems}</div>
                  <p className="text-xs text-muted-foreground">Items awaiting review</p>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Events (30d)</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingEventsCount}</div>
                  <p className="text-xs text-muted-foreground">Events in the next 30 days</p>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reported Issues</CardTitle>
                  <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportedContent.length}</div>
                   <p className="text-xs text-muted-foreground">All-time reported content</p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6 shadow-md">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" onClick={() => document.querySelector('button[value="user_management"]')?.click()}>
                        <Users className="mr-2 h-4 w-4" /> Manage Users
                    </Button>
                    <Button variant="outline" onClick={() => document.querySelector('button[value="content_moderation"]')?.click()}>
                        <MessageSquareWarning className="mr-2 h-4 w-4" /> Moderate Content
                    </Button>
                     <Button variant="outline" onClick={() => document.querySelector('button[value="election_data"]')?.click()}>
                        <GanttChartSquare className="mr-2 h-4 w-4" /> Manage Election Data
                    </Button>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user_management">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" /> User Management
                </CardTitle>
                <CardDescription>View, edit, and manage user accounts and roles. Changes are client-side only for this demo.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name or email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={userRoleFilter} onValueChange={(value) => setUserRoleFilter(value as Role | 'all')}>
                    <SelectTrigger><SelectValue placeholder="Filter by Role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {(['ADMIN', 'CANDIDATE', 'VOLUNTEER', 'VOTER', 'ANONYMOUS'] as Role[]).map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={userStatusFilter} onValueChange={(value) => setUserStatusFilter(value as UserStatus | 'all')}>
                    <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {(['Active', 'Suspended', 'Pending Verification'] as UserStatus[]).map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified (Candidate)</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdminUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell><Badge variant={user.role === 'ADMIN' ? "destructive" : "secondary"}>{user.role}</Badge></TableCell>
                          <TableCell><Badge variant={getUserStatusBadgeVariant(user.status)}>{user.status}</Badge></TableCell>
                          <TableCell>
                            {user.role === 'CANDIDATE' ? (user.verified ? 'Yes' : 'No') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs font-normal">Change Role</DropdownMenuLabel>
                                {(['ADMIN', 'CANDIDATE', 'VOLUNTEER', 'VOTER'] as Role[]).map(r => (
                                  <DropdownMenuItem key={r} onClick={() => handleRoleChange(user.id, r)} disabled={user.role === r}>
                                    Set as {r}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs font-normal">Change Status</DropdownMenuLabel>
                                {(['Active', 'Suspended', 'Pending Verification'] as UserStatus[]).map(s => (
                                  <DropdownMenuItem key={s} onClick={() => handleStatusChange(user.id, s)} disabled={user.status === s}>
                                    Set as {s}
                                  </DropdownMenuItem>
                                ))}
                                {user.role === 'CANDIDATE' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleVerificationToggle(user.id)}>
                                      {user.verified ? 'Unverify Candidate' : 'Verify Candidate'}
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredAdminUsers.length === 0 && <p className="text-center text-muted-foreground py-4">No users match your filters.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content_moderation">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquareWarning className="mr-2 h-5 w-5 text-primary" /> Content Moderation Queue
                </CardTitle>
                <CardDescription>Review reported content and take action. Changes are client-side only.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search content or reporter..."
                      value={contentSearchTerm}
                      onChange={(e) => setContentSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={contentTypeFilter} onValueChange={(value) => setContentTypeFilter(value as 'all' | ReportedContentItem['contentType'])}>
                    <SelectTrigger><SelectValue placeholder="Filter by Content Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {(['Post', 'Comment', 'Profile'] as ReportedContentItem['contentType'][]).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={contentStatusFilter} onValueChange={(value) => setContentStatusFilter(value as ReportedContentStatus | 'all')}>
                    <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {(['Pending', 'Approved', 'Rejected'] as ReportedContentStatus[]).map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Content Snippet</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReportedContent.map(item => (
                        <TableRow key={item.id}>
                          <TableCell><Badge variant="outline">{item.contentType}</Badge></TableCell>
                          <TableCell>{item.reportedBy}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.reason}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.contentSnippet}</TableCell>
                          <TableCell>{format(parseISO(item.timestamp), "PPp")}</TableCell>
                          <TableCell><Badge variant={getContentStatusBadgeVariant(item.status)}>{item.status}</Badge></TableCell>
                          <TableCell>
                             <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Moderation Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleContentStatusChange(item.id, 'Approved')} disabled={item.status === 'Approved'}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />Approve Content
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleContentStatusChange(item.id, 'Rejected')} disabled={item.status === 'Rejected'}>
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" />Reject Content
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={() => toast({title: "Action: Warn User", description: `User ${item.reportedBy} (conceptually) warned.`})}>
                                   <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500"/>Warn User (Simulated)
                                </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => toast({title: "Action: Ban User", description: `User ${item.reportedBy} (conceptually) banned.`})}>
                                    <Users className="mr-2 h-4 w-4 text-red-500"/>Ban User (Simulated)
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredReportedContent.length === 0 && <p className="text-center text-muted-foreground py-4">No content matches your filters.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="election_data">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GanttChartSquare className="mr-2 h-5 w-5 text-primary" />
                  Election Event Management
                </CardTitle>
                <CardDescription>Manage election timeline events. Changes are client-side only.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="mb-4 flex justify-between items-center p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search events..."
                        value={eventSearchTerm}
                        onChange={(e) => setEventSearchTerm(e.target.value)}
                        className="max-w-sm"
                        />
                        <Select value={eventTypeFilter} onValueChange={(value) => setEventTypeFilter(value as ElectionEventType | 'all')}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Type" /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {(['Deadline', 'Key Event', 'Election Day'] as ElectionEventType[]).map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => openEventDialog()}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
                    </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredElectionEvents.map(event => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{format(parseISO(event.date), "PPP")}</TableCell>
                          <TableCell><Badge variant={getEventTypeBadgeVariant(event.type)}>{event.type}</Badge></TableCell>
                          <TableCell className="max-w-md truncate">{event.description}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => openEventDialog(event)} className="mr-2">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredElectionEvents.length === 0 && <p className="text-center text-muted-foreground py-4">No events match your filters.</p>}
                 <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                        <DialogTitle>{editingEventId ? 'Edit' : 'Add New'} Election Event</DialogTitle>
                        <DialogDescription>
                            {editingEventId ? 'Modify the details of the election event.' : 'Provide details for the new election event.'}
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="event-title">Title</Label>
                            <Input id="event-title" name="title" value={currentEvent?.title || ''} onChange={handleEventFormChange} />
                        </div>
                        <div>
                            <Label htmlFor="event-date">Date</Label>
                            <Input id="event-date" name="date" type="date" value={currentEvent?.date ? format(parseISO(currentEvent.date), 'yyyy-MM-dd') : ''} onChange={handleEventFormChange} />
                        </div>
                        <div>
                            <Label htmlFor="event-type">Type</Label>
                            <Select name="type" value={currentEvent?.type || ''} onValueChange={handleEventSelectChange}>
                                <SelectTrigger id="event-type">
                                    <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(['Deadline', 'Key Event', 'Election Day'] as ElectionEventType[]).map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="event-description">Description</Label>
                            <Textarea id="event-description" name="description" value={currentEvent?.description || ''} onChange={handleEventFormChange} />
                        </div>
                        </div>
                        <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEvent}>Save Event</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Card className="mt-6 shadow-inner bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Candidate & Campaign Data (Placeholders)</CardTitle>
                        <CardDescription>These sections would involve direct database interactions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <h4 className="font-semibold">Manage Candidate Profiles</h4>
                            <p className="text-sm text-muted-foreground">Update details, party affiliations, regions. Approve new candidate signups. (Not implemented)</p>
                            <Button variant="secondary" size="sm" className="mt-1" disabled>Manage Candidates</Button>
                        </div>
                         <div>
                            <h4 className="font-semibold">Manage Campaign Pages</h4>
                            <p className="text-sm text-muted-foreground">Approve new campaigns, manage content, monitor activity. (Not implemented)</p>
                            <Button variant="secondary" size="sm" className="mt-1" disabled>Manage Campaigns</Button>
                        </div>
                    </CardContent>
                </Card>
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
                <CardDescription>View key metrics and platform usage statistics for insights and reporting. (Placeholder)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                  <li>Dashboard with key metrics: active users, new signups, post interactions.</li>
                  <li>Track volunteer signup rates, areas of interest, and campaign assignments.</li>
                  <li>View popular candidates, trending campaigns, and manifesto summary usage.</li>
                  <li>Analyze content performance: views, likes, shares on posts and campaign updates.</li>
                  <li>Generate reports on user demographics, engagement, and platform growth.</li>
                </ul>
                <p className="mt-4 text-sm text-center text-muted-foreground italic">Charts and detailed analytics would be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequiredAuth>
  );
}
