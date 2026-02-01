
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useFirebase } from '@/firebase';
import { ref, onValue, update } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Bell, CalendarClock, CheckCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

function NotificationSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 rounded-xl p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function NotificationsPage() {
    const { user, loading: userLoading } = useUser();
    const { database } = useFirebase();
    const router = useRouter();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (user && database) {
            setLoading(true);
            const notifRef = ref(database, `notifications/${user.uid}`);
            const unsubscribe = onValue(notifRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const notifsArray: Notification[] = Object.entries(data)
                        .map(([id, notif]) => ({ id, ...(notif as any) }))
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setNotifications(notifsArray);
                } else {
                    setNotifications([]);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        } else if (!user && !userLoading) {
            setLoading(false);
        }
    }, [user, database, userLoading]);

    const handleNotificationClick = (notification: Notification) => {
        if (!user || !database) return;
        if (!notification.read) {
            update(ref(database, `notifications/${user.uid}/${notification.id}`), { read: true });
        }
        router.push(notification.link);
    };

    const handleMarkAllRead = () => {
        if (!user || !database || notifications.every(n => n.read)) return;
        const updates: { [key: string]: any } = {};
        notifications.forEach(n => {
            if (!n.read) {
                updates[`/notifications/${user.uid}/${n.id}/read`] = true;
            }
        });
        update(ref(database), updates);
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'tasks') return n.type === 'TASK_SHARED';
        if (filter === 'reminders') return n.type === 'DUE_DATE_REMINDER';
        return false;
    });
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
        switch (type) {
            case 'TASK_SHARED':
                return <Users className="h-5 w-5 text-primary-foreground" />;
            case 'DUE_DATE_REMINDER':
                return <CalendarClock className="h-5 w-5 text-primary-foreground" />;
            default:
                return <Bell className="h-5 w-5 text-primary-foreground" />;
        }
    };

    return (
        <div className="animate-fade-in flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="flex items-center p-4 justify-between">
                    <Link href="/" className="text-foreground flex size-10 shrink-0 items-center justify-center -ml-2 rounded-full hover:bg-secondary">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-lg font-bold text-center flex-1">Notifications</h1>
                    <div className="flex w-20 items-center justify-end">
                        {unreadCount > 0 && (
                            <Button variant="link" size="sm" onClick={handleMarkAllRead} className="text-xs p-1 h-auto text-primary">
                                <CheckCheck className="mr-1 h-3 w-3" />
                                Read All
                            </Button>
                        )}
                    </div>
                </div>
                <div className="px-4 pb-3">
                    <Tabs value={filter} onValueChange={setFilter} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="tasks">Tasks</TabsTrigger>
                            <TabsTrigger value="reminders">Reminders</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto bg-secondary/50">
                {loading ? (
                    <div className="p-4"><NotificationSkeleton /></div>
                ) : filteredNotifications.length > 0 ? (
                    <div className="p-4 space-y-3">
                        {filteredNotifications.map(notif => (
                            <button
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={cn(
                                    "relative flex items-start gap-4 rounded-xl p-4 text-left w-full transition-colors bg-card shadow-sm border",
                                    !notif.read && "bg-primary/5 border-primary/20"
                                )}
                            >
                                {!notif.read && <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />}
                                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary shrink-0">
                                    <NotificationIcon type={notif.type} />
                                </div>
                                <div className="flex-1">
                                    <p className={cn("text-sm", !notif.read ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground/80 mt-1">
                                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10 flex flex-col items-center justify-center gap-4 text-muted-foreground h-full mt-16">
                        <Bell className="h-16 w-16 text-slate-300 dark:text-slate-700" />
                        <h3 className="text-lg font-semibold text-foreground">All Caught Up!</h3>
                        <p>You have no new notifications.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
