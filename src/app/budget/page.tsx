'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useDatabase } from '@/firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { toast } from '@/hooks/use-toast';
import type { BudgetData, Category } from '@/lib/types';
import { Loader2, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';

export default function BudgetPage() {
  const { user } = useUser();
  const database = useDatabase();
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

  // Dialog states
  const [isEditTotalBudgetOpen, setIsEditTotalBudgetOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // State for active item
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Form states
  const [totalBudgetInput, setTotalBudgetInput] = useState('');
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [categoryAllocatedInput, setCategoryAllocatedInput] = useState('');
  const [expenseAmountInput, setExpenseAmountInput] = useState('');

  useEffect(() => {
    if (user && database) {
      const budgetRef = ref(database, `users/${user.uid}/budget`);
      const unsubscribe = onValue(budgetRef, (snapshot) => {
        const data = snapshot.val();
        setBudgetData(data);
        setTotalBudgetInput(data?.total?.toString() || '');
        setLoading(false);
      });

      return () => unsubscribe();
    } else if (!user) {
      setLoading(false);
    }
  }, [user, database]);

  const { totalSpent, remainingBudget, categories } = useMemo(() => {
    const categories = budgetData?.categories ? Object.entries(budgetData.categories).map(([id, cat]) => ({ id, ...cat })) : [];
    const totalSpent = categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
    const remainingBudget = (budgetData?.total || 0) - totalSpent;
    return { totalSpent, remainingBudget, categories };
  }, [budgetData]);

  const handleSetTotalBudget = async () => {
    if (!user || !database) return;
    const newTotal = parseFloat(totalBudgetInput);
    if (isNaN(newTotal) || newTotal < 0) {
      toast({ variant: 'destructive', title: 'Invalid amount', description: 'Please enter a valid budget amount.' });
      return;
    }
    try {
      await set(ref(database, `users/${user.uid}/budget/total`), newTotal);
      toast({ title: 'Success', description: 'Total budget updated.' });
      setIsEditTotalBudgetOpen(false);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update total budget.' });
    }
  };

  const openCategoryDialog = (category: Category | null) => {
    setActiveCategory(category);
    setCategoryNameInput(category?.name || '');
    setCategoryAllocatedInput(category?.allocated?.toString() || '');
    setIsCategoryDialogOpen(true);
  };
  
  const handleSaveCategory = async () => {
    if (!user || !database) return;
    const name = categoryNameInput.trim();
    const allocated = parseFloat(categoryAllocatedInput);
    
    if (!name || isNaN(allocated) || allocated < 0) {
      toast({ variant: 'destructive', title: 'Invalid input', description: 'Please fill out all fields correctly.' });
      return;
    }

    try {
      if (activeCategory) { // Editing existing category
        const categoryRef = ref(database, `users/${user.uid}/budget/categories/${activeCategory.id}`);
        await update(categoryRef, { name, allocated });
        toast({ title: 'Success', description: 'Category updated.' });
      } else { // Adding new category
        const categoriesRef = ref(database, `users/${user.uid}/budget/categories`);
        const newCategoryRef = push(categoriesRef);
        await set(newCategoryRef, { name, allocated, spent: 0 });
        toast({ title: 'Success', description: 'Category added.' });
      }
      setIsCategoryDialogOpen(false);
      setActiveCategory(null);
    } catch(e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save category.' });
    }
  };

  const openDeleteDialog = (category: Category) => {
    setActiveCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!user || !database || !activeCategory) return;
    try {
      await remove(ref(database, `users/${user.uid}/budget/categories/${activeCategory.id}`));
      toast({ title: 'Success', description: 'Category deleted.' });
      setIsDeleteDialogOpen(false);
      setActiveCategory(null);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete category.' });
    }
  };

  const openExpenseDialog = (category: Category) => {
    setActiveCategory(category);
    setExpenseAmountInput('');
    setIsExpenseDialogOpen(true);
  }

  const handleAddExpense = async () => {
    if (!user || !database || !activeCategory) return;
    const amount = parseFloat(expenseAmountInput);
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid amount' });
      return;
    }
    
    try {
      const newSpent = (activeCategory.spent || 0) + amount;
      await update(ref(database, `users/${user.uid}/budget/categories/${activeCategory.id}`), { spent: newSpent });
      toast({ title: 'Success', description: 'Expense added.' });
      setIsExpenseDialogOpen(false);
      setActiveCategory(null);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add expense.' });
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <Link href="/" className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </Link>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 text-center">Budget Tracker</h2>
          <div className="flex size-10 items-center justify-end" />
        </div>
      </header>

      <div className="p-4">
        <div className="bg-card dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-border dark:border-slate-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Total Budget</p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">₹{budgetData?.total?.toLocaleString('en-IN') || '0'}</h1>
            </div>
            <Dialog open={isEditTotalBudgetOpen} onOpenChange={setIsEditTotalBudgetOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex gap-2">
                  <Pencil className="h-3 w-3" />
                  <span>{budgetData?.total ? 'Edit' : 'Set'} Budget</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{budgetData?.total ? 'Edit' : 'Set'} Total Budget</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="total-budget" className="text-right">Amount</Label>
                    <Input id="total-budget" type="number" value={totalBudgetInput} onChange={(e) => setTotalBudgetInput(e.target.value)} className="col-span-3" placeholder="e.g., 500000" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSetTotalBudget}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 border-r border-border dark:border-slate-800">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Spent</p>
              <p className="text-primary text-xl font-bold">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex flex-col gap-1 pl-2">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Remaining</p>
              <p className="text-foreground text-xl font-bold">₹{remainingBudget.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg font-bold leading-tight tracking-tight">Spending by Category</h3>
      </div>

      {categories.length === 0 ? (
        <div className="text-center p-10">
          <p className="text-muted-foreground">You haven't added any budget categories yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {categories.map((cat) => {
            const progress = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0;
            return (
              <div key={cat.id} className="bg-card p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{cat.name}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openExpenseDialog(cat)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Expense
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openCategoryDialog(cat)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(cat)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{cat.spent.toLocaleString('en-IN')}</span>
                  <span>₹{cat.allocated.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* ADD CATEGORY DIALOG */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeCategory ? 'Edit' : 'Add'} Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cat-name" className="text-right">Name</Label>
              <Input id="cat-name" value={categoryNameInput} onChange={(e) => setCategoryNameInput(e.target.value)} className="col-span-3" placeholder="e.g., Venue" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cat-allocated" className="text-right">Budget</Label>
              <Input id="cat-allocated" type="number" value={categoryAllocatedInput} onChange={(e) => setCategoryAllocatedInput(e.target.value)} className="col-span-3" placeholder="e.g., 100000" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ADD EXPENSE DIALOG */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense to "{activeCategory?.name}"</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exp-amount" className="text-right">Amount</Label>
              <Input id="exp-amount" type="number" value={expenseAmountInput} onChange={(e) => setExpenseAmountInput(e.target.value)} className="col-span-3" placeholder="e.g., 5000" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{activeCategory?.name}" category and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed bottom-24 right-6 z-30">
        <Button onClick={() => openCategoryDialog(null)} className="w-14 h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">add</span>
        </Button>
      </div>
       <div className="pb-28"></div>
    </div>
  );
}
