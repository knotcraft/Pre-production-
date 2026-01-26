'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BudgetPage() {
  const [categories, setCategories] = useState([]);

  return (
    <div className="bg-background dark:bg-background-dark">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <Link href="/" className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </Link>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 text-center">Budget Tracker</h2>
          <div className="flex size-10 items-center justify-end">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-foreground">more_horiz</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="bg-card dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-border dark:border-slate-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Total Budget</p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">₹0</h1>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              NOT SET
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 border-r border-border dark:border-slate-800">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Spent</p>
              <p className="text-primary text-xl font-bold">₹0</p>
              <p className="text-emerald-500 text-xs font-medium flex items-center">
                <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                0% of total
              </p>
            </div>
            <div className="flex flex-col gap-1 pl-2">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Remaining</p>
              <p className="text-foreground text-xl font-bold">₹0</p>
              <p className="text-muted-foreground text-xs font-medium italic">
                No expenses yet
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg font-bold leading-tight tracking-tight">Spending by Category</h3>
        <Button variant="link" className="text-primary text-sm font-semibold">View Insights</Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center p-10">
          <p className="text-muted-foreground">You haven't added any budget categories yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-4">
          {/* Categories would be mapped here */}
        </div>
      )}

      <div className="fixed bottom-24 right-6 z-30">
        <button className="bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
}
