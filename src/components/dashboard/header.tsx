
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell, User as UserIcon, CheckCheck } from 'lucide-react';
import { CountdownTimer } from '@/components/dashboard/countdown-timer';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useFirebase } from '@/firebase';
import { ref, onValue, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Notification } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

type UserData = {
    name: string;
    partnerName: string;
    weddingDate: string;
    heroImage?: string;
};

export function Header() {
  const { user } = useUser();
  const { database } = useFirebase();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
            const notifsArray: Notification[] = Object.entries(data)
                .map(([id, notif]) => ({ id, ...(notif as any) }))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            setNotifications(notifsArray);
            setUnreadCount(notifsArray.filter(n => !n.read).length);
        } else {
            setNotifications([]);
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

  const handleNotificationClick = (notification: Notification) => {
    if (!user || !database) return;
    if (!notification.read) {
      update(ref(database, `notifications/${user.uid}/${notification.id}`), { read: true });
    }
    router.push(notification.link);
  }

  const handleMarkAllRead = () => {
      if (!user || !database || unreadCount === 0) return;
      const updates: { [key: string]: any } = {};
      notifications.forEach(n => {
          if (!n.read) {
              updates[`/notifications/${user.uid}/${n.id}/read`] = true;
          }
      });
      update(ref(database), updates);
  }

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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 hover:text-white">
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-2">
                  <div className="flex items-center justify-between p-2">
                      <h3 className="font-bold">Notifications</h3>
                      {unreadCount > 0 && (
                          <Button variant="link" size="sm" onClick={handleMarkAllRead} className="text-xs p-0 h-auto">
                              <CheckCheck className="mr-1 h-3 w-3" />
                              Mark all as read
                          </Button>
                      )}
                  </div>
                  <Separator className="mb-2" />
                  {notifications.length > 0 ? (
                      <ScrollArea className="h-auto max-h-80">
                          <div className="flex flex-col gap-1">
                              {notifications.map(notif => (
                                  <button
                                      key={notif.id}
                                      onClick={() => handleNotificationClick(notif)}
                                      className={cn(
                                          "flex items-start gap-3 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent",
                                          !notif.read && "bg-primary/10"
                                      )}
                                  >
                                      {!notif.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                                      <p className={cn("flex-1", !notif.read ? "font-semibold text-foreground" : "text-muted-foreground")}>{notif.message}</p>
                                  </button>
                              ))}
                          </div>
                      </ScrollArea>
                  ) : (
                      <p className="p-4 text-center text-sm text-muted-foreground">No new notifications.</p>
                  )}
              </PopoverContent>
            </Popover>
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
