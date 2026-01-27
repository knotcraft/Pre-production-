
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirebase } from '@/firebase';
import { ref, onValue, update } from 'firebase/database';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function TaskListSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border bg-card p-4 dark:border-white/10 animate-pulse">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TaskList() {
    const { user } = useUser();
    const { database } = useFirebase();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && database) {
            setLoading(true);
            const tasksRef = ref(database, `users/${user.uid}/tasks`);
            const unsubscribe = onValue(tasksRef, (snapshot) => {
                if (snapshot.exists()) {
                    const tasksData = snapshot.val();
                    const tasksArray: Task[] = Object.keys(tasksData).map(key => ({
                        id: key,
                        ...tasksData[key]
                    }));
                    const sortedTasks = tasksArray
                        .sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                    setTasks(sortedTasks.slice(0, 3));
                } else {
                    setTasks([]);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        } else if (!user) {
            setLoading(false);
        }
    }, [user, database]);

    const toggleTask = (task: Task) => {
        if (user && database) {
            const taskRef = ref(database, `users/${user.uid}/tasks/${task.id}`);
            update(taskRef, { completed: !task.completed });
        }
    };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Upcoming Tasks</h3>
        <Link href="/tasks" passHref>
            <Button variant="link" className="text-primary px-0">See All</Button>
        </Link>
      </div>
      {loading ? (
        <TaskListSkeleton />
      ) : tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map(task => {
              return (
            <div key={task.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 dark:border-slate-800">
              <button onClick={() => toggleTask(task)} className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0 transition-colors", task.completed ? "bg-primary border-primary" : "border-slate-300 dark:border-slate-600")}>
                {task.completed && <Check className="h-4 w-4 text-white" />}
              </button>
              <Link href="/tasks" className="flex-1">
                <p className={cn("text-sm font-semibold", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </Link>
              <Link href="/tasks">
                 <ChevronRight className="text-muted-foreground" />
              </Link>
            </div>
              );
          })}
        </div>
      ) : (
        <div className="text-center p-6 rounded-xl border bg-card dark:border-white/10">
            <p className="text-muted-foreground">No upcoming tasks. Time to relax!</p>
            <Link href="/tasks">
                <Button variant="outline" className="mt-4">
                    Add a Task
                </Button>
            </Link>
        </div>
      )}
    </div>
  );
}
