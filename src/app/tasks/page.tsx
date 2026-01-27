
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useUser, useFirebase } from '@/firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import type { Task } from '@/lib/types';
import { Loader2, Plus, Calendar, Check, Pencil, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, parseISO, isPast, isToday, differenceInDays } from 'date-fns';

export default function TasksPage() {
    const { user } = useUser();
    const { database } = useFirebase();
    const { toast } = useToast();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [formState, setFormState] = useState<Partial<Task>>({
        title: '',
        dueDate: new Date().toISOString().split('T')[0],
        notes: '',
        completed: false,
    });
    
    useEffect(() => {
        if (user && database) {
            setLoading(true);
            const tasksRef = ref(database, `users/${user.uid}/tasks`);
            const unsubscribe = onValue(tasksRef, (snapshot) => {
                const data = snapshot.val();
                const tasksList: Task[] = data
                    ? Object.entries(data).map(([id, task]) => ({
                          id,
                          ...(task as Omit<Task, 'id'>),
                      }))
                    : [];
                setTasks(tasksList);
                setLoading(false);
            });
            return () => unsubscribe();
        } else if (!user) {
            setLoading(false);
        }
    }, [user, database]);
    
    const { overdue, today, upcoming, completed } = useMemo(() => {
        const now = new Date();
        now.setHours(0,0,0,0);
        
        return tasks.reduce<{ overdue: Task[], today: Task[], upcoming: Task[], completed: Task[] }>((acc, task) => {
            if (task.completed) {
                acc.completed.push(task);
            } else {
                const dueDate = parseISO(task.dueDate);
                if (isPast(dueDate) && !isToday(dueDate)) {
                    acc.overdue.push(task);
                } else if (isToday(dueDate)) {
                    acc.today.push(task);
                } else {
                    acc.upcoming.push(task);
                }
            }
            return acc;
        }, { overdue: [], today: [], upcoming: [], completed: [] });

    }, [tasks]);

    const openTaskDialog = (task: Task | null) => {
        setActiveTask(task);
        setFormState(task || { title: '', dueDate: new Date().toISOString().split('T')[0], notes: '', completed: false });
        setIsTaskDialogOpen(true);
    };

    const handleSaveTask = async () => {
        if (!user || !database || !formState.title || !formState.dueDate) {
            toast({ variant: 'destructive', title: 'Invalid input', description: 'Task title and due date are required.' });
            return;
        }

        const taskData = { ...formState, completed: formState.completed || false };
        delete taskData.id;

        try {
            if (activeTask?.id) {
                await update(ref(database, `users/${user.uid}/tasks/${activeTask.id}`), taskData);
                toast({ variant: 'success', title: 'Success', description: 'Task updated.' });
            } else {
                await set(push(ref(database, `users/${user.uid}/tasks`)), taskData);
                toast({ variant: 'success', title: 'Success', description: 'Task added.' });
            }
            setIsTaskDialogOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message || 'Could not save task.' });
        }
    };
    
    const openDeleteDialog = (task: Task) => {
        setTaskToDelete(task);
        setIsDeleteDialogOpen(true);
    }
    
    const handleDeleteTask = async () => {
        if (!user || !database || !taskToDelete) return;
        try {
            await remove(ref(database, `users/${user.uid}/tasks/${taskToDelete.id}`));
            toast({ variant: 'success', title: 'Success', description: 'Task deleted.' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete task.' });
        } finally {
            setIsDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const toggleTaskCompletion = async (task: Task) => {
        if (!user || !database) return;
        try {
            await update(ref(database, `users/${user.uid}/tasks/${task.id}`), { completed: !task.completed });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update task status.' });
        }
    };
    
    const TaskItem = ({ task }: { task: Task }) => {
        const dueDate = parseISO(task.dueDate);
        const isOverdue = !task.completed && isPast(dueDate) && !isToday(dueDate);
        const days = differenceInDays(dueDate, new Date());
        
        let dateLabel = format(dueDate, 'MMM d, yyyy');
        if (isToday(dueDate)) dateLabel = 'Today';
        else if (isOverdue) dateLabel = `${Math.abs(days)} days overdue`;
        
        return (
            <div className="flex items-center gap-4 rounded-xl border bg-card p-4 dark:border-slate-800 shadow-sm group">
                <button onClick={() => toggleTaskCompletion(task)} className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0 transition-colors", task.completed ? "bg-primary border-primary" : "border-slate-300 dark:border-slate-600 group-hover:border-primary")}>
                    {task.completed && <Check className="h-4 w-4 text-white" />}
                </button>
                <div className="flex-1">
                    <p className={cn("font-semibold text-slate-800 dark:text-slate-100", task.completed && "line-through text-slate-400 dark:text-slate-500")}>{task.title}</p>
                    <p className={cn("text-xs font-bold uppercase tracking-wider", isOverdue ? "text-destructive" : "text-slate-400 dark:text-slate-500")}>{dateLabel}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openTaskDialog(task)}><Pencil className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => openDeleteDialog(task)}><Trash2 className="h-4 w-4"/></Button>
                </div>
            </div>
        );
    };

    const TaskSection = ({ title, tasks }: { title: string, tasks: Task[] }) => {
        if (tasks.length === 0) return null;
        return (
            <div className="space-y-3">
                 <p className="text-sm font-bold text-muted-foreground px-1 pt-4 pb-1">{title}</p>
                 {tasks.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(task => <TaskItem key={task.id} task={task} />)}
            </div>
        )
    };
    
    if (loading) {
      return (
        <div className="flex h-[calc(100vh-150px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    const totalTasks = tasks.length;
    const completedTasksCount = tasks.filter(t => t.completed).length;
    const progressPercentage = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;
    
    return (
        <div className="bg-slate-50 dark:bg-background-dark/40 min-h-screen">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center p-4 justify-between">
                    <Link href="/" className="text-foreground flex size-10 shrink-0 items-center -ml-2 rounded-full hover:bg-secondary">
                        <span className="material-symbols-outlined text-2xl font-bold">arrow_back_ios_new</span>
                    </Link>
                    <h2 className="text-foreground text-xl font-extrabold leading-tight tracking-tight flex-1 text-center">Task Checklist</h2>
                    <div className="flex w-10 items-center justify-end" />
                </div>
            </header>

            <main className="flex-1 p-4 pb-24">
                 <div className="p-4 rounded-xl bg-card border shadow-sm mb-6">
                    <div className="flex gap-6 justify-between items-end mb-2">
                        <p className="text-foreground text-base font-bold">Overall Progress</p>
                        <p className="text-primary text-sm font-bold">{Math.round(progressPercentage)}%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium mt-2">{completedTasksCount} of {totalTasks} tasks completed</p>
                </div>
            
                {tasks.length === 0 ? (
                  <div className="text-center p-10 flex flex-col items-center justify-center gap-4 text-muted-foreground h-full rounded-xl border-2 border-dashed bg-card/50">
                    <span className="material-symbols-outlined text-6xl text-slate-400">check_box</span>
                    <h3 className="text-lg font-semibold text-foreground">All Clear!</h3>
                    <p>You have no tasks yet. Add one to get started.</p>
                  </div>
                ) : (
                    <>
                        <TaskSection title="Overdue" tasks={overdue} />
                        <TaskSection title="Today" tasks={today} />
                        <TaskSection title="Upcoming" tasks={upcoming} />
                        <TaskSection title="Completed" tasks={completed} />
                    </>
                )}
            </main>

            <div className="fixed bottom-24 right-6 z-30">
                 <Button onClick={() => openTaskDialog(null)} className="w-14 h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
                    <Plus className="h-6 w-6" />
                </Button>
            </div>
            
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{activeTask ? 'Edit' : 'Add'} Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={formState.title || ''} onChange={(e) => setFormState(p => ({...p, title: e.target.value}))} placeholder="e.g. Book photographer" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input id="dueDate" type="date" value={formState.dueDate || ''} onChange={(e) => setFormState(p => ({...p, dueDate: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" value={formState.notes || ''} onChange={(e) => setFormState(p => ({...p, notes: e.target.value}))} placeholder="Add any extra details..."/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveTask} className="w-full">Save Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the task "{taskToDelete?.title}".</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

