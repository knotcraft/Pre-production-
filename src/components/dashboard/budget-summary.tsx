'use client';
import { Progress } from '@/components/ui/progress';
import { useFirebase, useUser } from '@/firebase';
import { ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';

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
  const circumference = 2 * Math.PI * 40; // 2 * pi * r

  return (
    <div className="rounded-xl border border-primary/10 bg-card p-6 shadow-lg dark:bg-card/50">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Budget Progress</h3>
            <span className={`text-xs font-bold uppercase tracking-wider ${total > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              {total > 0 ? 'On Track' : 'Not Set'}
            </span>
        </div>
        <div className="flex items-center gap-6">
            <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform">
                    <circle className="stroke-secondary" cx="48" cy="48" r="40" fill="transparent" strokeWidth="8"></circle>
                    <circle className="text-primary" cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (percentage / 100) * circumference}
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
                <Progress value={percentage} className="mt-2 h-1.5" />
            </div>
        </div>
    </div>
  );
}
