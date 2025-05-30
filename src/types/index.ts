
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

interface BaseFeedItem {
  id: string;
  timestamp: string; // ISO string
  // Common fields for all feed items, like user who created it
  creatorName: string; // Simplified for now, would be userId in a real app
  creatorImageUrl?: string;
  creatorDataAiHint?: string;
}

export interface TextPostFeedItem extends BaseFeedItem {
  itemType: 'text_post';
  content: string;
}

export interface ImagePostFeedItem extends BaseFeedItem {
  itemType: 'image_post';
  content?: string; // Optional caption
  mediaUrl: string; // For uploaded image (object URL) or external image URL
  mediaDataAiHint?: string;
}

export interface VideoPostFeedItem extends BaseFeedItem {
  itemType: 'video_post';
  content?: string; // Optional caption
  mediaUrl: string; // For uploaded video (object URL)
  mediaDataAiHint?: string;
}

export interface CampaignFeedItem extends BaseFeedItem {
  itemType: 'campaign_created';
  campaignName: string;
  campaignLocation?: string;
  campaignDescription?: string;
}

export interface PollFeedItem extends BaseFeedItem {
  itemType: 'poll_created';
  pollQuestion: string;
  pollOptions?: { text: string }[];
}

export type FeedItem = TextPostFeedItem | ImagePostFeedItem | VideoPostFeedItem | CampaignFeedItem | PollFeedItem;


// This FeedPost type is from the original mockData and homepage.
// It will be replaced by the new FeedItem structure for the unified feed.
// Keeping it for reference or if some parts of the app still use it temporarily.
export interface OldFeedPost {
  dataAiHintPost?: string;
  dataAiHintCandidate?: string;
  id: string;
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
  phone?: string;
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
  creatorId: string;
  createdAt: string;
  regionId?: string;
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
