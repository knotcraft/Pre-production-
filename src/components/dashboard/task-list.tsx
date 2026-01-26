"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirebase } from '@/firebase';
import { ref, get } from 'firebase/database';
import { cn } from '@/lib/utils';

type Task = {
  id: string;
  title: string;
  due: string;
  completed: boolean;
};

export function TaskList() {
    const { user } = useUser();
    const { database } = useFirebase();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    useEffect(() => {
        if (user && database) {
            const fetchTasks = async () => {
                const tasksRef = ref(database, `users/${user.uid}/tasks`);
                const snapshot = await get(tasksRef);
                if (snapshot.exists()) {
                    const tasksData = snapshot.val();
                    const tasksArray: Task[] = Object.keys(tasksData).map(key => ({
                        id: key,
                        ...tasksData[key]
                    }));
                    setTasks(tasksArray.filter(t => !t.completed).slice(0, 3));
                } else {
                    setTasks([]);
                }
            };
            fetchTasks();
        }
    }, [user, database]);

    const toggleTask = (id: string) => {
        setCompletedTasks(prev => 
            prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]
        );
    };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Upcoming Tasks</h3>
        <Link href="/tasks" passHref>
            <Button variant="link" className="text-primary px-0">See All</Button>
        </Link>
      </div>
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map(task => {
              const isCompleted = completedTasks.includes(task.id);
              return (
            <div key={task.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 dark:border-white/10">
              <div onClick={() => toggleTask(task.id)} className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border-2 border-primary/30 shrink-0">
                <div className={cn("w-3 h-3 rounded-sm bg-primary transition-opacity", isCompleted ? "opacity-100" : "opacity-0")}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.due}</p>
              </div>
              <ChevronRight className="text-muted-foreground" />
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
