
'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useState, useEffect } from 'react';
import { useUser, useFirebase } from '@/firebase';
import { ref, get } from 'firebase/database';
import { Skeleton } from '@/components/ui/skeleton';

function AppLoadingSkeleton() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark shadow-2xl">
      {/* Header Skeleton */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-8 w-1/2 mx-auto" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      
      {/* Bottom Nav Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pt-2">
        <div className="flex justify-around items-center h-16">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-1 w-16">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-2 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const { database } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isProfileChecked, setIsProfileChecked] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  const isPersonalizePage = pathname === '/personalize';

  useEffect(() => {
    // If user state is still loading, we wait.
    if (userLoading) {
      return;
    }

    // If there is no user and they are not on an auth page, redirect to login.
    if (!user && !isAuthPage) {
      router.push('/login');
      return;
    }

    // If there is a user and they are on an auth page, redirect to home.
    if (user && isAuthPage) {
      router.push('/');
      return;
    }

    // If there is a user, check if their profile is personalized.
    if (user && database) {
      const checkUserProfile = async () => {
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);

        if (!snapshot.exists() && !isPersonalizePage) {
          // If profile doesn't exist and they are not on personalize page, redirect them.
          router.push('/personalize');
        } else if (snapshot.exists() && isPersonalizePage) {
          // If profile exists and they are trying to access personalize page, redirect to home.
          router.push('/');
        } else {
            // Profile check is done and user is on the correct page.
            setIsProfileChecked(true);
        }
      };

      checkUserProfile();
    } else if (!user) {
        // Not a logged in user, on an auth page, so no profile check needed.
        setIsProfileChecked(true);
    }

  }, [user, userLoading, database, router, pathname, isAuthPage, isPersonalizePage]);

  // Show a loading screen while we check for user and profile status.
  if (userLoading || (user && !isProfileChecked)) {
    return <AppLoadingSkeleton />;
  }

  // If it's an auth page or the personalize page for a new user, show only the children.
  if (isAuthPage || (isPersonalizePage && user)) {
    return <div className="animate-fade-in">{children}</div>;
  }
  
  // If no user and not an auth page, we are in a redirect state, show nothing.
  if (!user) {
    return null;
  }

  // If user is authenticated and personalized, show the full app shell.
  return (
    <div className="text-foreground transition-colors duration-300">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark shadow-2xl pb-24">
        <main className="animate-fade-in">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
