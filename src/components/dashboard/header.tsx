
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell, User as UserIcon } from 'lucide-react';
import { CountdownTimer } from '@/components/dashboard/countdown-timer';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useFirebase } from '@/firebase';
import { ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type UserData = {
    name: string;
    partnerName: string;
    weddingDate: string;
    heroImage?: string;
};

export function Header() {
  const { user } = useUser();
  const { database } = useFirebase();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && database) {
      setLoading(true);
      const userRef = ref(database, 'users/' + user.uid);
      const unsubscribeUser = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val() as UserData);
        }
        setLoading(false);
      });
      
      const notifRef = ref(database, `notifications/${user.uid}`);
      const unsubscribeNotifs = onValue(notifRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const notifsArray: { read: boolean }[] = Object.values(data);
            setUnreadCount(notifsArray.filter(n => !n.read).length);
        } else {
            setUnreadCount(0);
        }
      });

      return () => {
        unsubscribeUser();
        unsubscribeNotifs();
      };
    } else if (!user) {
        setLoading(false);
    }
  }, [user, database]);

  const defaultHeroImage = PlaceHolderImages.find(img => img.id === 'wedding-hero');
  const heroImageSrc = userData?.heroImage || defaultHeroImage?.imageUrl;

  return (
    <div className="relative h-80 w-full overflow-hidden">
      {heroImageSrc && (
        <Image
          src={heroImageSrc}
          alt={defaultHeroImage?.description || "Wedding hero image"}
          data-ai-hint={defaultHeroImage?.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          {loading ? (
            <Skeleton className="h-8 w-48 bg-white/30" />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {userData ? `${userData.name} & ${userData.partnerName}` : 'Our Big Day'}
            </h1>
          )}
          <div className="flex items-center gap-2">
             <Link href="/notifications" passHref>
                <Button variant="ghost" size="icon" className="relative text-white bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 hover:text-white">
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
            </Link>
            <Link href="/settings" passHref>
                <Button variant="ghost" size="icon" className="text-white bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 hover:text-white">
                  <UserIcon />
                  <span className="sr-only">Settings</span>
                </Button>
            </Link>
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-24 w-full rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm" />
        ) : (
          userData?.weddingDate && <CountdownTimer targetDate={userData.weddingDate} />
        )}
      </div>
    </div>
  );
}
