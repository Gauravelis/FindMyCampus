'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  Heart,
  GitCompareArrows,
  Info,
  Home,
  User,
  LogIn,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    // Check localStorage for auth status
    const status = localStorage.getItem('isAuthenticated');
    setAuthStatus(status);
    if (status) {
      const storedUsername = localStorage.getItem('username');
      if (status === 'admin') {
        setUser({ name: 'Admin', email: 'admin@findmycampus.local' });
      } else if (storedUsername) {
        setUser({
          name: storedUsername,
          email: `${storedUsername.toLowerCase()}@findmycampus.local`,
        });
      }
    } else {
      setUser(null);
    }
  }, [pathname, authStatus]);

  const isAdmin = authStatus === 'admin';
  const isAuthenticated = authStatus === 'user' || isAdmin;

  const showNav =
    !isAdminRoute && !pathname.startsWith('/login') && !pathname.startsWith('/signup');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    setAuthStatus(null);
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/compare', label: 'Compare', icon: GitCompareArrows },
    { href: '/favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font.headline font-bold">
              FindMyCampus
            </span>
          </Link>
          {showNav && (
            <nav className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
                    pathname === link.href && 'text-primary'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isAuthenticated && showNav ? (
            <Button asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          ) : null}
          {isAuthenticated && (
            <>
              {isAdmin && !isAdminRoute && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
