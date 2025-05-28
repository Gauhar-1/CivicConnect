export interface Candidate {
  id: string;
  name: string;
  party: string;
  region: string;
  imageUrl?: string;
  keyPolicies: string[];
  manifestoUrl?: string; // Link to full manifesto or page
  profileBio?: string;
}

export interface FeedPost {
  id: string;
  candidateName: string;
  candidateParty?: string;
  candidateRole?: string; // e.g., "Candidate for Mayor"
  candidateImageUrl?: string;
  timestamp: string; // ISO date string
  content: string;
  postImageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface ElectionEvent {
  id: string;
  title: string;
  date: string; // Could be Date object or string
  description: string;
  type: 'Deadline' | 'Key Event' | 'Election Day';
}

export interface Campaign {
  id: string;
  name: string;
  party?: string;
  imageUrl?: string;
  description: string;
  location: string;
  popularityScore: number; // For sorting
  category: 'Local' | 'State' | 'National';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Submitted' | 'In Review' | 'Resolved' | 'Rejected';
  dateSubmitted: string; // ISO date string
  isAnonymous: boolean;
  attachments?: { name: string; url: string }[];
}
