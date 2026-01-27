
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
  
  const [isCheckComplete, setIsCheckComplete] = useState(false);

  useEffect(() => {
    if (userLoading) {
      return; // 1. Wait for user to be loaded
    }

    const publicPages = ['/login', '/signup', '/forgot-password', '/verify-email'];
    const isPublicPage = publicPages.includes(pathname);
    
    if (user) {
      // USER IS LOGGED IN
      const isEmailPassword = user.providerData.some(p => p.providerId === 'password');
      
      // 2. Handle email verification
      if (isEmailPassword && !user.emailVerified) {
        if (pathname !== '/verify-email') {
          router.push('/verify-email');
        } else {
          setIsCheckComplete(true);
        }
        return;
      }
      
      // At this point, user is verified or uses social login.
      if (isPublicPage) {
        router.push('/');
        return;
      }

      // 3. Handle personalization
      const isPersonalizePage = pathname === '/personalize';
      const checkUserProfile = async () => {
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          if (isPersonalizePage) {
            router.push('/');
          } else {
            setIsCheckComplete(true);
          }
        } else {
          if (!isPersonalizePage) {
            router.push('/personalize');
          } else {
            setIsCheckComplete(true);
          }
        }
      };
      checkUserProfile();

    } else {
      // NO USER LOGGED IN
      if (!isPublicPage) {
        router.push('/login');
      } else {
        setIsCheckComplete(true);
      }
    }
  }, [user, userLoading, database, router, pathname]);


  if (!isCheckComplete) {
    return <AppLoadingSkeleton />;
  }

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/verify-email'].includes(pathname);
  const isPersonalizePage = pathname === '/personalize';

  if (isAuthPage || (isPersonalizePage && user)) {
    return <div className="animate-fade-in">{children}</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="text-foreground transition-colors duration-300">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark shadow-2xl pb-24">
        <main className="animate-fade-in">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
