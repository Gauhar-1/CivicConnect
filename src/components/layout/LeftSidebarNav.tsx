
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
import { NAV_LINKS } from '@/lib/constants'; // ADMIN_NAV_LINK removed
import { Button } from '@/components/ui/button';
import { LogOut, Vote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// import { ShowIfAuth } from '../auth/RequiredAuth'; // Admin link removed

export function LeftSidebarNav() {
  const pathname = usePathname();
  const { user, logout, role } = useAuth();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="items-center justify-center p-4 hidden md:flex">
      </SidebarHeader>
      <SidebarContent className="p-2 mt-9">
        <SidebarMenu>
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
          {/* Admin link removed as login is disabled for now */}
          {/* <ShowIfAuth roles={['ADMIN']}>
            <SidebarMenuItem>
                <Link href={ADMIN_NAV_LINK.href} legacyBehavior passHref>
                    <SidebarMenuButton
                    isActive={pathname === ADMIN_NAV_LINK.href || pathname.startsWith(ADMIN_NAV_LINK.href)}
                    tooltip={{ children: ADMIN_NAV_LINK.label, className: "whitespace-nowrap" }}
                    className="justify-start"
                    >
                    <ADMIN_NAV_LINK.icon className="h-5 w-5" />
                    <span>{ADMIN_NAV_LINK.label}</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </ShowIfAuth> */}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
       {/* Logout button removed as login is disabled */}
       {/* {user && (
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        )} */}
      </SidebarFooter>
    </Sidebar>
  );
}
