"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/tasks", label: "Tasks", icon: "check_circle" },
  { href: "/guests", label: "Guests", icon: "group" },
  { href: "/budget", label: "Budget", icon: "payments" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md">
      <div className="m-2 rounded-full border border-slate-200/80 bg-white/80 shadow-lg shadow-black/5 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-full transition-colors duration-300",
                  isActive ? "text-primary" : "text-slate-500 hover:text-primary/80 dark:text-slate-400 dark:hover:text-primary/80"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center h-8 w-12 rounded-full transition-colors",
                  isActive ? 'bg-primary/10' : 'bg-transparent'
                )}>
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className={cn("text-[10px] font-bold tracking-wide", !isActive && "font-medium")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
