'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { allVendors } from '@/lib/vendor-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Globe, Star } from 'lucide-react';
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
         <div className="p-6 text-center">
            <h1 className="text-2xl font-bold">Category not found</h1>
            <Link href="/vendors" passHref>
                <Button variant="link">Back to all vendors</Button>
            </Link>
        </div>
    );
  }

  return (
    <>
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 pt-4 pb-4 border-b">
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
                    <h1 className="text-xl font-extrabold tracking-tight">{category.name}</h1>
                </div>
            </div>
        </header>

        <main className="p-4 space-y-4">
             {vendors.length > 0 ? vendors.map((vendor) => (
                <div key={vendor.id} className="bg-card rounded-2xl overflow-hidden shadow-sm border">
                    <div className="relative h-48 w-full">
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
                        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>{vendor.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <h3 className="font-bold text-lg">{vendor.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {vendor.location}
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-primary font-bold text-lg">{vendor.price}</span>
                            <Button className="rounded-full font-bold">Book Now</Button>
                        </div>
                         {(vendor.phone || vendor.website) && (
                            <div className="flex items-center gap-2 pt-4 border-t">
                                {vendor.phone && (
                                    <a href={`tel:${vendor.phone}`} className="flex-1">
                                        <Button variant="outline" className="w-full rounded-lg">
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call
                                        </Button>
                                    </a>
                                )}
                                {vendor.website && (
                                    <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                                        <Button variant="outline" className="w-full rounded-lg">
                                            <Globe className="h-4 w-4 mr-2" />
                                            Website
                                        </Button>
                                    </a>
                                )}
                            </div>
                         )}
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
    </>
  );
}
