
export type Role = 'ADMIN' | 'CANDIDATE' | 'VOLUNTEER' | 'VOTER' | 'ANONYMOUS';

export interface User {
  uid: string; // Firebase UID
  phone: string | null; // Phone number from Firebase Auth
  email?: string | null; // Email, if collected
  role: Role;
  name?: string;
  regionId?: string; // Optional, can be set post-registration
  photoURL?: string | null; // Profile picture URL
}

export interface Candidate {
  dataAiHint: string;
  id: string; // Corresponds to a User UID with 'CANDIDATE' role
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
  userId: string; // UID of the poster
  regionId?: string;
  content: string;
  mediaUrl?: string; // URL from Firebase Storage
  createdAt: string; // ISO string or Firestore Timestamp
  likes: number;
  comments: number;
  shares: number;
  candidateName?: string; // Denormalized for display
  candidateParty?: string; // Denormalized
  candidateRole?: string; // Denormalized
  candidateImageUrl?: string; // Denormalized
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
  userId: string; // UID of the reporter
  title: string;
  description: string;
  category: string;
  status: 'Submitted' | 'In Review' | 'Resolved' | 'Rejected';
  dateSubmitted: string; // ISO string or Firestore Timestamp
  isAnonymous: boolean; // If true, userId might be a generic 'anonymous_reporter_id' or handled differently
  attachments?: { name: string; url: string }[]; // URLs from Firebase Storage
}

export interface VolunteerSignup {
  id: string; // UID of the volunteer
  fullName: string;
  email?: string; // If provided
  phone: string;
  volunteerTarget: 'general' | 'candidate';
  specificCandidateId?: string; // UID of the candidate
  specificCandidateName?: string; // Denormalized
  interests: string[];
  availability: string;
  message?: string;
  submittedAt: string; // ISO string or Firestore Timestamp
}

// Firestore specific types (matching collection names)
export interface FirestoreUser { // /users/{uid}
  uid: string;
  phone: string | null;
  email?: string | null;
  name?: string;
  regionId?: string;
  photoURL?: string | null;
  createdAt: string; // ISO string or Firestore Timestamp
}

export interface FirestoreRole { // /roles/{uid}
  uid: string;
  role: Role;
  updatedAt: string; // ISO string or Firestore Timestamp
}
