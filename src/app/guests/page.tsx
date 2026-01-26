'use client';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from '@/components/ui/textarea';
import { useUser, useDatabase } from '@/firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { toast } from '@/hooks/use-toast';
import type { Guest } from '@/lib/types';
import { Loader2, Plus, MoreVertical, Pencil, Trash2, Users, CheckCircle, XCircle, CircleHelp, Search, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const getStatusProps = (status: Guest['status']) => {
    switch (status) {
        case 'confirmed':
            return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: 'Confirmed', color: 'text-green-500' };
        case 'declined':
            return { icon: <XCircle className="h-5 w-5 text-destructive" />, text: 'Declined', color: 'text-destructive' };
        default:
            return { icon: <CircleHelp className="h-5 w-5 text-slate-500" />, text: 'Pending', color: 'text-slate-500' };
    }
}

export default function GuestsPage() {
    const { user } = useUser();
    const database = useDatabase();
    const [loading, setLoading] = useState(true);
    const [guests, setGuests] = useState<Guest[]>([]);
    
    // Dialog states
    const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // Active item state
    const [activeGuest, setActiveGuest] = useState<Guest | null>(null);

    // Form state
    const [formState, setFormState] = useState<Partial<Guest>>({
        name: '',
        side: 'both',
        status: 'pending',
        group: '',
        email: '',
    });

    // Filtering and Searching
    const [sideFilter, setSideFilter] = useState<'all' | 'bride' | 'groom' | 'both'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user && database) {
            const guestsRef = ref(database, `users/${user.uid}/guests`);
            const unsubscribe = onValue(guestsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const guestsList: Guest[] = Object.entries(data).map(([id, guest]) => ({
                        id,
                        ...(guest as Omit<Guest, 'id'>)
                    }));
                    setGuests(guestsList);
                } else {
                    setGuests([]);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        } else if (!user) {
            setLoading(false);
        }
    }, [user, database]);
    
    const { filteredGuests, summary } = useMemo(() => {
        let filtered = guests;
        
        if (sideFilter !== 'all') {
             if (sideFilter === 'bride' || sideFilter === 'groom') {
                filtered = filtered.filter(g => g.side === sideFilter || g.side === 'both');
            }
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(g => g.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(g => 
                g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.group?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const summaryData = {
            total: guests.length,
            confirmed: guests.filter(g => g.status === 'confirmed').length,
            pending: guests.filter(g => g.status === 'pending').length,
            declined: guests.filter(g => g.status === 'declined').length,
        };

        return { filteredGuests: filtered, summary: summaryData };
    }, [guests, sideFilter, statusFilter, searchQuery]);


    const openGuestDialog = (guest: Guest | null) => {
        setActiveGuest(guest);
        setFormState(guest || { name: '', side: 'both', status: 'pending', group: '', email: '' });
        setIsGuestDialogOpen(true);
    };

    const handleSaveGuest = async () => {
        if (!user || !database || !formState.name) {
            toast({ variant: 'destructive', title: 'Invalid input', description: 'Guest name is required.' });
            return;
        }

        const guestData = { ...formState };
        delete guestData.id;

        try {
            if (activeGuest?.id) {
                // Editing existing guest
                const guestRef = ref(database, `users/${user.uid}/guests/${activeGuest.id}`);
                await update(guestRef, guestData);
                toast({ title: 'Success', description: 'Guest updated.' });
            } else {
                // Adding new guest
                const guestsRef = ref(database, `users/${user.uid}/guests`);
                const newGuestRef = push(guestsRef);
                await set(newGuestRef, guestData);
                toast({ title: 'Success', description: 'Guest added.' });
            }
            setIsGuestDialogOpen(false);
            setActiveGuest(null);
        } catch(e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save guest.' });
        }
    };

    const openDeleteDialog = (guest: Guest) => {
        setActiveGuest(guest);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteGuest = async () => {
        if (!user || !database || !activeGuest) return;
        try {
            await remove(ref(database, `users/${user.uid}/guests/${activeGuest.id}`));
            toast({ title: 'Success', description: 'Guest deleted.' });
            setIsDeleteDialogOpen(false);
            setActiveGuest(null);
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete guest.' });
        }
    };
    
    const handleFormChange = (field: keyof Omit<Guest, 'id'>, value: string) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
      return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 justify-between">
                    <Link href="/" className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </Link>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Guest List</h2>
                    <div className="flex size-10 items-center justify-end" />
                </div>
                 <div className="px-4 pb-4">
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <button onClick={() => setSideFilter('all')} className={cn("flex-1 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors", sideFilter === 'all' ? 'bg-white dark:bg-slate-700 text-primary' : 'text-slate-500 dark:text-slate-400')}>All Guests</button>
                        <button onClick={() => setSideFilter('bride')} className={cn("flex-1 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors", sideFilter === 'bride' ? 'bg-white dark:bg-slate-700 text-primary' : 'text-slate-500 dark:text-slate-400')}>Bride's</button>
                        <button onClick={() => setSideFilter('groom')} className={cn("flex-1 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors", sideFilter === 'groom' ? 'bg-white dark:bg-slate-700 text-primary' : 'text-slate-500 dark:text-slate-400')}>Groom's</button>
                    </div>
                </div>
                 <div className="flex flex-nowrap gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
                    <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Invited</p>
                        <p className="text-primary tracking-light text-xl font-bold leading-tight">{summary.total}</p>
                    </div>
                    <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Confirmed</p>
                        <p className="text-green-600 tracking-light text-xl font-bold leading-tight">{summary.confirmed}</p>
                    </div>
                    <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Pending</p>
                        <p className="text-gray-500 tracking-light text-xl font-bold leading-tight">{summary.pending}</p>
                    </div>
                </div>
            </header>

            <main className="bg-background-light dark:bg-background-dark pb-24">
                <div className="px-4 py-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input 
                            className="pl-10 h-12 w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                            placeholder="Search guests..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-2">
                     <div className="px-2 py-2 flex items-center justify-between">
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Showing {filteredGuests.length} Guests</p>
                    </div>

                    {filteredGuests.length === 0 ? (
                        <div className="text-center p-10 flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400">
                             <Users className="h-12 w-12 text-slate-400" />
                             <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Your Guest List is Empty</h3>
                            <p>Click the '+' button to start adding guests to your wedding.</p>
                        </div>
                    ) : (
                        <div className="space-y-2 p-2">
                            {filteredGuests.map(guest => {
                                const statusProps = getStatusProps(guest.status);
                                return (
                                    <div key={guest.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 group">
                                        <Avatar>
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {guest.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 dark:text-white">{guest.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{guest.group || 'No group'}</p>
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm font-semibold ${statusProps.color}`}>
                                            {statusProps.icon}
                                        </div>
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                                <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openGuestDialog(guest)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openDeleteDialog(guest)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

             <Dialog open={isGuestDialogOpen} onOpenChange={setIsGuestDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{activeGuest ? 'Edit' : 'Add'} Guest</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={formState.name} onChange={(e) => handleFormChange('name', e.target.value)} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="group" className="text-right">Group</Label>
                            <Input id="group" value={formState.group || ''} onChange={(e) => handleFormChange('group', e.target.value)} className="col-span-3" placeholder="e.g. Family, Friends" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Side</Label>
                             <RadioGroup value={formState.side} onValueChange={(val: 'bride' | 'groom' | 'both') => handleFormChange('side', val)} className="col-span-3 flex gap-4">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="bride" id="r-bride" /><Label htmlFor="r-bride">Bride</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="groom" id="r-groom" /><Label htmlFor="r-groom">Groom</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="both" id="r-both" /><Label htmlFor="r-both">Both</Label></div>
                            </RadioGroup>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Status</Label>
                             <RadioGroup value={formState.status} onValueChange={(val: 'pending' | 'confirmed' | 'declined') => handleFormChange('status', val)} className="col-span-3 flex gap-4">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="pending" id="s-pending" /><Label htmlFor="s-pending">Pending</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="confirmed" id="s-confirmed" /><Label htmlFor="s-confirmed">Confirmed</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="declined" id="s-declined" /><Label htmlFor="s-declined">Declined</Label></div>
                            </RadioGroup>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" value={formState.email || ''} onChange={(e) => handleFormChange('email', e.target.value)} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">Notes</Label>
                             <Textarea id="notes" value={formState.notes || ''} onChange={(e) => handleFormChange('notes', e.target.value)} className="col-span-3" placeholder="e.g. dietary restrictions, seating preferences"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveGuest}>Save Guest</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the guest "{activeGuest?.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteGuest} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="fixed bottom-28 right-6 z-30">
                <Button onClick={() => openGuestDialog(null)} className="w-14 h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
                    <UserPlus className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
