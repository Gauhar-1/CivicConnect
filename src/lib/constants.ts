
import type { LucideIcon } from 'lucide-react';
import { Home, Users, CalendarDays, FileText, AlertTriangle, Search, Vote, HandHeart, ShieldCheck } from 'lucide-react';

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

export const ADMIN_NAV_LINK: NavLink = {
  href: '/admin',
  label: 'Admin Panel',
  icon: ShieldCheck,
};

export const APP_NAME = 'CivicConnect';
export const APP_ICON = Vote;
