
import type { Candidate, FeedPost, ElectionEvent, Campaign, Report, Poll } from '@/types';

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

export const mockFeedPosts: FeedPost[] = [
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

export const mockElectionEvents: ElectionEvent[] = [
  {
    id: 'event1',
    title: 'Voter Registration Deadline',
    date: new Date(Date.now() + 86400000 * 7).toLocaleDateString(), // 7 days from now
    description: 'Last day to register to vote for the upcoming general election.',
    type: 'Deadline',
  },
  {
    id: 'event2',
    title: 'Mayoral Debate',
    date: new Date(Date.now() + 86400000 * 14).toLocaleDateString(), // 14 days from now
    description: 'Live televised debate between mayoral candidates.',
    type: 'Key Event',
  },
  {
    id: 'event3',
    title: 'Early Voting Begins',
    date: new Date(Date.now() + 86400000 * 21).toLocaleDateString(), // 21 days from now
    description: 'Early in-person voting locations open across the county.',
    type: 'Key Event',
  },
  {
    id: 'event4',
    title: 'General Election Day',
    date: new Date(Date.now() + 86400000 * 30).toLocaleDateString(), // 30 days from now
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

export const mockReports: Report[] = [
    {
        id: 'rep1',
        title: 'Misleading Campaign Ad',
        description: 'A TV advertisement for candidate X contains false claims about candidate Y\'s voting record.',
        category: 'False Information',
        status: 'In Review',
        dateSubmitted: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        isAnonymous: false,
    },
    {
        id: 'rep2',
        title: 'Voter Intimidation at Poll Site',
        description: 'Observed individuals harassing voters at the Elm Street polling location.',
        category: 'Election Process',
        status: 'Submitted',
        dateSubmitted: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        isAnonymous: true,
    }
];

export const mockPolls: Poll[] = [];

// Helper to get a single candidate by ID
export const getCandidateById = (id: string): Candidate | undefined => 
  mockCandidates.find(candidate => candidate.id === id);

// Helper to get a single campaign by ID
export const getCampaignById = (id: string): Campaign | undefined =>
  mockCampaigns.find(campaign => campaign.id === id);
