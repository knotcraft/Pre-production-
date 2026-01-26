'use client';
import { Progress } from '@/components/ui/progress';
import { useFirebase, useUser } from '@/firebase';
import { ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

type BudgetData = {
    total: number;
    spent: number;
};

export function BudgetSummary() {
  const { user } = useUser();
  const { database } = useFirebase();
  const [budget, setBudget] = useState<BudgetData>({ total: 0, spent: 0 });

  useEffect(() => {
    if (user && database) {
      const budgetRef = ref(database, 'users/' + user.uid + '/budget');
      const unsubscribe = onValue(budgetRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const totalBudget = data.total || 0;
          let totalSpent = 0;
          if (data.categories) {
            totalSpent = Object.values(data.categories).reduce((sum: number, cat: any) => {
                const categorySpent = cat.expenses 
                  ? Object.values(cat.expenses).reduce((expenseSum: number, expense: any) => expenseSum + (expense.amount || 0), 0)
                  : 0;
                return sum + categorySpent;
            }, 0);
          }
          setBudget({ total: totalBudget, spent: totalSpent });
        } else {
            setBudget({ total: 0, spent: 0 });
        }
      });

      return () => unsubscribe();
    }
  }, [user, database]);
  
  const { spent, total } = budget;
  const percentage = total > 0 ? Math.round((spent / total) * 100) : 0;
  const isOverBudget = percentage > 100;
  const circumference = 2 * Math.PI * 40; // 2 * pi * r

  if (total <= 0) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-card p-6 shadow-none dark:bg-card/50 text-center">
            <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Wallet className="h-6 w-6 text-slate-500" />
                </div>
            </div>
            <h3 className="text-lg font-bold mb-1">Set Your Budget</h3>
            <p className="text-sm text-muted-foreground mb-4">Start tracking your wedding expenses.</p>
            <Link href="/budget" passHref>
                <Button>Get Started</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/10 bg-card p-6 shadow-lg dark:bg-card/50">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Budget Progress</h3>
            <span className={cn(
                "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                isOverBudget 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'bg-primary/10 text-primary'
            )}>
              {isOverBudget ? 'Over Budget' : 'On Track'}
            </span>
        </div>
        <div className="flex items-center gap-6">
            <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform">
                    <circle className="stroke-secondary" cx="48" cy="48" r="40" fill="transparent" strokeWidth="8"></circle>
                    <circle
                        className={cn(isOverBudget ? "text-destructive" : "text-primary")}
                        cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (Math.min(percentage, 100) / 100) * circumference}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">{percentage}%</span>
                </div>
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Spent vs. Remaining</p>
                <p className="text-xl font-bold">
                    ₹{spent.toLocaleString('en-IN')} / {total > 0 ? `₹${total.toLocaleString('en-IN', { notation: 'compact', compactDisplay: 'short' })}` : '₹0'}
                </p>
                <Progress value={percentage} className={cn("mt-2 h-1.5", isOverBudget && "[&>div]:bg-destructive")} />
            </div>
        </div>
    </div>
  );
}
