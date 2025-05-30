
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
// CreateMenu and related imports removed

export function LeftSidebarNav() {
  const pathname = usePathname();

  // CreateMenu and its related state/handlers have been removed.
  // Creation will now be initiated from the HomePage.

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="items-center justify-center p-4 hidden md:flex">
      </SidebarHeader>
      <SidebarContent className="p-2 mt-9">
        <SidebarMenu>
          {/* CreateMenu trigger button removed from here */}
          {NAV_LINKS.map((link) => {
            // Hide "Create Poll" link if it exists, as poll creation is now part of HomePage icons
            if (link.href === '/polls/create' && link.label === 'Create Poll') {
                 // It's already removed from NAV_LINKS by a later change, but this is defensive.
                return null;
            }
            return (
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
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
      </SidebarFooter>
    </Sidebar>
  );
}
