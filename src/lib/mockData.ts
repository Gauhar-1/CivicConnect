
import type { Candidate,  ElectionEvent, Campaign, Poll, VolunteerSignup, MonitoredVolunteer, FeedItem, AdminUser, Role, UserStatus, ReportedContentItem, ReportedContentStatus, ElectionEventType } from '@/types';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    party: 'Progressive Party',
    region: 'District 5',
    imageUrl: 'https://placehold.co/100x100.png?text=AW',
    dataAiHint: 'woman portrait',
    keyPolicies: ['Universal Basic Income', 'Green Energy Initiatives', 'Education Reform'],
    profileBio: 'Alice is a dedicated public servant with over 10 years of experience in community organizing and policy development. She believes in creating a more equitable and sustainable future for all residents of District 5.',
    manifestoUrl: '/candidates/1/manifesto',
  },
  {
    id: '2',
    name: 'Bob The Builder',
    party: 'Constructivist Party',
    region: 'Metro Area',
    imageUrl: 'https://placehold.co/100x100.png?text=BB',
    dataAiHint: 'man portrait',
    keyPolicies: ['Infrastructure Development', 'Affordable Housing', 'Job Creation'],
    profileBio: 'Bob has a strong background in urban planning and project management. He is committed to revitalizing the Metro Area by investing in critical infrastructure and fostering economic growth.',
    manifestoUrl: '/candidates/2/manifesto',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    party: 'Independent Alliance',
    region: 'District 2',
    imageUrl: 'https://placehold.co/100x100.png?text=CB',
    dataAiHint: 'person portrait',
    keyPolicies: ['Healthcare Access', 'Small Business Support', 'Environmental Protection'],
    profileBio: 'Charlie is an independent voice focused on common-sense solutions. With a background in healthcare administration, he aims to improve access to quality medical services and support local entrepreneurs.',
    manifestoUrl: '/candidates/3/manifesto',
  },
];

export const mockFeedPosts = [
  {
    id: 'post1',
    candidateName: 'Alice Wonderland',
    candidateParty: 'Progressive Party',
    candidateRole: 'Candidate for District 5 Council',
    candidateImageUrl: 'https://placehold.co/40x40.png?text=AW',
    dataAiHintCandidate: 'woman face',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    content: 'Excited to announce our new plan for community gardens! 🌱 Fresh food and green spaces for everyone. Read more on my website. #CommunityFirst #GreenCity',
    postImageUrl: 'https://placehold.co/600x400.png',
    dataAiHintPost: 'community garden',
    likes: 125,
    comments: 15,
    shares: 7,
  },
  {
    id: 'post2',
    candidateName: 'Bob The Builder',
    candidateParty: 'Constructivist Party',
    candidateRole: 'Candidate for Mayor',
    candidateImageUrl: 'https://placehold.co/40x40.png?text=BB',
    dataAiHintCandidate: 'man face',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    content: 'Just had a great town hall discussing infrastructure improvements. Your feedback is crucial as we build a better city together! 🏗️ #BuildBackBetter #Infrastructure',
    likes: 230,
    comments: 45,
    shares: 20,
  },
  {
    id: 'post3',
    candidateName: 'Charlie Brown',
    candidateParty: 'Independent Alliance',
    candidateRole: 'Candidate for District 2 Supervisor',
    candidateImageUrl: 'https://placehold.co/40x40.png?text=CB',
    dataAiHintCandidate: 'person face',
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    content: 'Healthcare should be a right, not a privilege. I\'m fighting for affordable and accessible healthcare for all families in District 2. Join me! #HealthcareForAll',
    postImageUrl: 'https://placehold.co/600x400.png',
    dataAiHintPost: 'hospital building',
    likes: 95,
    comments: 22,
    shares: 11,
  },
];

const today = new Date();
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const mockElectionEvents: ElectionEvent[] = [
  {
    id: 'event1',
    title: 'Voter Registration Deadline',
    date: formatDate(new Date(today.getTime() + 86400000 * 7)), // 7 days from now
    description: 'Last day to register to vote for the upcoming general election.',
    type: 'Deadline',
  },
  {
    id: 'event2',
    title: 'Mayoral Debate',
    date: formatDate(new Date(today.getTime() + 86400000 * 14)), // 14 days from now
    description: 'Live televised debate between mayoral candidates.',
    type: 'Key Event',
  },
  {
    id: 'event3',
    title: 'Early Voting Begins',
    date: formatDate(new Date(today.getTime() + 86400000 * 21)), // 21 days from now
    description: 'Early in-person voting locations open across the county.',
    type: 'Key Event',
  },
  {
    id: 'event4',
    title: 'General Election Day',
    date: formatDate(new Date(today.getTime() + 86400000 * 30)), // 30 days from now
    description: 'Polls open from 7 AM to 7 PM. Make your voice heard!',
    type: 'Election Day',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp1',
    name: 'Clean Air Now',
    party: 'Green Initiative',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'clean air nature',
    description: 'Advocating for stricter emissions standards and promoting renewable energy sources in our city.',
    location: 'Springfield',
    popularityScore: 85,
    category: 'Local',
  },
  {
    id: 'camp2',
    name: 'Tech for Tomorrow',
    party: 'Innovation Party',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'futuristic technology',
    description: 'Fostering tech education and startup growth to build a future-ready economy for our state.',
    location: 'Statewide',
    popularityScore: 92,
    category: 'State',
  },
  {
    id: 'camp3',
    name: 'Affordable Housing Project',
    party: 'Community First',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'modern apartment building',
    description: 'Working to increase the availability of affordable housing options for families and individuals.',
    location: 'Oakland District',
    popularityScore: 78,
    category: 'Local',
  },
];


export const mockPolls: Poll[] = [];

export const mockMonitoredVolunteers: MonitoredVolunteer[] = [
  {
    id: 'vol1',
    fullName: 'John Volunteer',
    email: 'john.vol@example.com',
    phone: '555-111-2222',
    volunteerTarget: 'candidate',
    specificCandidateName: 'Alice Wonderland',
    interests: ['canvassing', 'event_support'],
    availability: 'Weekends (Flexible hours)',
    message: 'Eager to help Alice win!',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    status: 'Active',
  },
  {
    id: 'vol2',
    fullName: 'Jane Helper',
    email: 'jane.help@example.com',
    phone: '555-333-4444',
    volunteerTarget: 'general',
    interests: ['phone_banking', 'data_entry', 'social_media'],
    availability: 'Weekdays - Afternoon (1pm-5pm)',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    status: 'Pending Review',
  },
  {
    id: 'vol3',
    fullName: 'Sam Supporter',
    email: 'sam.sup@example.com',
    volunteerTarget: 'candidate',
    specificCandidateName: 'Bob The Builder',
    interests: ['event_support'],
    availability: 'Fully Flexible',
    message: 'Ready to support Bob in any way possible.',
    submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    status: 'Active',
  },
  {
    id: 'vol4',
    fullName: 'Casey Canvasser',
    email: 'casey.canvass@example.com',
    phone: '555-888-9999',
    volunteerTarget: 'candidate',
    specificCandidateName: 'Alice Wonderland',
    interests: ['canvassing', 'social_media'],
    availability: 'Weekdays - Evening (6pm-9pm)',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: 'Pending Review',
  },
  {
    id: 'vol5',
    fullName: 'Alex Admin',
    email: 'alex.admin@example.com',
    volunteerTarget: 'general',
    interests: ['data_entry'],
    availability: 'Weekdays - Morning (9am-12pm)',
    message: 'Good with spreadsheets and organizing data.',
    submittedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    status: 'Inactive',
  }
];


// Helper to get a single candidate by ID
export const getCandidateById = (id: string): Candidate | undefined => 
  mockCandidates.find(candidate => candidate.id === id);

// Helper to get a single campaign by ID
export const getCampaignById = (id: string): Campaign | undefined =>
  mockCampaigns.find(campaign => campaign.id === id);

// Initial feed items transformation including new interaction counts
export const initialFeedItems: FeedItem[] = mockFeedPosts.map((post): FeedItem => {
  const baseItem = {
    id: post.id,
    timestamp: post.timestamp,
    creatorName: post.candidateName,
    creatorImageUrl: post.candidateImageUrl,
    creatorDataAiHint: post.dataAiHintCandidate,
    likes: post.likes || 0,
    comments: post.comments || 0,
    shares: post.shares || 0,
  };

  if (post.postImageUrl) {
    return {
      ...baseItem,
      itemType: 'image_post',
      content: post.content,
      mediaUrl: post.postImageUrl,
      mediaDataAiHint: post.dataAiHintPost,
    };
  }
  return {
    ...baseItem,
    itemType: 'text_post',
    content: post.content,
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


export const mockAdminUsers: AdminUser[] = [
  { id: 'admin-001', name: 'Adeline Min', email: 'adeline.m@example.com', role: 'ADMIN', status: 'Active' },
  { id: 'user-001', name: 'Bernard Voter', email: 'b.voter@example.com', role: 'VOTER', status: 'Active' },
  { id: 'cand-001', name: 'Cynthia Date', email: 'c.date.campaign@example.com', role: 'CANDIDATE', status: 'Active', verified: true },
  { id: 'vol-001', name: 'David Helper', email: 'd.helper@example.com', role: 'VOLUNTEER', status: 'Pending Verification' },
  { id: 'user-002', name: 'Eleanor Suspended', email: 'e.suspended@example.com', role: 'VOTER', status: 'Suspended' },
  { id: 'cand-002', name: 'Frank Prospect', email: 'f.prospect@example.com', role: 'CANDIDATE', status: 'Pending Verification', verified: false },
  { id: 'user-003', name: 'George Active', email: 'g.active@example.com', role: 'VOTER', status: 'Active' },
];

export const mockReportedContent: ReportedContentItem[] = [
  {
    id: 'report-001',
    contentType: 'Post',
    reportedBy: 'Bernard Voter (user-001)',
    reason: 'Misinformation regarding polling locations.',
    contentSnippet: 'PSA: All polling stations in District 5 will now be open until 9 PM! Make sure to tell your friends...',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    status: 'Pending',
    targetContentId: 'post-xyz-123',
    targetUserId: 'user-abc-789',
  },
  {
    id: 'report-002',
    contentType: 'Comment',
    reportedBy: 'Adeline Min (admin-001)',
    reason: 'Hate speech and abusive language towards a candidate.',
    contentSnippet: 'You are all idiots if you vote for @Candice Date! She is a **** and a ****!',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    status: 'Rejected', // Example of an action already taken
    targetContentId: 'comment-qrs-456',
    targetUserId: 'user-def-456',
  },
  {
    id: 'report-003',
    contentType: 'Profile',
    reportedBy: 'System Flag',
    reason: 'Profile impersonating a public figure.',
    contentSnippet: 'Official Profile of Mayor McCheese. Endorsing Frank Prospect.',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    status: 'Approved', // Example: Maybe admin reviewed and confirmed it's a fan page not impersonation
    targetContentId: 'profile-jkl-789',
    targetUserId: 'user-ghi-123',
  },
];
