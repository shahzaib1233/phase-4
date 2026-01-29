import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  user?: {
    name: string;
    email: string;
  };
  onSignOut?: () => void;
}

export const Sidebar = ({ user, onSignOut }: SidebarProps) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <span>📊</span>,
    },
    {
      name: 'Tasks',
      href: '/dashboard/tasks',
      icon: <span>✅</span>,
    },
    {
      name: 'Completed',
      href: '/dashboard/completed',
      icon: <span>✅</span>,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: <span>⚙️</span>,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-background md:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="text-xl">📋</span>
            <span>TodoApp</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t p-4">
          {user && (
            <div className="mb-4">
              <p className="text-sm font-medium">{user.name || user.email}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={onSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};