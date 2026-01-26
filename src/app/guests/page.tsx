'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);

  return (
    <div className="flex flex-col bg-background">
      <div className="sticky top-0 z-20 flex flex-col bg-card dark:bg-background border-b border-border">
        <div className="flex items-center p-4 justify-between">
          <Link href="/" className="text-foreground flex size-12 shrink-0 items-center">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
          </Link>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Guest List</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-foreground">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex p-1 bg-muted rounded-xl">
            <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-card dark:bg-muted-foreground/20 text-primary shadow-sm">All Sides</button>
            <button className="flex-1 py-2 text-sm font-medium rounded-lg text-muted-foreground">Bride's</button>
            <button className="flex-1 py-2 text-sm font-medium rounded-lg text-muted-foreground">Groom's</button>
          </div>
        </div>
        <div className="flex flex-nowrap gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-border bg-card shadow-sm">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Total Invited</p>
            <p className="text-primary tracking-light text-xl font-bold leading-tight">0</p>
          </div>
          <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-border bg-card shadow-sm">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Confirmed</p>
            <p className="text-green-600 tracking-light text-xl font-bold leading-tight">0</p>
          </div>
          <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-border bg-card shadow-sm">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Pending</p>
            <p className="text-gray-500 tracking-light text-xl font-bold leading-tight">0</p>
          </div>
        </div>
      </div>
      <div className="bg-card dark:bg-background">
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
              <div className="text-muted-foreground flex border-none bg-muted items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted h-full placeholder:text-muted-foreground px-3 text-base font-normal" placeholder="Search guests..." defaultValue="" />
            </div>
          </label>
        </div>
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-5 text-white shadow-sm">
            <p className="text-sm font-semibold">All Guests</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-muted px-5 border border-border">
            <p className="text-foreground text-sm font-medium">Confirmed</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-muted px-5 border border-border">
            <p className="text-foreground text-sm font-medium">Pending</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-24">
        <div className="px-3 py-2 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Showing All Guests</p>
          <p className="text-muted-foreground text-[10px] font-medium">Sort: Recent</p>
        </div>
        {guests.length === 0 ? (
          <div className="text-center p-10">
            <p className="text-muted-foreground">Your guest list is empty.</p>
            <Button className="mt-4">
              <span className="material-symbols-outlined text-base mr-2">add</span>
              Add Guest
            </Button>
          </div>
        ) : (
          <>{/* Guest items would be mapped here */}</>
        )}
      </div>
      <div className="fixed bottom-28 right-6 z-30">
        <button className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
}
