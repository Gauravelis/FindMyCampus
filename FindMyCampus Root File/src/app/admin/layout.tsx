'use client';

import React, { useState, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  GraduationCap,
  LogOut,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // This is a placeholder for actual authentication
    // In a real app, you would verify a token or session
    const isAuthenticated = true; 
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);

  // Mock user and logout
  const user = { name: 'Admin User', email: 'admin@findmycampus.local' };
  const handleLogout = () => {
    // In a real app, this would clear the session/token
    router.push('/login');
  };
  
  if (!isClient) {
    return (
      <div className="flex">
        <Skeleton className="h-screen w-64" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full mt-4" />
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font.headline font-bold">
              FindMyCampus
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {isClient && (
            <SidebarMenu>
              <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild
                      tooltip={{ children: 'Visit Site' }}
                  >
                      <a href="/">
                          <Home />
                          <span>Visit Site</span>
                      </a>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin'}
                  tooltip={{ children: 'Dashboard' }}
                >
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
             <Avatar>
                <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
                <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold text-sm">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
           <Button variant="ghost" onClick={handleLogout} className="justify-start w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </SidebarProvider>
  );
}
