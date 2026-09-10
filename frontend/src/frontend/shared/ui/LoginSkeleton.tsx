import React from 'react';
import { Skeleton } from '@/frontend/shared/ui/skeleton';

export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden animate-pulse">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200/30 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Skeleton className="w-32 h-32 rounded-full bg-slate-200 mb-6 border border-slate-100 shadow-md" />
          <Skeleton className="h-8 w-44 rounded-xl bg-slate-300 mb-2" />
          <Skeleton className="h-4 w-60 rounded bg-slate-200" />
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-6">
          {/* Email input skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24 bg-slate-200" />
            <Skeleton className="h-[56px] w-full rounded-2xl bg-slate-100" />
          </div>

          {/* Password input skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32 bg-slate-200" />
            <Skeleton className="h-[56px] w-full rounded-2xl bg-slate-100" />
          </div>

          {/* Submit button skeleton */}
          <Skeleton className="h-[56px] w-full rounded-2xl bg-emerald-600/30 mt-2" />
        </div>

        <div className="text-center mt-8 flex justify-center">
          <Skeleton className="h-4 w-32 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
