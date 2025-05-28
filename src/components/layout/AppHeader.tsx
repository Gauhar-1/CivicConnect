import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Vote } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Vote className="h-7 w-7" />
          <span>CivicConnect</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Desktop Navigation (optional, if needed beyond sidebar) */}
        {/* <nav className="hidden md:flex gap-4">
          {NAV_LINKS.slice(0,3).map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav> */}
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
          <AvatarFallback>CC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
