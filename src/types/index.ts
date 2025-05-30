
export type Role = 'ADMIN' | 'CANDIDATE' | 'VOLUNTEER' | 'VOTER' | 'ANONYMOUS';

export interface User {
  uid: string; 
  phone: string | null; 
  email?: string | null; 
  role: Role;
  name?: string;
  regionId?: string; 
  photoURL?: string | null; 
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
  dataAiHintPost?: string; 
  dataAiHintCandidate?: string; 
  id: string;
  // userId: string; // Temporarily removed as login is disabled
  candidateName: string; 
  candidateParty?: string; 
  candidateRole?: string; 
  candidateImageUrl?: string; 
  timestamp: string; // ISO string or Firestore Timestamp
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
  dataAiHint?: string; 
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
  // userId: string; // Temporarily removed
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
  email?: string; 
  phone?: string; // Optional as per form
  volunteerTarget: 'general' | 'candidate';
  specificCandidateName?: string; 
  interests: string[];
  availability: string;
  message?: string;
  submittedAt: string; 
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  creatorId: string; // For now, can be a mock ID or 'anonymous'
  createdAt: string; // ISO string
  regionId?: string; // Optional
}


// Firestore specific types (matching collection names)
export interface FirestoreUser { // /users/{uid}
  uid: string;
  phone: string | null;
  email?: string | null;
  name?: string;
  regionId?: string;
  photoURL?: string | null;
  createdAt: string; 
}

export interface FirestoreRole { // /roles/{uid}
  uid: string;
  role: Role;
  updatedAt: string; 
}
