import { Suspense } from 'react';
import VerifyEmailComponent from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';

function VerifyEmailSkeleton() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white text-text-dark font-sans antialiased p-6">
            <div className="w-full max-w-[400px] text-center space-y-4">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mx-auto" />
                </div>
                <Skeleton className="h-6 w-1/2 mx-auto pt-2" />
                <div className="mt-8 space-y-4 pt-4">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                </div>
                 <Skeleton className="h-4 w-3/4 mx-auto pt-4" />
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailSkeleton />}>
      <VerifyEmailComponent />
    </Suspense>
  );
}
