
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { NAV_LINKS } from '@/lib/constants'; 
import { Button } from '@/components/ui/button';
import { LogOut, Vote, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateMenu } from './CreateMenu'; 
import { useState } from 'react';
import type { FeedPost, Campaign } from '@/types'; // Import types for props

export function LeftSidebarNav() {
  const pathname = usePathname();
  const { user, logout, role } = useAuth();
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  // These handlers would ideally be passed from the page components or a context
  // For now, as a quick solution, we're defining them here and passing them down.
  // This is not ideal for state management but works for this iteration.
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]); // Local state for demonstration
  const [campaigns, setCampaigns] = useState<Campaign[]>([]); // Local state for demonstration

  const handleCreatePost = (newPost: FeedPost) => {
    // In a real app, this would interact with a global state or a context API
    // to update the feed on the main page.
    console.log('New post from sidebar create:', newPost);
    // setFeedPosts(prev => [newPost, ...prev]); // This won't update HomePage's state
  };

  const handleCreateCampaign = (newCampaign: Campaign) => {
     console.log('New campaign from sidebar create:', newCampaign);
    // setCampaigns(prev => [newCampaign, ...prev]); // This won't update CampaignPage's state
  };


  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="items-center justify-center p-4 hidden md:flex">
      </SidebarHeader>
      <SidebarContent className="p-2 mt-9">
        <SidebarMenu>
          <SidebarMenuItem>
             <CreateMenu 
              onPostCreated={handleCreatePost} 
              onCampaignCreated={handleCreateCampaign}
             >
                <SidebarMenuButton
                    variant="default"
                    className="justify-start w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    tooltip={{ children: "Create Content", className: "whitespace-nowrap" }}
                >
                    <PlusCircle className="h-5 w-5" />
                    <span>Create</span>
                </SidebarMenuButton>
             </CreateMenu>
          </SidebarMenuItem>

          {NAV_LINKS.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))}
                  tooltip={{ children: link.label, className: "whitespace-nowrap" }}
                  className="justify-start"
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
      </SidebarFooter>
    </Sidebar>
  );
}
