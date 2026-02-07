
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { allVendors } from '@/lib/vendor-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirebase } from '@/firebase';
import { ref, onValue, remove } from 'firebase/database';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Vendor } from '@/lib/vendor-data';

function MyVendorsSkeleton() {
    return (
        <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                    <Skeleton className="h-52 w-full" />
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-5 w-12" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


export default function MyVendorsPage() {
  const { user } = useUser();
  const { database } = useFirebase();
  const { toast } = useToast();
  const [myVendors, setMyVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && database) {
      const myVendorsRef = ref(database, `users/${user.uid}/myVendors`);
      const unsubscribe = onValue(myVendorsRef, (snapshot) => {
        if (snapshot.exists()) {
          const ids = Object.keys(snapshot.val());
          const savedVendors = allVendors.filter(vendor => ids.includes(vendor.id));
          setMyVendors(savedVendors);
        } else {
          setMyVendors([]);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else if (!user) {
        setLoading(false);
    }
  }, [user, database]);

  const handleRemoveVendor = async (vendorId: string) => {
    if (!user || !database) {
      toast({ variant: 'destructive', title: 'Please log in to manage vendors.' });
      return;
    }

    const vendorRef = ref(database, `users/${user.uid}/myVendors/${vendorId}`);
    try {
      await remove(vendorRef);
      toast({ title: 'Vendor removed from your list.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };
  
    const PriceDisplay = ({ price }: { price: '$$$' | '$$' | '$' }) => (
        <div className="flex items-center">
            <span className={cn("font-bold text-primary", price.length < 1 && 'opacity-30')}>$</span>
            <span className={cn("font-bold text-primary", price.length < 2 && 'opacity-30')}>$</span>
            <span className={cn("font-bold text-primary", price.length < 3 && 'opacity-30')}>$</span>
        </div>
    );

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-[#1a0c10] overflow-x-hidden">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#1a0c10]/80 backdrop-blur-md px-4 pt-4 pb-4 border-b border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-2">
                 <Link href="/vendors" passHref>
                    <Button variant="ghost" size="icon" className="-ml-2 text-foreground">
                        <ArrowLeft />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight">My Vendors</h1>
                </div>
            </div>
        </header>

        <main className="p-4 space-y-4 pb-24">
             {loading ? <MyVendorsSkeleton /> : 
             myVendors.length > 0 ? myVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                    <div className="relative h-52 w-full">
                        {vendor.image ? (
                        <Image
                            alt={vendor.image.description}
                            className="h-full w-full object-cover"
                            src={vendor.image.imageUrl}
                            data-ai-hint={vendor.image.imageHint}
                            fill
                        />
                        ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                <span className="material-symbols-outlined text-muted-foreground text-4xl">image</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold shadow">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>{vendor.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-extrabold text-lg">{vendor.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {vendor.location}
                                </p>
                            </div>
                            <PriceDisplay price={vendor.price} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
                            <Button 
                              onClick={() => handleRemoveVendor(vendor.id)}
                              variant="outline"
                              className="w-full rounded-lg font-bold text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                            {vendor.phone ? (
                                <a href={`tel:${vendor.phone}`} className="w-full">
                                    <Button className="w-full rounded-lg font-bold shadow-md shadow-primary/20">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call Vendor
                                    </Button>
                                </a>
                            ) : (
                                <Button className="w-full rounded-lg font-bold" disabled>Not Available</Button>
                            )}
                        </div>
                    </div>
                </div>
             )) : (
                <div className="text-center p-10 flex flex-col items-center justify-center gap-4 text-muted-foreground h-full mt-16">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">favorite_border</span>
                    <h3 className="text-lg font-semibold text-foreground">No Saved Vendors Yet</h3>
                    <p className="text-sm">Start exploring and add your favorites!</p>
                     <Link href="/vendors" passHref>
                        <Button variant="outline" className="mt-4">
                            Browse Vendors
                        </Button>
                    </Link>
                </div>
             )}
        </main>
    </div>
  );
}
