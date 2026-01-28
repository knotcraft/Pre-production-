import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export const AppLogo = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-primary font-extrabold text-2xl tracking-tight", className)} {...props}>
        <span className="material-symbols-outlined text-3xl">favorite</span>
        <span>Forever Bloom</span>
    </div>
  );
};
