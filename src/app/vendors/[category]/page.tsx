'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { allVendors } from '@/lib/vendor-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const vendorCategories = [
  { name: 'Catering', icon: 'restaurant', slug: 'catering' },
  { name: 'Music & DJ', icon: 'headset', slug: 'music-dj' },
  { name: 'Decoration', icon: 'celebration', slug: 'decoration' },
  { name: 'Photography', icon: 'photo_camera', slug: 'photography' },
  { name: 'Venues', icon: 'castle', slug: 'venues' },
  { name: 'Florist', icon: 'local_florist', slug: 'florist' },
];

export default function VendorListPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  
  const category = vendorCategories.find(cat => cat.slug === categorySlug);
  const vendors = allVendors.filter(vendor => vendor.categorySlug === categorySlug);

  if (!category) {
    return (
         <div className="relative flex h-auto min-h-screen w-full flex-col max-w-[430px] mx-auto bg-white dark:bg-[#1a0c10] overflow-x-hidden shadow-2xl p-6 text-center">
            <h1 className="text-2xl font-bold">Category not found</h1>
            <Link href="/vendors" passHref>
                <Button variant="link">Back to all vendors</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col max-w-[430px] mx-auto bg-background-light dark:bg-[#1a0c10] overflow-x-hidden shadow-2xl">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#1a0c10]/80 backdrop-blur-md px-4 pt-6 pb-4">
            <div className="flex items-center gap-2">
                 <Link href="/vendors" passHref>
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">{category.icon}</span>
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-[#181113] dark:text-white">{category.name}</h1>
                </div>
            </div>
        </header>

        <main className="px-4 pb-24 space-y-4">
             {vendors.length > 0 ? vendors.map((vendor) => (
                <div key={vendor.id} className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                    <div className="relative h-48 w-full bg-gray-200">
                        {vendor.image ? (
                        <Image
                            alt={vendor.image.description}
                            className="h-full w-full object-cover"
                            src={vendor.image.imageUrl}
                            data-ai-hint={vendor.image.imageHint}
                            fill
                        />
                        ) : (
                            <div className="h-full w-full bg-slate-200 flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-400 text-4xl">image</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-xs font-bold">{vendor.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{vendor.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {vendor.location}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-primary font-bold text-base">{vendor.price}</span>
                             <div className="flex items-center gap-2">
                                {vendor.phone && (
                                    <a href={`tel:${vendor.phone}`}>
                                        <Button size="icon" variant="outline" className="rounded-full">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                                {vendor.website && (
                                    <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer">
                                        <Button size="icon" variant="outline" className="rounded-full">
                                            <Globe className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                                <Button className="rounded-full">Book Now</Button>
                            </div>
                        </div>
                    </div>
                </div>
             )) : (
                <div className="text-center p-10 flex flex-col items-center justify-center gap-4 text-muted-foreground h-full mt-16">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">search_off</span>
                    <h3 className="text-lg font-semibold text-foreground">No Vendors Found</h3>
                    <p className="text-sm">We don't have any vendors for this category yet.</p>
                </div>
             )}
        </main>
    </div>
  );
}
