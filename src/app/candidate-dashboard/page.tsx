
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link'; // Added Link
import { RequiredAuth } from '@/components/auth/RequiredAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockMonitoredVolunteers } from '@/lib/mockData';
import type { MonitoredVolunteer, GroupChat } from '@/types';
import { LayoutDashboard, Users, Filter, Search as SearchIcon, MessageSquarePlus, Eye } from 'lucide-react'; // Added Eye
import { CreateGroupChatForm, type CreateGroupChatFormData } from '@/components/forms/CreateGroupChatForm';
import { INTEREST_AREAS } from '@/lib/constants'; // Import INTEREST_AREAS

// Use INTEREST_AREAS for labels
function getInterestLabel(interestKey: string): string {
  const foundArea = INTEREST_AREAS.find(area => area.id === interestKey);
  return foundArea ? foundArea.label : interestKey.charAt(0).toUpperCase() + interestKey.slice(1).replace(/_/g, ' ');
}

function getStatusColor(status: MonitoredVolunteer['status']): string {
  switch (status) {
    case 'Active':
      return 'bg-green-500';
    case 'Pending Review':
      return 'bg-yellow-500';
    case 'Inactive':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export default function CandidateDashboardPage() {
  const [volunteers, setVolunteers] = useState<MonitoredVolunteer[]>(mockMonitoredVolunteers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [isCreateGroupChatOpen, setIsCreateGroupChatOpen] = useState(false);
  const [createdGroupChats, setCreatedGroupChats] = useState<GroupChat[]>([]); 

  // Use INTEREST_AREAS for the filter dropdown options
  const uniqueInterests = useMemo(() => {
    return ['all', ...INTEREST_AREAS.map(area => area.id)];
  }, []);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(volunteer => {
      const matchesSearch =
        volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (volunteer.email && volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
      const matchesInterest = interestFilter === 'all' || volunteer.interests.includes(interestFilter);
      return matchesSearch && matchesStatus && matchesInterest;
    });
  }, [volunteers, searchTerm, statusFilter, interestFilter]);

  const handleCreateGroupChat = (formData: CreateGroupChatFormData) => {
    const newGroupChat: GroupChat = {
      id: `gc-${Date.now()}`,
      name: formData.groupName,
      candidateId: 'current-candidate-id', 
      volunteerMemberIds: formData.volunteerIds,
      createdAt: new Date().toISOString(),
    };
    setCreatedGroupChats(prev => [...prev, newGroupChat]);
    console.log('New Group Chat Created:', newGroupChat);
    setIsCreateGroupChatOpen(false); 
  };

  return (
    <RequiredAuth allowedRoles={['CANDIDATE']} redirectTo='/'>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold flex items-center">
            <LayoutDashboard className="mr-3 h-7 w-7 text-primary" />
            Candidate Dashboard
            </h1>
            <Dialog open={isCreateGroupChatOpen} onOpenChange={setIsCreateGroupChatOpen}>
            <DialogTrigger asChild>
                <Button>
                <MessageSquarePlus className="mr-2 h-4 w-4" /> Create Group Chat
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle>Create New Group Chat</DialogTitle>
                <DialogDescription>
                    Organize volunteers by creating targeted group chats based on their interests.
                </DialogDescription>
                </DialogHeader>
                <CreateGroupChatForm
                    volunteers={volunteers.filter(v => v.status === 'Active')} 
                    onSubmitSuccess={handleCreateGroupChat}
                    onOpenChange={setIsCreateGroupChatOpen}
                />
            </DialogContent>
            </Dialog>
        </div>
        <p className="text-muted-foreground">
          Monitor volunteers, manage communications, and organize your campaign efforts.
        </p>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Volunteer Roster
            </CardTitle>
            <CardDescription>View and filter your volunteer signups. Select active volunteers to add to group chats.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-card">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search volunteers"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger aria-label="Filter by status">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={interestFilter} onValueChange={setInterestFilter}>
                <SelectTrigger aria-label="Filter by interest">
                  <SelectValue placeholder="Filter by Interest" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueInterests.map(interestKey => (
                    <SelectItem key={interestKey} value={interestKey}>
                      {interestKey === 'all' ? 'All Interests' : getInterestLabel(interestKey)}
                    </SelectItem>
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
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Interests</TableHead>
                    <TableHead className="hidden lg:table-cell">Availability</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolunteers.length > 0 ? (
                    filteredVolunteers.map(volunteer => (
                      <TableRow key={volunteer.id}>
                        <TableCell className="font-medium">{volunteer.fullName}</TableCell>
                        <TableCell>{volunteer.email || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{volunteer.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {volunteer.interests.map(interestKey => (
                              <Badge key={interestKey} variant="secondary" className="text-xs">
                                {getInterestLabel(interestKey)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{volunteer.availability}</TableCell>
                        <TableCell>
                          <Badge
                            className={`text-white text-xs ${getStatusColor(volunteer.status)}`}
                          >
                            {volunteer.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No volunteers found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
             {filteredVolunteers.length > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                    Displaying {filteredVolunteers.length} of {volunteers.length} total volunteers.
                </p>
            )}
          </CardContent>
        </Card>

        
        {createdGroupChats.length > 0 && (
            <Card className="shadow-md mt-6">
                <CardHeader>
                    <CardTitle>Created Group Chats</CardTitle>
                    <CardDescription>Overview of group chats you've initiated. Click to view (placeholder).</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {createdGroupChats.map(chat => (
                            <li key={chat.id} className="text-sm p-3 border rounded-md hover:bg-muted/50 transition-colors">
                                <Link href={`/chat/${chat.id}?name=${encodeURIComponent(chat.name)}`} legacyBehavior>
                                  <a className="flex justify-between items-center">
                                    <div>
                                      <span className="font-semibold">{chat.name}</span>
                                      <span className="text-muted-foreground"> ({chat.volunteerMemberIds.length} member(s))</span>
                                    </div>
                                    <Eye className="h-4 w-4 text-primary" />
                                  </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        )}

      </div>
    </RequiredAuth>
  );
}
