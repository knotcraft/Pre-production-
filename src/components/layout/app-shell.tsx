'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  const isPersonalizePage = pathname === '/personalize';

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push('/login');
    }
     if (!loading && user && isAuthPage) {
      router.push('/');
    }
  }, [user, loading, router, isAuthPage, pathname]);

  if (loading || (!user && !isAuthPage)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthPage || (isPersonalizePage && user)) {
    return <>{children}</>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="text-foreground transition-colors duration-300">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-x-hidden bg-background shadow-2xl pb-28">
        <main>{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
