
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser, useFirebase } from '@/firebase';
import { ref, onValue } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Vendor } from '@/lib/vendor-data';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


const vendorCategories = [
  { name: 'Catering', icon: 'restaurant', slug: 'catering' },
  { name: 'Music & DJ', icon: 'headset', slug: 'music-dj' },
  { name: 'Decoration', icon: 'celebration', slug: 'decoration' },
  { name: 'Photography', icon: 'photo_camera', slug: 'photography' },
  { name: 'Venues', icon: 'castle', slug: 'venues' },
  { name: 'Florist', icon: 'local_florist', slug: 'florist' },
];

export default function VendorsPage() {
  const { user } = useUser();
  const { database } = useFirebase();
  const [myVendors, setMyVendors] = useState<Vendor[]>([]);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const featuredVendors = allVendors.slice(0, 3);

  useEffect(() => {
    if (database) {
        setLoading(true);
        const vendorsRef = ref(database, 'vendors');
        const unsubscribeVendors = onValue(vendorsRef, (snapshot) => {
            if (snapshot.exists()) {
                const vendorsData = snapshot.val();
                const vendorsList: Vendor[] = Object.entries(vendorsData).map(([id, vendor]) => ({
                    id,
                    ...(vendor as Omit<Vendor, 'id'>),
                    rating: parseFloat((vendor as any).rating || '0'),
                }));
                setAllVendors(vendorsList);
            } else {
                setAllVendors([]);
            }
            setLoading(false);
        });

        return () => unsubscribeVendors();
    }
  }, [database]);

  useEffect(() => {
    if (user && database) {
      const myVendorsRef = ref(database, `users/${user.uid}/myVendors`);
      const unsubscribe = onValue(myVendorsRef, (snapshot) => {
        if (snapshot.exists()) {
          const myVendorData = snapshot.val();
          setMyVendors(Object.values(myVendorData) as Vendor[]);
        } else {
          setMyVendors([]);
        }
      });
      return () => unsubscribe();
    }
  }, [user, database]);

  const PriceDisplay = ({ price }: { price?: '$$$' | '$$' | '$' }) => (
    <div className="flex items-center">
        <span className={cn("font-bold text-primary", !price || price.length < 1 ? 'opacity-30' : '')}>₹</span>
        <span className={cn("font-bold text-primary", !price || price.length < 2 ? 'opacity-30' : '')}>₹</span>
        <span className={cn("font-bold text-primary", !price || price.length < 3 ? 'opacity-30' : '')}>₹</span>
    </div>
  );


  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-[#1a0c10] overflow-x-hidden">
      {/* Header Section */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#1a0c10]/80 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#181113] dark:text-white">Vendors</h1>
          </div>
          <button className="size-10 flex items-center justify-center rounded-full bg-background-light dark:bg-white/10">
            <span className="material-symbols-outlined text-[#181113] dark:text-white">tune</span>
          </button>
        </div>
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
          <input
            className="w-full bg-background-light dark:bg-white/5 border-none rounded-lg py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Search venues, florists, DJs..."
            type="text"
          />
        </div>
      </div>
      
      {/* My Vendors Section */}
      {myVendors.length > 0 && (
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">My Vendors</h2>
          </div>
          <Link href="/vendors/my-vendors" passHref>
            <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-3 transition-transform active:scale-95">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-4">
                  {myVendors.slice(0, 3).map(vendor => (
                    <Avatar key={vendor.id} className="border-2 border-primary/30">
                      <AvatarImage src={vendor.image?.imageUrl} />
                      <AvatarFallback>{vendor.name ? vendor.name.charAt(0) : 'V'}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">
                    Your Saved List
                  </p>
                  <p className="text-sm text-muted-foreground">{myVendors.length} vendor{myVendors.length > 1 ? 's' : ''} saved</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary">arrow_forward_ios</span>
            </div>
          </Link>
        </div>
      )}


      {/* Category Grid Section */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Categories</h2>
          <button className="text-primary text-sm font-semibold">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {vendorCategories.map((category) => (
            <Link key={category.name} href={`/vendors/${category.slug}`} passHref>
                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg p-4 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 h-full">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">{category.icon}</span>
                    </div>
                    <span className="font-bold text-sm text-center">{category.name}</span>
                </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Vendors Section */}
      <div className="pb-32">
        <div className="px-4 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Featured Vendors</h2>
        </div>
        {loading ? (
             <div className="flex overflow-x-auto no-scrollbar gap-4 px-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="min-w-[280px] bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                        <Skeleton className="h-40 w-full" />
                        <div className="p-4">
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-3" />
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-8" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex overflow-x-auto no-scrollbar gap-4 px-4">
            {featuredVendors.map((vendor) => (
                <div key={vendor.id} className="min-w-[280px] bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                <div className="relative h-40 w-full bg-gray-200">
                    {vendor.image ? (
                      <Image
                          alt={vendor.image.description || 'Vendor image'}
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
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold">{vendor.rating.toFixed(1)}</span>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-base mb-1">{vendor.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {vendor.location}
                    </p>
                    <div className="flex items-center justify-between">
                    <PriceDisplay price={vendor.price as ('$$$' | '$$' | '$')} />
                    <button className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">Book Now</button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
