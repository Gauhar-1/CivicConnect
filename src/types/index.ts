
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
  creatorName: string; 
  creatorImageUrl?: string;
  creatorDataAiHint?: string;
}

export interface TextPostFeedItem extends BaseFeedItem {
  itemType: 'text_post';
  content: string;
}

export interface ImagePostFeedItem extends BaseFeedItem {
  itemType: 'image_post';
  content?: string; 
  mediaUrl: string; 
  mediaDataAiHint?: string;
}

export interface VideoPostFeedItem extends BaseFeedItem {
  itemType: 'video_post';
  content?: string; 
  mediaUrl: string; 
  mediaDataAiHint?: string;
}

export interface CampaignFeedItem extends BaseFeedItem {
  itemType: 'campaign_created';
  campaignId: string; 
  campaignName: string;
  campaignLocation?: string;
  campaignDescription?: string;
}

export interface PollOption {
  id: string; 
  text: string;
  votes: number;
}

export interface PollFeedItem extends BaseFeedItem {
  itemType: 'poll_created';
  pollId: string; 
  pollQuestion: string;
  pollOptions: PollOption[]; 
  totalVotes: number;
  userHasVoted?: boolean;
}

export type FeedItem = TextPostFeedItem | ImagePostFeedItem | VideoPostFeedItem | CampaignFeedItem | PollFeedItem;


export interface OldFeedPost {
  dataAiHintPost?: string;
  dataAiHintCandidate?: string;
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

export interface MonitoredVolunteer extends VolunteerSignup {
  status: 'Active' | 'Pending Review' | 'Inactive';
}


export interface Poll {
  id: string;
  question: string;
  options: PollOption[]; 
  creatorId: string;
  createdAt: string;
  regionId?: string;
}

export interface GroupChat {
  id: string;
  name: string;
  candidateId: string; // Assuming a candidate creates/owns the chat
  volunteerMemberIds: string[];
  createdAt: string;
}


export interface FirestoreUser { 
  uid: string;
  phone: string | null;
  email?: string | null;
  name?: string;
  regionId?: string;
  photoURL?: string | null;
  createdAt: string;
}

export interface FirestoreRole { 
  uid: string;
  role: Role;
  updatedAt: string;
}
