import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import Image from 'next/image';

export const AppLogo = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center justify-center h-9", className)} {...props}>
      <Image
        src="https://cdn.shopify.com/s/files/1/0866/1241/0648/files/Knotcraft_2.png?v=1769591502"
        alt="Knotcraft Logo"
        width={295}
        height={59}
        className="h-full w-auto object-contain"
        priority
      />
    </div>
  );
};
