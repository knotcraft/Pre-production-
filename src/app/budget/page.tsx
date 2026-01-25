'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function BudgetPage() {
  const [expanded, setExpanded] = useState('photography');

  const toggleExpand = (category: string) => {
    setExpanded(expanded === category ? null : category);
  };

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
              <h1 className="text-3xl font-bold tracking-tight text-foreground">$35,000</h1>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              ESTIMATED
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 border-r border-border dark:border-slate-800">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Spent</p>
              <p className="text-primary text-xl font-bold">$22,450</p>
              <p className="text-emerald-500 text-xs font-medium flex items-center">
                <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                64% of total
              </p>
            </div>
            <div className="flex flex-col gap-1 pl-2">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Remaining</p>
              <p className="text-foreground text-xl font-bold">$12,550</p>
              <p className="text-muted-foreground text-xs font-medium italic">
                Within limits
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg font-bold leading-tight tracking-tight">Spending by Category</h3>
        <button className="text-primary text-sm font-semibold">View Insights</button>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="bg-card dark:bg-slate-900 rounded-xl p-4 border border-border dark:border-slate-800 shadow-sm transition-all active:scale-[0.98] cursor-pointer" onClick={() => toggleExpand('venue')}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">home_work</span>
                </div>
                <div>
                  <p className="text-foreground text-base font-bold">Venue & Rentals</p>
                  <p className="text-muted-foreground text-xs">$12,750 of $15,000</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">{expanded === 'venue' ? 'expand_less' : 'expand_more'}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-full h-2 rounded-full bg-secondary dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground text-xs font-medium">85% utilized</p>
                <p className="text-foreground text-xs font-bold">$2,250 left</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-slate-900 rounded-xl p-4 border border-border dark:border-slate-800 shadow-sm cursor-pointer" onClick={() => toggleExpand('catering')}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <div>
                  <p className="text-foreground text-base font-bold">Catering & Drinks</p>
                  <p className="text-muted-foreground text-xs">$3,200 of $8,000</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">{expanded === 'catering' ? 'expand_less' : 'expand_more'}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-full h-2 rounded-full bg-secondary dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-orange-500" style={{ width: '40%' }}></div>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground text-xs font-medium">40% utilized</p>
                <p className="text-foreground text-xs font-bold">$4,800 left</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-card dark:bg-slate-900 rounded-xl border ${expanded === 'photography' ? 'border-primary/30 dark:border-primary/50 shadow-md ring-1 ring-primary/10' : 'border-border dark:border-slate-800'} overflow-hidden cursor-pointer`} onClick={() => toggleExpand('photography')}>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">photo_camera</span>
                </div>
                <div>
                  <p className="text-foreground text-base font-bold">Photography</p>
                  <p className="text-muted-foreground text-xs">$4,500 of $4,500</p>
                </div>
              </div>
              <span className={`material-symbols-outlined ${expanded === 'photography' ? 'text-primary' : 'text-slate-400'}`}>{expanded === 'photography' ? 'expand_less' : 'expand_more'}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '100%' }}></div>
            </div>
          </div>

          {expanded === 'photography' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 px-4 py-3">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">Main Photographer Deposit</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Oct 12, 2023 • Paid</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">$1,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">Wedding Day Balance</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Due Mar 15, 2024</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">$2,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">Engagement Session</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Nov 05, 2023 • Paid</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">$500</span>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-white dark:bg-slate-900 border border-border dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base">add</span>
                Add Expense
              </button>
            </div>
          )}
        </div>

        <div className="bg-card dark:bg-slate-900 rounded-xl p-4 border border-border dark:border-slate-800 shadow-sm cursor-pointer" onClick={() => toggleExpand('decor')}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">local_florist</span>
                </div>
                <div>
                  <p className="text-foreground text-base font-bold">Decor & Flowers</p>
                  <p className="text-muted-foreground text-xs">$2,000 of $5,000</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">{expanded === 'decor' ? 'expand_less' : 'expand_more'}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-full h-2 rounded-full bg-secondary dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-pink-500" style={{ width: '40%' }}></div>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground text-xs font-medium">40% utilized</p>
                <p className="text-foreground text-xs font-bold">$3,000 left</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-24 right-6 z-30">
        <button className="bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
}
