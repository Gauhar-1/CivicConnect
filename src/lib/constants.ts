import type { LucideIcon } from 'lucide-react';
import { Home, Users, CalendarDays, FileText, AlertTriangle, Search, Vote, HandHeart } from 'lucide-react';

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
  { href: '/report', label: 'Report an Issue', icon: AlertTriangle },
  { href: '/campaigns', label: 'Campaign Discovery', icon: Search },
  { href: '/volunteer-signup', label: 'Volunteer Signup', icon: HandHeart },
];

export const APP_NAME = 'CivicConnect';
export const APP_ICON = Vote;
