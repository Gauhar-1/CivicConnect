
export type Role = 'ADMIN' | 'CANDIDATE' | 'VOLUNTEER' | 'VOTER' | 'ANONYMOUS';

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

export interface Candidate {
  dataAiHint: string;
  id: string;
  name: string;
  party: string;
  region: string;
  imageUrl?: string;
  keyPolicies: string[];
  manifestoUrl?: string;
  profileBio?: string;
}

export interface FeedPost {
  dataAiHintPost: string;
  dataAiHintCandidate: string;
  id: string;
  candidateName: string;
  candidateParty?: string;
  candidateRole?: string;
  candidateImageUrl?: string;
  timestamp: string;
  content: string;
  postImageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface ElectionEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'Deadline' | 'Key Event' | 'Election Day';
}

export interface Campaign {
  dataAiHint: string;
  id: string;
  name: string;
  party?: string;
  imageUrl?: string;
  description: string;
  location: string;
  popularityScore: number;
  category: 'Local' | 'State' | 'National';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Submitted' | 'In Review' | 'Resolved' | 'Rejected';
  dateSubmitted: string;
  isAnonymous: boolean;
  attachments?: { name: string; url: string }[];
}

export interface VolunteerSignup {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  volunteerTarget: 'general' | 'candidate';
  specificCandidateName?: string;
  interests: string[];
  availability: string;
  message?: string;
  submittedAt: string;
}
