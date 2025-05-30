
import type { LucideIcon } from 'lucide-react';
import { Home, Users, CalendarDays, FileText, Search, Vote, HandHeart } from 'lucide-react';
// AlertTriangle (for Report an Issue) removed
// ListPlus (for Create Poll) removed as it's no longer a direct nav link

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home (Feed)', icon: Home },
  { href: '/candidates', label: 'Candidate Directory', icon: Users },
  { href: '/timeline', label: 'Election Timeline', icon: CalendarDays },
  { href: '/manifesto-summarizer', label: 'Manifesto Summaries', icon: FileText },
  // { href: '/report', label: 'Report an Issue', icon: AlertTriangle }, // Removed this link
  { href: '/campaigns', label: 'Campaign Discovery', icon: Search },
  { href: '/volunteer-signup', label: 'Volunteer Signup', icon: HandHeart },
  // { href: '/polls/create', label: 'Create Poll', icon: ListPlus }, // Removed this link
];


export const APP_NAME = 'CivicConnect';
export const APP_ICON = Vote;

