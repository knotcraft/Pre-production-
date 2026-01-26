'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const progressPercentage = 0;
    const completedTasksText = "0 of 0 tasks completed";

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-[#1c0d11] shadow-xl">
            <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#1c0d11]/90 backdrop-blur-md">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <Link href="/" className="text-foreground flex size-12 shrink-0 items-center justify-start">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </Link>
                    <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 text-center">Wedding Checklist</h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-primary gap-2 text-base font-bold p-0">
                            <span className="material-symbols-outlined">tune</span>
                        </button>
                    </div>
                </div>
                <div className="px-4 py-2">
                    <label className="flex flex-col min-w-40 h-10 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-[#f4f0f1] dark:bg-[#2d1a1f]">
                            <div className="text-muted-foreground flex items-center justify-center pl-3">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-foreground bg-transparent h-full placeholder:text-muted-foreground px-2 text-sm font-normal focus:outline-none focus:ring-0 border-none" placeholder="Search for tasks..." />
                        </div>
                    </label>
                </div>
            </header>

            <section className="bg-white dark:bg-[#1c0d11]">
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex gap-6 justify-between items-end">
                        <p className="text-foreground text-base font-bold">Overall Progress</p>
                        <p className="text-primary text-sm font-bold">{progressPercentage}%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#e6dbde] dark:bg-[#3d2a2e] overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium">{completedTasksText}</p>
                </div>
            </section>

            <main className="flex-1 px-4 py-2 space-y-2">
                {tasks.length === 0 ? (
                  <div className="text-center p-10">
                    <p className="text-muted-foreground">You have no tasks yet.</p>
                    <Button className="mt-4">
                      <span className="material-symbols-outlined text-base mr-2">add_task</span>
                      Add a Task
                    </Button>
                  </div>
                ) : (
                  <>{/* Tasks would be mapped here */}</>
                )}
                 <div className="h-24"></div>
            </main>

            <button className="fixed bottom-24 right-6 flex items-center justify-center size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 z-30 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
    );
}
